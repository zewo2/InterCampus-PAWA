const { pool } = require('../database/db');

// Get all internships
exports.getAll = async (req, res, next) => {
  try {
    const [estagios] = await pool.query(`
      SELECT e.*,
        c.estado as candidatura_estado,
        o.titulo, o.local,
        emp.nome_empresa,
        u_aluno.nome as aluno_nome,
        u_prof.nome as professor_nome,
        oe.nome as orientador_nome
      FROM Estagio e
      INNER JOIN Candidatura c ON e.id_candidatura = c.id_candidatura
      INNER JOIN OfertaEstagio o ON c.id_oferta = o.id_oferta
      INNER JOIN Empresa emp ON o.id_empresa = emp.id_empresa
      INNER JOIN Aluno a ON c.id_aluno = a.id_aluno
      INNER JOIN Utilizador u_aluno ON a.id_utilizador = u_aluno.id
      INNER JOIN ProfessorOrientador po ON e.id_professor = po.id_professor
      INNER JOIN Utilizador u_prof ON po.id_utilizador = u_prof.id
      INNER JOIN OrientadorEmpresa oe ON e.id_orientador = oe.id_orientador
      ORDER BY e.data_inicio DESC
    `);

    res.json({ success: true, data: estagios });
  } catch (err) {
    next(err);
  }
};

// Get internship by ID
exports.getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [estagios] = await pool.query(`
      SELECT e.*,
        c.estado as candidatura_estado, c.data_submissao,
        o.titulo, o.descricao, o.local, o.duracao,
        emp.nome_empresa, emp.morada as empresa_morada,
        a.curso, a.area_interesse,
        u_aluno.nome as aluno_nome, u_aluno.email as aluno_email,
        po.departamento,
        u_prof.nome as professor_nome, u_prof.email as professor_email,
        oe.nome as orientador_nome, oe.cargo, oe.email as orientador_email, oe.telefone as orientador_telefone
      FROM Estagio e
      INNER JOIN Candidatura c ON e.id_candidatura = c.id_candidatura
      INNER JOIN OfertaEstagio o ON c.id_oferta = o.id_oferta
      INNER JOIN Empresa emp ON o.id_empresa = emp.id_empresa
      INNER JOIN Aluno a ON c.id_aluno = a.id_aluno
      INNER JOIN Utilizador u_aluno ON a.id_utilizador = u_aluno.id
      INNER JOIN ProfessorOrientador po ON e.id_professor = po.id_professor
      INNER JOIN Utilizador u_prof ON po.id_utilizador = u_prof.id
      INNER JOIN OrientadorEmpresa oe ON e.id_orientador = oe.id_orientador
      WHERE e.id_estagio = ?
    `, [id]);

    if (estagios.length === 0) {
      return res.status(404).json({ error: 'Estágio não encontrado' });
    }

    res.json({ success: true, data: estagios[0] });
  } catch (err) {
    next(err);
  }
};

// Create internship (Gestor only - after accepting application)
exports.create = async (req, res, next) => {
  try {
    const { id_candidatura, id_professor, id_orientador, data_inicio, data_fim } = req.body;

    if (!id_candidatura || !id_professor || !id_orientador || !data_inicio) {
      return res.status(400).json({ error: 'Campos obrigatórios em falta' });
    }

    // Check if candidatura exists and is accepted
    const [candidaturas] = await pool.query(
      'SELECT estado FROM Candidatura WHERE id_candidatura = ?',
      [id_candidatura]
    );

    if (candidaturas.length === 0) {
      return res.status(404).json({ error: 'Candidatura não encontrada' });
    }

    if (candidaturas[0].estado !== 'Aceite') {
      return res.status(400).json({ error: 'Candidatura deve estar aceite' });
    }

    // Check if internship already exists for this application
    const [existing] = await pool.query(
      'SELECT id_estagio FROM Estagio WHERE id_candidatura = ?',
      [id_candidatura]
    );

    if (existing.length > 0) {
      return res.status(409).json({ error: 'Estágio já existe para esta candidatura' });
    }

    const [result] = await pool.query(
      `INSERT INTO Estagio (data_inicio, data_fim, id_candidatura, id_professor, id_orientador) 
       VALUES (?, ?, ?, ?, ?)`,
      [data_inicio, data_fim || null, id_candidatura, id_professor, id_orientador]
    );

    // Update student's internship status
    await pool.query(`
      UPDATE Aluno a
      INNER JOIN Candidatura c ON a.id_aluno = c.id_aluno
      SET a.estagio_status = true
      WHERE c.id_candidatura = ?
    `, [id_candidatura]);

    res.status(201).json({
      success: true,
      message: 'Estágio criado com sucesso',
      id: result.insertId
    });
  } catch (err) {
    next(err);
  }
};

// Update internship
exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { data_inicio, data_fim, estado_final } = req.body;

    const [existing] = await pool.query('SELECT id_estagio FROM Estagio WHERE id_estagio = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Estágio não encontrado' });
    }

    await pool.query(
      'UPDATE Estagio SET data_inicio = ?, data_fim = ?, estado_final = ? WHERE id_estagio = ?',
      [data_inicio, data_fim, estado_final, id]
    );

    res.json({ success: true, message: 'Estágio atualizado com sucesso' });
  } catch (err) {
    next(err);
  }
};

// Get evaluations for an internship
exports.getAvaliacoes = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [avaliacoes] = await pool.query(`
      SELECT * FROM Avaliacao WHERE id_estagio = ? ORDER BY data DESC
    `, [id]);

    res.json({ success: true, data: avaliacoes });
  } catch (err) {
    next(err);
  }
};
