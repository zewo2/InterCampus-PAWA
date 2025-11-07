const { pool } = require('../database/db');

// Get all evaluations
exports.getAll = async (req, res, next) => {
  try {
    const [avaliacoes] = await pool.query(`
      SELECT av.*,
        e.data_inicio, e.data_fim,
        u.nome as aluno_nome,
        o.titulo as oferta_titulo,
        emp.nome_empresa
      FROM Avaliacao av
      INNER JOIN Estagio e ON av.id_estagio = e.id_estagio
      INNER JOIN Candidatura c ON e.id_candidatura = c.id_candidatura
      INNER JOIN Aluno a ON c.id_aluno = a.id_aluno
      INNER JOIN Utilizador u ON a.id_utilizador = u.id
      INNER JOIN OfertaEstagio o ON c.id_oferta = o.id_oferta
      INNER JOIN Empresa emp ON o.id_empresa = emp.id_empresa
      ORDER BY av.data DESC
    `);

    res.json({ success: true, data: avaliacoes });
  } catch (err) {
    next(err);
  }
};

// Get evaluation by ID
exports.getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [avaliacoes] = await pool.query(`
      SELECT av.*,
        e.data_inicio, e.data_fim,
        u.nome as aluno_nome,
        o.titulo as oferta_titulo,
        emp.nome_empresa
      FROM Avaliacao av
      INNER JOIN Estagio e ON av.id_estagio = e.id_estagio
      INNER JOIN Candidatura c ON e.id_candidatura = c.id_candidatura
      INNER JOIN Aluno a ON c.id_aluno = a.id_aluno
      INNER JOIN Utilizador u ON a.id_utilizador = u.id
      INNER JOIN OfertaEstagio o ON c.id_oferta = o.id_oferta
      INNER JOIN Empresa emp ON o.id_empresa = emp.id_empresa
      WHERE av.id_avaliacao = ?
    `, [id]);

    if (avaliacoes.length === 0) {
      return res.status(404).json({ error: 'Avaliação não encontrada' });
    }

    res.json({ success: true, data: avaliacoes[0] });
  } catch (err) {
    next(err);
  }
};

// Create evaluation (Professor/OrientadorEmpresa only)
exports.create = async (req, res, next) => {
  try {
    const { tipo, pontuacao, relatorio_texto, id_estagio } = req.body;

    if (!tipo || !pontuacao || !id_estagio) {
      return res.status(400).json({ error: 'Campos obrigatórios em falta' });
    }

    const validTypes = ['Acompanhamento', 'Final'];
    if (!validTypes.includes(tipo)) {
      return res.status(400).json({ error: 'Tipo de avaliação inválido' });
    }

    if (pontuacao < 0 || pontuacao > 20) {
      return res.status(400).json({ error: 'Pontuação deve estar entre 0 e 20' });
    }

    // Check if internship exists
    const [estagios] = await pool.query('SELECT id_estagio FROM Estagio WHERE id_estagio = ?', [id_estagio]);
    if (estagios.length === 0) {
      return res.status(404).json({ error: 'Estágio não encontrado' });
    }

    const [result] = await pool.query(
      `INSERT INTO Avaliacao (tipo, data, pontuacao, relatorio_texto, id_estagio) 
       VALUES (?, CURDATE(), ?, ?, ?)`,
      [tipo, pontuacao, relatorio_texto, id_estagio]
    );

    res.status(201).json({
      success: true,
      message: 'Avaliação criada com sucesso',
      id: result.insertId
    });
  } catch (err) {
    next(err);
  }
};

// Update evaluation
exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { tipo, pontuacao, relatorio_texto } = req.body;

    const [existing] = await pool.query('SELECT id_avaliacao FROM Avaliacao WHERE id_avaliacao = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Avaliação não encontrada' });
    }

    if (pontuacao && (pontuacao < 0 || pontuacao > 20)) {
      return res.status(400).json({ error: 'Pontuação deve estar entre 0 e 20' });
    }

    await pool.query(
      'UPDATE Avaliacao SET tipo = ?, pontuacao = ?, relatorio_texto = ? WHERE id_avaliacao = ?',
      [tipo, pontuacao, relatorio_texto, id]
    );

    res.json({ success: true, message: 'Avaliação atualizada com sucesso' });
  } catch (err) {
    next(err);
  }
};

// Delete evaluation
exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;

    await pool.query('DELETE FROM Avaliacao WHERE id_avaliacao = ?', [id]);

    res.json({ success: true, message: 'Avaliação eliminada com sucesso' });
  } catch (err) {
    next(err);
  }
};
