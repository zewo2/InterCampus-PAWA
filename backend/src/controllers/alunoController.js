const { pool } = require('../database/db');

// Get all students
exports.getAll = async (req, res, next) => {
  try {
    const [alunos] = await pool.query(`
      SELECT a.*, u.nome, u.email 
      FROM Aluno a
      INNER JOIN Utilizador u ON a.id_utilizador = u.id
    `);
    res.json({ success: true, data: alunos });
  } catch (err) {
    next(err);
  }
};

// Get student by ID
exports.getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [alunos] = await pool.query(`
      SELECT a.*, u.nome, u.email 
      FROM Aluno a
      INNER JOIN Utilizador u ON a.id_utilizador = u.id
      WHERE a.id_aluno = ?
    `, [id]);

    if (alunos.length === 0) {
      return res.status(404).json({ error: 'Aluno não encontrado' });
    }

    res.json({ success: true, data: alunos[0] });
  } catch (err) {
    next(err);
  }
};

// Update student profile
exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { curso, CV, competencias, area_interesse } = req.body;

    // Check if student exists
    const [existing] = await pool.query('SELECT id_aluno FROM Aluno WHERE id_aluno = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Aluno não encontrado' });
    }

    await pool.query(
      'UPDATE Aluno SET curso = ?, CV = ?, competencias = ?, area_interesse = ? WHERE id_aluno = ?',
      [curso, CV, competencias, area_interesse, id]
    );

    res.json({ success: true, message: 'Perfil atualizado com sucesso' });
  } catch (err) {
    next(err);
  }
};

// Get student's applications
exports.getCandidaturas = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [candidaturas] = await pool.query(`
      SELECT c.*, o.titulo, o.descricao, e.nome_empresa
      FROM Candidatura c
      INNER JOIN OfertaEstagio o ON c.id_oferta = o.id_oferta
      INNER JOIN Empresa e ON o.id_empresa = e.id_empresa
      WHERE c.id_aluno = ?
      ORDER BY c.data_submissao DESC
    `, [id]);

    res.json({ success: true, data: candidaturas });
  } catch (err) {
    next(err);
  }
};

// Get student's internship (if exists)
exports.getEstagio = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [estagios] = await pool.query(`
      SELECT e.*, o.titulo, emp.nome_empresa
      FROM Estagio e
      INNER JOIN Candidatura c ON e.id_candidatura = c.id_candidatura
      INNER JOIN OfertaEstagio o ON c.id_oferta = o.id_oferta
      INNER JOIN Empresa emp ON o.id_empresa = emp.id_empresa
      WHERE c.id_aluno = ?
    `, [id]);

    if (estagios.length === 0) {
      return res.status(404).json({ error: 'Estágio não encontrado' });
    }

    res.json({ success: true, data: estagios[0] });
  } catch (err) {
    next(err);
  }
};
