const { pool } = require('../database/db');

// Get all managers
exports.getAll = async (req, res, next) => {
  try {
    const [gestores] = await pool.query(`
      SELECT g.*, u.nome, u.email 
      FROM Gestor g
      INNER JOIN Utilizador u ON g.id_utilizador = u.id
    `);
    res.json({ success: true, data: gestores });
  } catch (err) {
    next(err);
  }
};

// Get manager by ID
exports.getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [gestores] = await pool.query(`
      SELECT g.*, u.nome, u.email 
      FROM Gestor g
      INNER JOIN Utilizador u ON g.id_utilizador = u.id
      WHERE g.id_gestor = ?
    `, [id]);

    if (gestores.length === 0) {
      return res.status(404).json({ error: 'Gestor não encontrado' });
    }

    res.json({ success: true, data: gestores[0] });
  } catch (err) {
    next(err);
  }
};

// Dashboard stats (Gestor only)
exports.getStats = async (req, res, next) => {
  try {
    const [stats] = await pool.query(`
      SELECT 
        (SELECT COUNT(*) FROM Aluno) as total_alunos,
        (SELECT COUNT(*) FROM Empresa WHERE validada = true) as total_empresas,
        (SELECT COUNT(*) FROM OfertaEstagio) as total_ofertas,
        (SELECT COUNT(*) FROM Candidatura) as total_candidaturas,
        (SELECT COUNT(*) FROM Estagio) as total_estagios,
        (SELECT COUNT(*) FROM Candidatura WHERE estado = 'Pendente') as candidaturas_pendentes,
        (SELECT COUNT(*) FROM Empresa WHERE validada = false) as empresas_pendentes
    `);

    res.json({ success: true, data: stats[0] });
  } catch (err) {
    next(err);
  }
};
