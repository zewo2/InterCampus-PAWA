const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../database/db');

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
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const user = users[0];

    // Verify password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
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
      'SELECT id, nome, email, role FROM Utilizador WHERE id = ?',
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

// Password recovery (placeholder - would send email in production)
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
