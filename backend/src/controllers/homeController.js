const { pool } = require('../database/db');

// Get homepage stats and featured offers
exports.getHomeData = async (req, res, next) => {
  try {
    // Get stats
    const [stats] = await pool.query(`
      SELECT 
        (SELECT COUNT(DISTINCT id_empresa) FROM Empresa WHERE validada = true) as total_empresas,
        (SELECT COUNT(*) FROM OfertaEstagio) as total_ofertas,
        (SELECT COUNT(*) FROM Aluno) as total_alunos,
        (SELECT COUNT(*) FROM Candidatura) as total_candidaturas
    `);

    // Get featured internship offers (latest 6)
    const [ofertas] = await pool.query(`
      SELECT o.*, e.nome_empresa, e.morada
      FROM OfertaEstagio o
      INNER JOIN Empresa e ON o.id_empresa = e.id_empresa
      WHERE e.validada = true
      ORDER BY o.data_publicacao DESC
      LIMIT 6
    `);

    // Get categories with count (simulated from area_interesse or custom logic)
    const [categories] = await pool.query(`
      SELECT 
        CASE 
          WHEN titulo LIKE '%Marketing%' OR descricao LIKE '%Marketing%' THEN 'Marketing'
          WHEN titulo LIKE '%Developer%' OR titulo LIKE '%Engineer%' OR descricao LIKE '%Developer%' THEN 'Tecnologia'
          WHEN titulo LIKE '%Design%' OR descricao LIKE '%Design%' THEN 'Design'
          WHEN titulo LIKE '%Data%' OR titulo LIKE '%Analyst%' THEN 'Análise de Dados'
          WHEN titulo LIKE '%Cloud%' OR titulo LIKE '%DevOps%' THEN 'Cloud & DevOps'
          ELSE 'Outros'
        END as categoria,
        COUNT(*) as total
      FROM OfertaEstagio
      GROUP BY categoria
      ORDER BY total DESC
    `);

    res.json({
      success: true,
      data: {
        stats: stats[0],
        ofertas,
        categories
      }
    });
  } catch (err) {
    next(err);
  }
};
