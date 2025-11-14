const fs = require('fs');
const path = require('path');
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

// Get supervised students for authenticated professor
exports.getSupervisedStudents = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const [[professor]] = await pool.query(
      'SELECT id_professor FROM ProfessorOrientador WHERE id_utilizador = ?',
      [userId]
    );

    if (!professor) {
      return res.status(404).json({ error: 'Perfil de professor não encontrado' });
    }

    const [rows] = await pool.query(
      `SELECT 
        e.id_estagio AS idEstagio,
        e.data_inicio AS dataInicio,
        e.data_fim AS dataFim,
        e.estado_final AS estadoFinal,
        c.estado AS candidaturaEstado,
        u_aluno.id AS idUtilizadorAluno,
        a.id_aluno AS idAluno,
        u_aluno.nome AS alunoNome,
        u_aluno.email AS alunoEmail,
        a.curso AS alunoCurso,
        a.area_interesse AS areaInteresse,
        o.titulo AS ofertaTitulo,
        o.local AS ofertaLocal,
        o.duracao AS ofertaDuracao,
        emp.nome_empresa AS empresaNome
      FROM Estagio e
      INNER JOIN Candidatura c ON e.id_candidatura = c.id_candidatura
      INNER JOIN OfertaEstagio o ON c.id_oferta = o.id_oferta
      INNER JOIN Empresa emp ON o.id_empresa = emp.id_empresa
      INNER JOIN Aluno a ON c.id_aluno = a.id_aluno
      INNER JOIN Utilizador u_aluno ON a.id_utilizador = u_aluno.id
      WHERE e.id_professor = ?
      ORDER BY e.data_inicio DESC, u_aluno.nome ASC`,
      [professor.id_professor]
    );

    res.json({
      success: true,
      data: rows.map((row) => ({
        ...row,
        idEstagio: Number(row.idEstagio),
        idUtilizadorAluno: Number(row.idUtilizadorAluno),
        idAluno: Number(row.idAluno)
      }))
    });
  } catch (err) {
    next(err);
  }
};

// Supervised internships for authenticated professor
exports.getSupervisedInternships = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const [[professor]] = await pool.query(
      'SELECT id_professor FROM ProfessorOrientador WHERE id_utilizador = ?',
      [userId]
    );

    if (!professor) {
      return res.status(404).json({ error: 'Perfil de professor não encontrado' });
    }

    const professorId = professor.id_professor;

    const [rows] = await pool.query(
      `SELECT
        e.id_estagio AS idEstagio,
        e.data_inicio AS dataInicio,
        e.data_fim AS dataFim,
        e.estado_final AS estadoFinal,
        c.estado AS candidaturaEstado,
        o.titulo AS ofertaTitulo,
        o.local AS ofertaLocal,
        o.duracao AS ofertaDuracao,
        emp.nome_empresa AS empresaNome,
        orientador.nome AS orientadorNome,
        orientador.cargo AS orientadorCargo,
        orientador.email AS orientadorEmail,
        orientador.telefone AS orientadorTelefone,
        alunoUser.nome AS alunoNome,
        alunoUser.email AS alunoEmail,
        aluno.curso AS alunoCurso,
        aluno.area_interesse AS areaInteresse,
        CASE WHEN avFinal.id_avaliacao IS NULL THEN 1 ELSE 0 END AS avaliacaoFinalPendente
      FROM Estagio e
      INNER JOIN Candidatura c ON e.id_candidatura = c.id_candidatura
      INNER JOIN OfertaEstagio o ON c.id_oferta = o.id_oferta
      INNER JOIN Empresa emp ON o.id_empresa = emp.id_empresa
      INNER JOIN Aluno aluno ON c.id_aluno = aluno.id_aluno
      INNER JOIN Utilizador alunoUser ON aluno.id_utilizador = alunoUser.id
      INNER JOIN OrientadorEmpresa orientador ON e.id_orientador = orientador.id_orientador
      LEFT JOIN Avaliacao avFinal
        ON avFinal.id_estagio = e.id_estagio AND avFinal.tipo = 'Final'
      WHERE e.id_professor = ?
      ORDER BY e.data_inicio DESC, alunoUser.nome ASC`,
      [professorId]
    );

    const normalized = rows.map((row) => ({
      ...row,
      idEstagio: Number(row.idEstagio),
      ofertaDuracao: row.ofertaDuracao != null ? Number(row.ofertaDuracao) : null,
      avaliacaoFinalPendente: Boolean(Number(row.avaliacaoFinalPendente))
    }));

    const today = new Date();

    const summary = normalized.reduce(
      (acc, item) => {
        acc.total += 1;

        if (item.avaliacaoFinalPendente) {
          acc.pendentesAvaliacao += 1;
        }

        const normalizedStatus = String(item.estadoFinal || '').toLowerCase();
        if (normalizedStatus === 'concluido') {
          acc.concluidos += 1;
          return acc;
        }

        if (normalizedStatus === 'cancelado') {
          acc.cancelados += 1;
          return acc;
        }

        if (!item.dataInicio) {
          acc.ativos += 1;
          return acc;
        }

        const start = new Date(item.dataInicio);

        if (!Number.isNaN(start.getTime()) && start > today) {
          acc.porIniciar += 1;
        } else {
          acc.ativos += 1;
        }

        return acc;
      },
      { total: 0, ativos: 0, porIniciar: 0, concluidos: 0, cancelados: 0, pendentesAvaliacao: 0 }
    );

    res.json({
      success: true,
      data: {
        summary,
        internships: normalized
      }
    });
  } catch (err) {
    next(err);
  }
};

// Dashboard metrics for authenticated professor
exports.getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const [[professor]] = await pool.query(
      'SELECT id_professor, departamento FROM ProfessorOrientador WHERE id_utilizador = ?',
      [userId]
    );

    if (!professor) {
      return res.status(404).json({ error: 'Perfil de professor não encontrado' });
    }

    const professorId = professor.id_professor;

    const [[summaryRow]] = await pool.query(
      `SELECT 
        COUNT(*) AS totalEstagios,
        COUNT(DISTINCT c.id_aluno) AS alunosOrientados,
        SUM(CASE WHEN e.estado_final IS NULL THEN 1 ELSE 0 END) AS estagiosAtivos,
        SUM(CASE WHEN e.estado_final = 'Concluido' THEN 1 ELSE 0 END) AS estagiosConcluidos
      FROM Estagio e
      INNER JOIN Candidatura c ON e.id_candidatura = c.id_candidatura
      WHERE e.id_professor = ?`,
      [professorId]
    );

    const [[pendingRow]] = await pool.query(
      `SELECT COUNT(*) AS avaliacoesPendentes
      FROM Estagio e
      WHERE e.id_professor = ?
      AND NOT EXISTS (
        SELECT 1 FROM Avaliacao av
        WHERE av.id_estagio = e.id_estagio
        AND av.tipo = 'Final'
      )`,
      [professorId]
    );

    const [recentEstagios] = await pool.query(
      `SELECT 
        e.id_estagio AS idEstagio,
        e.data_inicio AS dataInicio,
        e.data_fim AS dataFim,
        e.estado_final AS estadoFinal,
        o.titulo AS ofertaTitulo,
        emp.nome_empresa AS empresaNome,
        u.nome AS alunoNome
      FROM Estagio e
      INNER JOIN Candidatura c ON e.id_candidatura = c.id_candidatura
      INNER JOIN OfertaEstagio o ON c.id_oferta = o.id_oferta
      INNER JOIN Empresa emp ON o.id_empresa = emp.id_empresa
      INNER JOIN Aluno a ON c.id_aluno = a.id_aluno
      INNER JOIN Utilizador u ON a.id_utilizador = u.id
      WHERE e.id_professor = ?
      ORDER BY e.data_inicio DESC
      LIMIT 6`,
      [professorId]
    );

    res.json({
      success: true,
      data: {
        professor: {
          id: professorId,
          departamento: professor.departamento || null
        },
        summary: {
          totalEstagios: Number(summaryRow?.totalEstagios) || 0,
          alunosOrientados: Number(summaryRow?.alunosOrientados) || 0,
          estagiosAtivos: Number(summaryRow?.estagiosAtivos) || 0,
          estagiosConcluidos: Number(summaryRow?.estagiosConcluidos) || 0,
          avaliacoesPendentes: Number(pendingRow?.avaliacoesPendentes) || 0
        },
        recentEstagios
      }
    });
  } catch (err) {
    next(err);
  }
};

// Document list for authenticated professor
exports.getDocuments = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const [[professor]] = await pool.query(
      'SELECT id_professor FROM ProfessorOrientador WHERE id_utilizador = ?',
      [userId]
    );

    if (!professor) {
      return res.status(404).json({ error: 'Perfil de professor não encontrado' });
    }

    const professorId = professor.id_professor;

    const [internships] = await pool.query(
      `SELECT 
        e.id_estagio AS idEstagio,
        o.titulo AS ofertaTitulo,
        u.nome AS alunoNome
      FROM Estagio e
      INNER JOIN Candidatura c ON e.id_candidatura = c.id_candidatura
      INNER JOIN OfertaEstagio o ON c.id_oferta = o.id_oferta
      INNER JOIN Aluno a ON c.id_aluno = a.id_aluno
      INNER JOIN Utilizador u ON a.id_utilizador = u.id
      WHERE e.id_professor = ?
      ORDER BY u.nome ASC`,
      [professorId]
    );

    const [documents] = await pool.query(
      `SELECT 
        d.id_documento AS idDocumento,
        d.id_estagio AS idEstagio,
        d.nome_original AS nomeOriginal,
        d.ficheiro AS ficheiro,
        d.categoria AS categoria,
        d.tipo AS tipo,
        d.tamanho AS tamanho,
        d.uploaded_at AS uploadedAt,
        o.titulo AS ofertaTitulo,
        u.nome AS alunoNome,
        u.email AS alunoEmail
      FROM DocumentoEstagio d
      INNER JOIN Estagio e ON d.id_estagio = e.id_estagio
      INNER JOIN Candidatura c ON e.id_candidatura = c.id_candidatura
      INNER JOIN OfertaEstagio o ON c.id_oferta = o.id_oferta
      INNER JOIN Aluno a ON c.id_aluno = a.id_aluno
      INNER JOIN Utilizador u ON a.id_utilizador = u.id
      WHERE e.id_professor = ?
      ORDER BY d.uploaded_at DESC`,
      [professorId]
    );

    const normalizedDocs = documents.map((doc) => {
      const categoria = String(doc.categoria || 'outro').toLowerCase();
      return {
      idDocumento: Number(doc.idDocumento),
      idEstagio: Number(doc.idEstagio),
      nomeOriginal: doc.nomeOriginal,
      ficheiro: doc.ficheiro,
      categoria,
      tipo: doc.tipo,
      tamanho: Number(doc.tamanho) || 0,
      uploadedAt: doc.uploadedAt,
      ofertaTitulo: doc.ofertaTitulo,
      alunoNome: doc.alunoNome,
      alunoEmail: doc.alunoEmail,
      url: `/uploads/documents/${doc.ficheiro}`
      };
    });

    const summary = normalizedDocs.reduce(
      (acc, doc) => {
        acc.total += 1;
        const key = (doc.categoria || 'outro').toLowerCase();
        if (!acc.porCategoria[key]) {
          acc.porCategoria[key] = 0;
        }
        acc.porCategoria[key] += 1;
        return acc;
      },
      { total: 0, porCategoria: {} }
    );

    res.json({
      success: true,
      data: {
        summary,
        internships: internships.map((item) => ({
          ...item,
          idEstagio: Number(item.idEstagio)
        })),
        documents: normalizedDocs
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.uploadDocument = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { idEstagio, categoria } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'Nenhum ficheiro enviado.' });
    }

    if (!idEstagio) {
      return res.status(400).json({ error: 'É necessário indicar o estágio associado.' });
    }

    const [[professor]] = await pool.query(
      'SELECT id_professor FROM ProfessorOrientador WHERE id_utilizador = ?',
      [userId]
    );

    if (!professor) {
      return res.status(404).json({ error: 'Perfil de professor não encontrado' });
    }

    const professorId = professor.id_professor;

    const [[estagio]] = await pool.query(
      `SELECT e.id_estagio
      FROM Estagio e
      WHERE e.id_estagio = ? AND e.id_professor = ?`,
      [idEstagio, professorId]
    );

    if (!estagio) {
      return res.status(403).json({ error: 'Não tens permissão para anexar documentos a este estágio.' });
    }

    const storedFilename = file.filename;
    const normalizedCategory = String(categoria || 'outro').toLowerCase();

    const [result] = await pool.query(
      `INSERT INTO DocumentoEstagio (id_estagio, nome_original, ficheiro, categoria, tipo, tamanho)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [idEstagio, file.originalname, storedFilename, normalizedCategory, file.mimetype, file.size]
    );

    const insertedId = result.insertId;

    res.status(201).json({
      success: true,
      data: {
        idDocumento: Number(insertedId),
        idEstagio: Number(idEstagio),
        nomeOriginal: file.originalname,
        ficheiro: storedFilename,
        categoria: normalizedCategory,
        tipo: file.mimetype,
        tamanho: file.size,
        uploadedAt: new Date().toISOString(),
        url: `/uploads/documents/${storedFilename}`
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteDocument = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const [[professor]] = await pool.query(
      'SELECT id_professor FROM ProfessorOrientador WHERE id_utilizador = ?',
      [userId]
    );

    if (!professor) {
      return res.status(404).json({ error: 'Perfil de professor não encontrado' });
    }

    const professorId = professor.id_professor;

    const [[documento]] = await pool.query(
      `SELECT d.id_documento, d.ficheiro
      FROM DocumentoEstagio d
      INNER JOIN Estagio e ON d.id_estagio = e.id_estagio
      WHERE d.id_documento = ? AND e.id_professor = ?`,
      [id, professorId]
    );

    if (!documento) {
      return res.status(404).json({ error: 'Documento não encontrado ou sem permissão.' });
    }

    await pool.query('DELETE FROM DocumentoEstagio WHERE id_documento = ?', [id]);

    const filePath = path.join(__dirname, '../../uploads/documents', documento.ficheiro);
    fs.unlink(filePath, (unlinkErr) => {
      if (unlinkErr && unlinkErr.code !== 'ENOENT') {
        console.warn('Erro ao remover ficheiro:', unlinkErr.message);
      }
    });

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};
