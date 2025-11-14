const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../database/db');
const fs = require('fs');
const path = require('path');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

// Register new user
exports.register = async (req, res, next) => {
  try {
    const { nome, email, password, role } = req.body;

    // Validate input
    if (!nome || !email || !password || !role) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    // Validate role
    const validRoles = ['Empresa', 'Aluno', 'Professor', 'Gestor'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: 'Role inválido' });
    }

    // Check if user exists
    const [existing] = await pool.query('SELECT id FROM Utilizador WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ error: 'Email já registado' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const [result] = await pool.query(
      'INSERT INTO Utilizador (nome, email, password, role) VALUES (?, ?, ?, ?)',
      [nome, email, hashedPassword, role]
    );

    const userId = result.insertId;

    // Create role-specific record
    if (role === 'Aluno') {
      await pool.query(
        'INSERT INTO Aluno (id_utilizador, estagio_status) VALUES (?, false)',
        [userId]
      );
    } else if (role === 'Professor') {
      await pool.query(
        'INSERT INTO ProfessorOrientador (id_utilizador) VALUES (?)',
        [userId]
      );
    } else if (role === 'Gestor') {
      await pool.query('INSERT INTO Gestor (id_utilizador) VALUES (?)', [userId]);
    }
    // Empresa will be handled separately with additional info

    // Generate token
    const token = jwt.sign({ id: userId, email, role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    res.status(201).json({
      success: true,
      message: 'Utilizador registado com sucesso',
      token,
      user: { id: userId, nome, email, role }
    });
  } catch (err) {
    next(err);
  }
};

// Login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email e password são obrigatórios' });
    }

    // Find user
    const [users] = await pool.query('SELECT * FROM Utilizador WHERE email = ?', [email]);
    if (users.length === 0) {
      console.log(`Login failed: Email not found - ${email}`);
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const user = users[0];

    // Verify password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      console.log(`Login failed: Invalid password for email - ${email}`);
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    next(err);
  }
};

// Get current user
exports.me = async (req, res, next) => {
  try {
    const [users] = await pool.query(
      'SELECT id, nome, email, role, profile_picture FROM Utilizador WHERE id = ?',
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'Utilizador não encontrado' });
    }

    res.json({ success: true, user: users[0] });
  } catch (err) {
    next(err);
  }
};

// Password recovery - Request reset link
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email é obrigatório' });
    }

    const [users] = await pool.query('SELECT id, nome FROM Utilizador WHERE email = ?', [email]);
    
    if (users.length === 0) {
      // Don't reveal if email exists for security
      return res.json({ 
        success: true, 
        message: 'Se o email existir, será enviado um link de recuperação' 
      });
    }

    const user = users[0];
    
    // Generate reset token (valid for 1 hour)
    const resetToken = jwt.sign(
      { id: user.id, email, type: 'password-reset' },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    // In production, send email with reset link
    // const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    // await sendEmail(email, 'Password Reset', resetLink);

    console.log(`Password reset requested for: ${email}`);
    console.log(`Reset token: ${resetToken}`);
    console.log(`Reset link: ${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`);

    res.json({ 
      success: true, 
      message: 'Link de recuperação enviado (verifique o console do servidor em desenvolvimento)',
      // In development, return token for testing
      ...(process.env.NODE_ENV === 'development' && { resetToken })
    });
  } catch (err) {
    next(err);
  }
};

// Validate reset token
exports.validateResetToken = async (req, res, next) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Token é obrigatório' });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      
      if (decoded.type !== 'password-reset') {
        return res.status(400).json({ error: 'Token inválido' });
      }

      // Check if user still exists
      const [users] = await pool.query('SELECT id FROM Utilizador WHERE id = ?', [decoded.id]);
      
      if (users.length === 0) {
        return res.status(400).json({ error: 'Utilizador não encontrado' });
      }

      res.json({ success: true, valid: true });
    } catch (jwtError) {
      if (jwtError.name === 'TokenExpiredError') {
        return res.status(400).json({ error: 'Link expirado. Solicite um novo link de recuperação.' });
      }
      return res.status(400).json({ error: 'Token inválido' });
    }
  } catch (err) {
    next(err);
  }
};

// Reset password with token
exports.resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ error: 'Token e palavra-passe são obrigatórios' });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'A palavra-passe deve ter pelo menos 8 caracteres' });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      
      if (decoded.type !== 'password-reset') {
        return res.status(400).json({ error: 'Token inválido' });
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Update password
      await pool.query(
        'UPDATE Utilizador SET password = ? WHERE id = ?',
        [hashedPassword, decoded.id]
      );

      console.log(`Password reset successful for user ID: ${decoded.id}`);

      res.json({ 
        success: true, 
        message: 'Palavra-passe redefinida com sucesso' 
      });
    } catch (jwtError) {
      if (jwtError.name === 'TokenExpiredError') {
        return res.status(400).json({ error: 'Link expirado. Solicite um novo link de recuperação.' });
      }
      return res.status(400).json({ error: 'Token inválido' });
    }
  } catch (err) {
    next(err);
  }
};

// Old recover password endpoint (deprecated - kept for backwards compatibility)
exports.recoverPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email é obrigatório' });
    }

    const [users] = await pool.query('SELECT id FROM Utilizador WHERE email = ?', [email]);
    if (users.length === 0) {
      // Don't reveal if email exists
      return res.json({ success: true, message: 'Se o email existir, será enviado um link de recuperação' });
    }

    // TODO: Generate reset token and send email
    // For now, just return success
    res.json({ success: true, message: 'Link de recuperação enviado (funcionalidade em desenvolvimento)' });
  } catch (err) {
    next(err);
  }
};

// Update user profile
exports.updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { nome, email } = req.body;

    if (!nome || !email) {
      return res.status(400).json({ error: 'Nome e email são obrigatórios' });
    }

    // Check if email is already in use by another user
    const [existing] = await pool.query(
      'SELECT id FROM Utilizador WHERE email = ? AND id != ?',
      [email, userId]
    );

    if (existing.length > 0) {
      return res.status(409).json({ error: 'Email já está em uso' });
    }

    // Handle profile picture upload
    let profilePicturePath = null;
    if (req.file) {
      // Delete old profile picture if exists
      const [currentUser] = await pool.query(
        'SELECT profile_picture FROM Utilizador WHERE id = ?',
        [userId]
      );
      
      if (currentUser[0]?.profile_picture) {
        const oldPicturePath = path.join(__dirname, '../../', currentUser[0].profile_picture);
        if (fs.existsSync(oldPicturePath)) {
          fs.unlinkSync(oldPicturePath);
        }
      }

      // Store relative path
      profilePicturePath = `uploads/profile-pictures/${req.file.filename}`;
    }

    // Update user
    if (profilePicturePath) {
      await pool.query(
        'UPDATE Utilizador SET nome = ?, email = ?, profile_picture = ? WHERE id = ?',
        [nome, email, profilePicturePath, userId]
      );
    } else {
      await pool.query(
        'UPDATE Utilizador SET nome = ?, email = ? WHERE id = ?',
        [nome, email, userId]
      );
    }

    // Get updated user
    const [users] = await pool.query(
      'SELECT id, nome, email, role, profile_picture FROM Utilizador WHERE id = ?',
      [userId]
    );

    res.json({
      success: true,
      message: 'Perfil atualizado com sucesso',
      user: users[0]
    });
  } catch (err) {
    next(err);
  }
};
