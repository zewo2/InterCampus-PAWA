const { pool } = require('../database/db');

// Get all professors
exports.getAll = async (req, res, next) => {
  try {
    const [professores] = await pool.query(`
      SELECT p.*, u.nome, u.email 
      FROM ProfessorOrientador p
      INNER JOIN Utilizador u ON p.id_utilizador = u.id
    `);
    res.json({ success: true, data: professores });
  } catch (err) {
    next(err);
  }
};

// Get professor by ID
exports.getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [professores] = await pool.query(`
      SELECT p.*, u.nome, u.email 
      FROM ProfessorOrientador p
      INNER JOIN Utilizador u ON p.id_utilizador = u.id
      WHERE p.id_professor = ?
    `, [id]);

    if (professores.length === 0) {
      return res.status(404).json({ error: 'Professor não encontrado' });
    }

    res.json({ success: true, data: professores[0] });
  } catch (err) {
    next(err);
  }
};

// Update professor
exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { departamento } = req.body;

    const [existing] = await pool.query('SELECT id_professor FROM ProfessorOrientador WHERE id_professor = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Professor não encontrado' });
    }

    await pool.query(
      'UPDATE ProfessorOrientador SET departamento = ? WHERE id_professor = ?',
      [departamento, id]
    );

    res.json({ success: true, message: 'Professor atualizado com sucesso' });
  } catch (err) {
    next(err);
  }
};

// Get professor's supervised internships
exports.getEstagios = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [estagios] = await pool.query(`
      SELECT e.*,
        o.titulo, o.local,
        emp.nome_empresa,
        u.nome as aluno_nome, u.email as aluno_email
      FROM Estagio e
      INNER JOIN Candidatura c ON e.id_candidatura = c.id_candidatura
      INNER JOIN OfertaEstagio o ON c.id_oferta = o.id_oferta
      INNER JOIN Empresa emp ON o.id_empresa = emp.id_empresa
      INNER JOIN Aluno a ON c.id_aluno = a.id_aluno
      INNER JOIN Utilizador u ON a.id_utilizador = u.id
      WHERE e.id_professor = ?
      ORDER BY e.data_inicio DESC
    `, [id]);

    res.json({ success: true, data: estagios });
  } catch (err) {
    next(err);
  }
};
