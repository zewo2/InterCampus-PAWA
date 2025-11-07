const { pool } = require('../database/db');

// Get all companies
exports.getAll = async (req, res, next) => {
  try {
    const [empresas] = await pool.query(`
      SELECT e.*, u.email 
      FROM Empresa e
      INNER JOIN Utilizador u ON e.id_utilizador = u.id
    `);
    res.json({ success: true, data: empresas });
  } catch (err) {
    next(err);
  }
};

// Get company by ID
exports.getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [empresas] = await pool.query(`
      SELECT e.*, u.email 
      FROM Empresa e
      INNER JOIN Utilizador u ON e.id_utilizador = u.id
      WHERE e.id_empresa = ?
    `, [id]);

    if (empresas.length === 0) {
      return res.status(404).json({ error: 'Empresa não encontrada' });
    }

    res.json({ success: true, data: empresas[0] });
  } catch (err) {
    next(err);
  }
};

// Create company (after user registration)
exports.create = async (req, res, next) => {
  try {
    const { nome_empresa, NIF, morada, id_utilizador } = req.body;

    if (!nome_empresa || !NIF || !morada || !id_utilizador) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    const [result] = await pool.query(
      'INSERT INTO Empresa (nome_empresa, NIF, morada, validada, id_utilizador) VALUES (?, ?, ?, false, ?)',
      [nome_empresa, NIF, morada, id_utilizador]
    );

    res.status(201).json({
      success: true,
      message: 'Empresa criada com sucesso. Aguarda validação.',
      id: result.insertId
    });
  } catch (err) {
    next(err);
  }
};

// Update company
exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nome_empresa, NIF, morada } = req.body;

    const [existing] = await pool.query('SELECT id_empresa FROM Empresa WHERE id_empresa = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Empresa não encontrada' });
    }

    await pool.query(
      'UPDATE Empresa SET nome_empresa = ?, NIF = ?, morada = ? WHERE id_empresa = ?',
      [nome_empresa, NIF, morada, id]
    );

    res.json({ success: true, message: 'Empresa atualizada com sucesso' });
  } catch (err) {
    next(err);
  }
};

// Validate company (Gestor only)
exports.validate = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { validada } = req.body;

    await pool.query('UPDATE Empresa SET validada = ? WHERE id_empresa = ?', [validada, id]);

    res.json({ success: true, message: 'Estado de validação atualizado' });
  } catch (err) {
    next(err);
  }
};

// Get company's job offers
exports.getOfertas = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [ofertas] = await pool.query(`
      SELECT * FROM OfertaEstagio WHERE id_empresa = ? ORDER BY data_publicacao DESC
    `, [id]);

    res.json({ success: true, data: ofertas });
  } catch (err) {
    next(err);
  }
};
