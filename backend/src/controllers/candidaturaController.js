const { pool } = require('../database/db');

// Get all applications (filtered by role and user)
exports.getAll = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    let query;
    let params = [];

    if (userRole === 'Aluno') {
      // Students see only their own applications
      query = `
        SELECT c.*, 
          o.titulo as oferta_titulo, 
          e.nome_empresa,
          u.nome as aluno_nome, u.email as aluno_email
        FROM Candidatura c
        INNER JOIN OfertaEstagio o ON c.id_oferta = o.id_oferta
        INNER JOIN Empresa e ON o.id_empresa = e.id_empresa
        INNER JOIN Aluno a ON c.id_aluno = a.id_aluno
        INNER JOIN Utilizador u ON a.id_utilizador = u.id
        WHERE a.id_utilizador = ?
        ORDER BY c.data_submissao DESC
      `;
      params = [userId];
    } else if (userRole === 'Empresa') {
      // Companies see applications to their job offers
      query = `
        SELECT c.*, 
          o.titulo as oferta_titulo, 
          e.nome_empresa,
          u.nome as aluno_nome, u.email as aluno_email
        FROM Candidatura c
        INNER JOIN OfertaEstagio o ON c.id_oferta = o.id_oferta
        INNER JOIN Empresa e ON o.id_empresa = e.id_empresa
        INNER JOIN Aluno a ON c.id_aluno = a.id_aluno
        INNER JOIN Utilizador u ON a.id_utilizador = u.id
        WHERE e.id_utilizador = ?
        ORDER BY c.data_submissao DESC
      `;
      params = [userId];
    } else if (userRole === 'Professor') {
      // Professors see applications from students they supervise
      query = `
        SELECT c.*, 
          o.titulo as oferta_titulo, 
          e.nome_empresa,
          u.nome as aluno_nome, u.email as aluno_email
        FROM Candidatura c
        INNER JOIN OfertaEstagio o ON c.id_oferta = o.id_oferta
        INNER JOIN Empresa e ON o.id_empresa = e.id_empresa
        INNER JOIN Aluno a ON c.id_aluno = a.id_aluno
        INNER JOIN Utilizador u ON a.id_utilizador = u.id
        INNER JOIN Estagio es ON c.id_candidatura = es.id_candidatura
        WHERE es.id_professor = (SELECT id_professor FROM ProfessorOrientador WHERE id_utilizador = ?)
        ORDER BY c.data_submissao DESC
      `;
      params = [userId];
    } else if (userRole === 'Gestor') {
      // Managers see all applications
      query = `
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
      `;
    } else {
      return res.status(403).json({ error: 'Acesso não autorizado' });
    }

    const [candidaturas] = await pool.query(query, params);

    res.json({ success: true, data: candidaturas });
  } catch (err) {
    next(err);
  }
};

// Get application by ID (with authorization check)
exports.getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    const [candidaturas] = await pool.query(`
      SELECT c.*, 
        o.titulo, o.descricao, o.requisitos, o.duracao, o.local,
        e.nome_empresa, e.morada, e.id_utilizador as empresa_user_id,
        a.curso, a.CV, a.competencias, a.area_interesse, a.id_utilizador as aluno_user_id,
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

    const candidatura = candidaturas[0];

    // Authorization check
    if (userRole === 'Aluno') {
      // Students can only see their own applications
      if (candidatura.aluno_user_id !== userId) {
        return res.status(403).json({ error: 'Acesso negado a esta candidatura' });
      }
    } else if (userRole === 'Empresa') {
      // Companies can only see applications to their offers
      if (candidatura.empresa_user_id !== userId) {
        return res.status(403).json({ error: 'Acesso negado a esta candidatura' });
      }
    } else if (userRole === 'Professor') {
      // Professors can only see applications from students they supervise
      const [supervised] = await pool.query(`
        SELECT es.id_estagio 
        FROM Estagio es
        WHERE es.id_candidatura = ? 
        AND es.id_professor = (SELECT id_professor FROM ProfessorOrientador WHERE id_utilizador = ?)
      `, [id, userId]);
      
      if (supervised.length === 0) {
        return res.status(403).json({ error: 'Acesso negado a esta candidatura' });
      }
    }
    // Gestor can see all applications (no check needed)

    // Remove sensitive user IDs before sending response
    delete candidatura.aluno_user_id;
    delete candidatura.empresa_user_id;

    res.json({ success: true, data: candidatura });
  } catch (err) {
    next(err);
  }
};

// Create application (Aluno only)
exports.create = async (req, res, next) => {
  try {
    const { id_oferta } = req.body;
    const userId = req.user.id;

    if (!id_oferta) {
      return res.status(400).json({ error: 'id_oferta é obrigatório' });
    }

    // Get the student's id_aluno from their user ID
    const [alunos] = await pool.query(
      'SELECT id_aluno FROM Aluno WHERE id_utilizador = ?',
      [userId]
    );

    if (alunos.length === 0) {
      return res.status(404).json({ error: 'Perfil de aluno não encontrado' });
    }

    const id_aluno = alunos[0].id_aluno;

    // Check if already applied
    const [existing] = await pool.query(
      'SELECT id_candidatura FROM Candidatura WHERE id_aluno = ? AND id_oferta = ?',
      [id_aluno, id_oferta]
    );

    if (existing.length > 0) {
      return res.status(409).json({ error: 'Já candidatou a esta oferta' });
    }

    // Verify offer exists
    const [ofertas] = await pool.query(
      'SELECT id_oferta FROM OfertaEstagio WHERE id_oferta = ?',
      [id_oferta]
    );

    if (ofertas.length === 0) {
      return res.status(404).json({ error: 'Oferta não encontrada' });
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

    const validStates = ['Pendente', 'Aceite', 'Recusado', 'Anulada'];
    if (!validStates.includes(estado)) {
      return res.status(400).json({ error: 'Estado inválido' });
    }

    const [existing] = await pool.query('SELECT id_candidatura FROM Candidatura WHERE id_candidatura = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Candidatura não encontrada' });
    }

    if (estado === 'Anulada') {
      await pool.query('UPDATE Candidatura SET estado = ? WHERE id_candidatura = ?', ['Pendente', id]);

      await pool.query('DELETE FROM Estagio WHERE id_candidatura = ?', [id]);

      await pool.query(
        `UPDATE Aluno a
         INNER JOIN Candidatura c ON a.id_aluno = c.id_aluno
         SET a.estagio_status = false
         WHERE c.id_candidatura = ?`,
        [id]
      );

      return res.json({ success: true, message: 'Candidatura anulada com sucesso' });
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
