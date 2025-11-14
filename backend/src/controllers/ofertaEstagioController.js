const { pool } = require('../database/db');

// Get all internship offers
exports.getAll = async (req, res, next) => {
  try {
    const { search, local, duracao, empresa } = req.query;
    
    let query = `
      SELECT o.*, e.nome_empresa, e.morada,
        (SELECT COUNT(*) FROM Candidatura c WHERE c.id_oferta = o.id_oferta) as total_candidaturas
      FROM OfertaEstagio o
      INNER JOIN Empresa e ON o.id_empresa = e.id_empresa
      WHERE e.validada = true
    `;
    const params = [];

    // Filter by company ID if provided
    if (empresa) {
      query += ' AND o.id_empresa = ?';
      params.push(parseInt(empresa));
    }

    if (search) {
      // Split search term into keywords and build OR conditions
      const keywords = search.trim().split(/\s+/); // Split by whitespace
      
      if (keywords.length > 1) {
        // Multiple keywords - search for ANY match (OR logic)
        const orConditions = [];
        keywords.forEach(() => {
          orConditions.push('o.titulo LIKE ? OR o.descricao LIKE ? OR o.requisitos LIKE ?');
        });
        query += ` AND (${orConditions.join(' OR ')})`;
        
        // Add each keyword 3 times (for titulo, descricao, requisitos)
        keywords.forEach(keyword => {
          const pattern = `%${keyword}%`;
          params.push(pattern, pattern, pattern);
        });
      } else {
        // Single keyword - simple search
        query += ' AND (o.titulo LIKE ? OR o.descricao LIKE ? OR o.requisitos LIKE ? OR e.nome_empresa LIKE ?)';
        const searchPattern = `%${search}%`;
        params.push(searchPattern, searchPattern, searchPattern, searchPattern);
      }
    }

    if (local) {
      query += ' AND (o.local LIKE ? OR e.morada LIKE ?)';
      const localPattern = `%${local}%`;
      params.push(localPattern, localPattern);
    }

    if (duracao) {
      query += ' AND o.duracao = ?';
      params.push(parseInt(duracao));
    }

    query += ' ORDER BY o.data_publicacao DESC';

    const [ofertas] = await pool.query(query, params);
    res.json({ success: true, data: ofertas });
  } catch (err) {
    next(err);
  }
};

// Get offer by ID
exports.getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [ofertas] = await pool.query(`
      SELECT o.*, e.nome_empresa, e.morada, e.NIF,
        (SELECT COUNT(*) FROM Candidatura c WHERE c.id_oferta = o.id_oferta) as total_candidaturas
      FROM OfertaEstagio o
      INNER JOIN Empresa e ON o.id_empresa = e.id_empresa
      WHERE o.id_oferta = ?
    `, [id]);

    if (ofertas.length === 0) {
      return res.status(404).json({ error: 'Oferta não encontrada' });
    }

    res.json({ success: true, data: ofertas[0] });
  } catch (err) {
    next(err);
  }
};

// Create internship offer (Empresa only)
exports.create = async (req, res, next) => {
  try {
    const { titulo, descricao, requisitos, duracao, local, id_empresa } = req.body;

    if (!titulo || !descricao || !duracao || !local || !id_empresa) {
      return res.status(400).json({ error: 'Campos obrigatórios em falta' });
    }

    const [result] = await pool.query(
      `INSERT INTO OfertaEstagio (titulo, descricao, requisitos, duracao, local, data_publicacao, id_empresa) 
       VALUES (?, ?, ?, ?, ?, CURDATE(), ?)`,
      [titulo, descricao, requisitos, duracao, local, id_empresa]
    );

    res.status(201).json({
      success: true,
      message: 'Oferta criada com sucesso',
      id: result.insertId
    });
  } catch (err) {
    next(err);
  }
};

// Update offer
exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { titulo, descricao, requisitos, duracao, local } = req.body;

    const [existing] = await pool.query('SELECT id_oferta FROM OfertaEstagio WHERE id_oferta = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Oferta não encontrada' });
    }

    await pool.query(
      'UPDATE OfertaEstagio SET titulo = ?, descricao = ?, requisitos = ?, duracao = ?, local = ? WHERE id_oferta = ?',
      [titulo, descricao, requisitos, duracao, local, id]
    );

    res.json({ success: true, message: 'Oferta atualizada com sucesso' });
  } catch (err) {
    next(err);
  }
};

// Delete offer
exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if there are applications
    const [candidaturas] = await pool.query('SELECT COUNT(*) as count FROM Candidatura WHERE id_oferta = ?', [id]);
    if (candidaturas[0].count > 0) {
      return res.status(400).json({ error: 'Não é possível eliminar oferta com candidaturas' });
    }

    await pool.query('DELETE FROM OfertaEstagio WHERE id_oferta = ?', [id]);

    res.json({ success: true, message: 'Oferta eliminada com sucesso' });
  } catch (err) {
    next(err);
  }
};

// Get applications for an offer (Empresa only)
exports.getCandidaturas = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [candidaturas] = await pool.query(`
      SELECT c.*, a.curso, a.CV, a.competencias, u.nome, u.email
      FROM Candidatura c
      INNER JOIN Aluno a ON c.id_aluno = a.id_aluno
      INNER JOIN Utilizador u ON a.id_utilizador = u.id
      WHERE c.id_oferta = ?
      ORDER BY c.data_submissao DESC
    `, [id]);

    res.json({ success: true, data: candidaturas });
  } catch (err) {
    next(err);
  }
};
