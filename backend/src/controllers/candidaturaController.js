const { pool } = require('../database/db');

// Get all applications (filtered by role)
exports.getAll = async (req, res, next) => {
  try {
    const [candidaturas] = await pool.query(`
      SELECT c.*, 
        o.titulo as oferta_titulo, 
        e.nome_empresa,
        u.nome as aluno_nome, u.email as aluno_email
      FROM Candidatura c
      INNER JOIN OfertaEstagio o ON c.id_oferta = o.id_oferta
      INNER JOIN Empresa e ON o.id_empresa = e.id_empresa
      INNER JOIN Aluno a ON c.id_aluno = a.id_aluno
      INNER JOIN Utilizador u ON a.id_utilizador = u.id
      ORDER BY c.data_submissao DESC
    `);

    res.json({ success: true, data: candidaturas });
  } catch (err) {
    next(err);
  }
};

// Get application by ID
exports.getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [candidaturas] = await pool.query(`
      SELECT c.*, 
        o.titulo, o.descricao, o.requisitos, o.duracao, o.local,
        e.nome_empresa, e.morada,
        a.curso, a.CV, a.competencias, a.area_interesse,
        u.nome as aluno_nome, u.email as aluno_email
      FROM Candidatura c
      INNER JOIN OfertaEstagio o ON c.id_oferta = o.id_oferta
      INNER JOIN Empresa e ON o.id_empresa = e.id_empresa
      INNER JOIN Aluno a ON c.id_aluno = a.id_aluno
      INNER JOIN Utilizador u ON a.id_utilizador = u.id
      WHERE c.id_candidatura = ?
    `, [id]);

    if (candidaturas.length === 0) {
      return res.status(404).json({ error: 'Candidatura não encontrada' });
    }

    res.json({ success: true, data: candidaturas[0] });
  } catch (err) {
    next(err);
  }
};

// Create application (Aluno only)
exports.create = async (req, res, next) => {
  try {
    const { id_aluno, id_oferta } = req.body;

    if (!id_aluno || !id_oferta) {
      return res.status(400).json({ error: 'id_aluno e id_oferta são obrigatórios' });
    }

    // Check if already applied
    const [existing] = await pool.query(
      'SELECT id_candidatura FROM Candidatura WHERE id_aluno = ? AND id_oferta = ?',
      [id_aluno, id_oferta]
    );

    if (existing.length > 0) {
      return res.status(409).json({ error: 'Já candidatou a esta oferta' });
    }

    const [result] = await pool.query(
      `INSERT INTO Candidatura (data_submissao, estado, id_aluno, id_oferta) 
       VALUES (CURDATE(), 'Pendente', ?, ?)`,
      [id_aluno, id_oferta]
    );

    res.status(201).json({
      success: true,
      message: 'Candidatura submetida com sucesso',
      id: result.insertId
    });
  } catch (err) {
    next(err);
  }
};

// Update application status (Empresa/Gestor only)
exports.updateStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const validStates = ['Pendente', 'Aceite', 'Recusado'];
    if (!validStates.includes(estado)) {
      return res.status(400).json({ error: 'Estado inválido' });
    }

    const [existing] = await pool.query('SELECT id_candidatura FROM Candidatura WHERE id_candidatura = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Candidatura não encontrada' });
    }

    await pool.query('UPDATE Candidatura SET estado = ? WHERE id_candidatura = ?', [estado, id]);

    res.json({ success: true, message: 'Estado da candidatura atualizado' });
  } catch (err) {
    next(err);
  }
};

// Delete application
exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if linked to internship
    const [estagios] = await pool.query('SELECT id_estagio FROM Estagio WHERE id_candidatura = ?', [id]);
    if (estagios.length > 0) {
      return res.status(400).json({ error: 'Não é possível eliminar candidatura associada a estágio' });
    }

    await pool.query('DELETE FROM Candidatura WHERE id_candidatura = ?', [id]);

    res.json({ success: true, message: 'Candidatura eliminada com sucesso' });
  } catch (err) {
    next(err);
  }
};
