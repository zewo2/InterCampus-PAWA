const { pool } = require('../database/db');

/**
 * Categorize internship based on requisitos field
 * @param {string} requisitos - Comma or pipe-separated list of requirements
 * @param {string} titulo - Job title
 * @param {string} descricao - Job description
 * @returns {string} Category name
 */
function categorizeInternship(requisitos, titulo, descricao) {
  const text = `${requisitos || ''} ${titulo || ''} ${descricao || ''}`.toLowerCase();
  
  // Design keywords
  if (text.match(/figma|adobe|photoshop|illustrator|xd|sketch|ui\/ux|design/i)) {
    return 'Design & UX';
  }
  
  // Frontend keywords
  if (text.match(/react|vue|angular|frontend|html|css|tailwind|next\.js/i)) {
    return 'Frontend Development';
  }
  
  // Backend keywords
  if (text.match(/java|spring|node\.js|backend|api|microservi[cç]os|express|django|flask/i)) {
    return 'Backend Development';
  }
  
  // Mobile keywords
  if (text.match(/flutter|react native|ios|android|mobile|swift|kotlin/i)) {
    return 'Mobile Development';
  }
  
  // Data Science & ML
  if (text.match(/machine learning|ml|tensorflow|data science|python.*data|power bi|tableau|analytics/i)) {
    return 'Data Science & AI';
  }
  
  // Cloud & DevOps
  if (text.match(/aws|azure|cloud|devops|kubernetes|docker|terraform|ci\/cd/i)) {
    return 'Cloud & DevOps';
  }
  
  // Cybersecurity
  if (text.match(/security|ciberseguran[cç]a|pentesting|network security|siem/i)) {
    return 'Cibersegurança';
  }
  
  // QA & Testing
  if (text.match(/qa|testing|selenium|cypress|jest|automation.*test/i)) {
    return 'QA & Testing';
  }
  
  // Marketing & Communication
  if (text.match(/marketing|seo|social media|comunica[cç][ãa]o|google analytics/i)) {
    return 'Marketing & Comunicação';
  }
  
  // Business & Management
  if (text.match(/scrum|agile|product|business|gest[ãa]o|jira/i)) {
    return 'Gestão & Produto';
  }
  
  // Generic tech/development
  if (text.match(/developer|engineer|desenvolvimento|program/i)) {
    return 'Tecnologia';
  }
  
  return 'Outros';
}

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

    // Get ALL internship offers for processing
    const [allOfertas] = await pool.query(`
      SELECT o.*, e.nome_empresa, e.morada
      FROM OfertaEstagio o
      INNER JOIN Empresa e ON o.id_empresa = e.id_empresa
      WHERE e.validada = true
      ORDER BY o.data_publicacao DESC
    `);

    // Pick 6 random featured internships
    const shuffled = [...allOfertas].sort(() => 0.5 - Math.random());
    const ofertas = shuffled.slice(0, 6);

    // Categorize all internships and count by category
    const categoryMap = new Map();
    allOfertas.forEach(oferta => {
      const category = categorizeInternship(oferta.requisitos, oferta.titulo, oferta.descricao);
      categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
    });

    // Convert to array and sort by count
    const categories = Array.from(categoryMap.entries())
      .map(([categoria, total]) => ({ categoria, total }))
      .sort((a, b) => b.total - a.total);

    // Get unique locations from both local and morada fields
    const locationSet = new Set();
    allOfertas.forEach(oferta => {
      if (oferta.local) locationSet.add(oferta.local.trim());
      if (oferta.morada) {
        // Extract city from morada (usually after last comma or specific patterns)
        const parts = oferta.morada.split(',');
        if (parts.length > 0) {
          const lastPart = parts[parts.length - 1].trim();
          // Try to extract city name (remove postal codes)
          const cityMatch = lastPart.match(/^([A-Za-zÀ-ÿ\s]+)/);
          if (cityMatch) locationSet.add(cityMatch[1].trim());
        }
      }
    });
    const locations = Array.from(locationSet).sort();

    res.json({
      success: true,
      data: {
        stats: stats[0],
        ofertas,
        categories,
        locations
      }
    });
  } catch (err) {
    next(err);
  }
};
