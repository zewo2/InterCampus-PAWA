const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const mysql = require('mysql2/promise');

async function insertExampleData() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE || 'intercampus_db'
  });

  try {
    console.log('Conectado ao MySQL!');

    // 1. Inserir Utilizadores
    await connection.query(`
      INSERT INTO Utilizador (nome, email, password, role) VALUES
      -- Empresas 
      ('Farfetch', 'careers@farfetch.com', 'hash123', 'Empresa'),
      ('Critical Software', 'careers@criticalsoftware.com', 'hash456', 'Empresa'),
      ('Sword Health', 'careers@swordhealth.com', 'hash789', 'Empresa'),
      ('Platforme', 'jobs@platforme.com', 'hash111', 'Empresa'),
      ('Natixis', 'recrutamento.pt@natixis.com', 'hash222', 'Empresa'),
      -- Alunos 
      ('João Silva', 'joao.silva@my.istec.pt', 'hash301', 'Aluno'),
      ('Maria Santos', 'maria.santos@my.istec.pt', 'hash302', 'Aluno'),
      ('Pedro Costa', 'pedro.costa@my.istec.pt', 'hash303', 'Aluno'),
      ('Ana Rodrigues', 'ana.rodrigues@my.istec.pt', 'hash304', 'Aluno'),
      ('Carlos Ferreira', 'carlos.ferreira@my.istec.pt', 'hash305', 'Aluno'),
      ('Sofia Martins', 'sofia.martins@my.istec.pt', 'hash306', 'Aluno'),
      ('Rui Pereira', 'rui.pereira@my.istec.pt', 'hash307', 'Aluno'),
      ('Beatriz Sousa', 'beatriz.sousa@my.istec.pt', 'hash308', 'Aluno'),
      ('Miguel Alves', 'miguel.alves@my.istec.pt', 'hash309', 'Aluno'),
      ('Catarina Lopes', 'catarina.lopes@my.istec.pt', 'hash310', 'Aluno'),
      -- Professores 
      ('Prof. Carlos Mendes', 'carlos.mendes@my.istec.pt', 'hash401', 'Professor'),
      ('Prof. Rita Oliveira', 'rita.oliveira@my.istec.pt', 'hash402', 'Professor'),
      ('Prof. André Soares', 'andre.soares@my.istec.pt', 'hash403', 'Professor'),
      ('Prof. Inês Barbosa', 'ines.barbosa@my.istec.pt', 'hash404', 'Professor'),
      ('Prof. Tiago Nunes', 'tiago.nunes@my.istec.pt', 'hash405', 'Professor'),
      -- Gestores 
      ('Admin Gestor Principal', 'gestor.principal@istec.pt', 'hash501', 'Gestor'),
      ('Admin Gestor Adjunto', 'gestor.adjunto@istec.pt', 'hash502', 'Gestor'),
      ('Admin Gestor Coordenador', 'gestor.coordenador@istec.pt', 'hash503', 'Gestor')
    `);
    console.log('Utilizadores inseridos (23 total)');

    // 2. Inserir Empresas
    await connection.query(`
      INSERT INTO Empresa (nome_empresa, NIF, morada, validada, id_utilizador) VALUES
      ('Farfetch', '510661718', 'Rua da Lionesa, 446, 4465-671 Leça do Balio, Matosinhos', true, 1),
      ('Critical Software', '502028351', 'Rua de Gonçalo Cristóvão, 347, 4000-270 Porto', true, 2),
      ('Sword Health', '514333261', 'Alameda de Espregueira, 319, 4200-272 Porto', true, 3),
      ('Platforme', '513845572', 'Rua do Campo Alegre, 1021, 4150-180 Porto', true, 4),
      ('Natixis', '980383326', 'Av. da Boavista, 1195, 4100-129 Porto', true, 5)
    `);
    console.log('Empresas inseridas (5 empresas reais)');

    // 3. Inserir Orientadores de Empresa
    await connection.query(`
      INSERT INTO OrientadorEmpresa (nome, cargo, email, telefone, id_empresa) VALUES
      ('Dr. Miguel Ferreira', 'Engineering Manager', 'miguel.ferreira@farfetch.com', '912345678', 1),
      ('Eng. Sofia Almeida', 'Tech Lead', 'sofia.almeida@criticalsoftware.com', '923456789', 2),
      ('Dr. Paulo Santos', 'Head of Engineering', 'paulo.santos@swordhealth.com', '934567890', 3),
      ('Eng. Helena Costa', 'CTO', 'helena.costa@platforme.com', '945678901', 4),
      ('Dr. Ricardo Oliveira', 'Senior Developer', 'ricardo.oliveira@natixis.com', '956789012', 5)
    `);
    console.log('Orientadores de Empresa inseridos (5 total)');

    // 4. Inserir Alunos
    await connection.query(`
      INSERT INTO Aluno (curso, CV, competencias, area_interesse, id_utilizador, estagio_status) VALUES
      ('Engenharia Informática', 'Estudante apaixonado por backend development...', 'Java, Spring Boot, MySQL, Docker, Kubernetes', 'Desenvolvimento Backend', 6, false),
      ('Engenharia Informática', 'Desenvolvedora frontend com experiência em React...', 'React, Node.js, MongoDB, TypeScript, GraphQL', 'Desenvolvimento Web', 7, true),
      ('Design Digital', 'Designer focado em experiência do utilizador...', 'Figma, Adobe XD, UI/UX, Photoshop, Illustrator', 'Design de Interfaces', 8, false),
      ('Gestão de TI', 'Estudante de gestão com certificação Scrum...', 'Gestão de Projetos, Scrum, Agile, JIRA', 'Gestão de Projetos', 9, false),
      ('Engenharia Informática', 'Especialista em cloud computing e DevOps...', 'Python, Django, PostgreSQL, AWS, Terraform', 'Cloud Computing', 10, false),
      ('Engenharia Informática', 'Desenvolvedora full-stack com foco em Angular...', 'Angular, Vue.js, CSS, HTML5, Bootstrap', 'Frontend Development', 11, true),
      ('Cibersegurança', 'Estudante focado em segurança de redes...', 'Network Security, Pentesting, Linux, Kali', 'Segurança Informática', 12, false),
      ('Data Science', 'Analista de dados com conhecimentos em ML...', 'Python, Machine Learning, SQL, Power BI, Tableau', 'Análise de Dados', 13, false),
      ('Engenharia Informática', 'Desenvolvedor .NET com experiência em Azure...', 'C#, .NET Core, Azure, SQL Server, Blazor', 'Desenvolvimento Microsoft', 14, false),
      ('Marketing Digital', 'Especialista em marketing digital e SEO...', 'SEO, Google Analytics, Social Media, Google Ads', 'Marketing e Comunicação', 15, false)
    `);
    console.log('Alunos inseridos (10 total)');

    // 5. Inserir Gestores
    await connection.query(`
      INSERT INTO Gestor (id_utilizador) VALUES (21), (22), (23)
    `);
    console.log('Gestores inseridos (3 total)');

    // 6. Inserir Professores Orientadores
    await connection.query(`
      INSERT INTO ProfessorOrientador (departamento, id_utilizador) VALUES
      ('Departamento de Informática', 16),
      ('Departamento de Engenharia', 17),
      ('Departamento de Design', 18),
      ('Departamento de Gestão', 19),
      ('Departamento de Cibersegurança', 20)
    `);
    console.log('Professores Orientadores inseridos (5 total)');

    // 7. Inserir Ofertas de Estágio 
    await connection.query(`
      INSERT INTO OfertaEstagio (titulo, descricao, requisitos, duracao, local, data_publicacao, id_empresa) VALUES
      ('Backend Developer - Java', 'Desenvolvimento de microserviços para plataforma de e-commerce de luxo', 'Java, Spring Boot, Kafka, Redis', 6, 'Matosinhos', '2024-01-15', 1),
      ('Frontend Developer - React', 'Criação de interfaces web responsivas e modernas', 'React, TypeScript, Next.js, Tailwind', 6, 'Matosinhos', '2024-01-20', 1),
      ('DevOps Engineer', 'Automação de infraestrutura e CI/CD pipelines', 'Docker, Kubernetes, AWS, Terraform', 6, 'Porto', '2024-02-01', 2),
      ('QA Automation Engineer', 'Desenvolvimento de testes automatizados', 'Selenium, Cypress, Jest, Testing', 5, 'Porto', '2024-02-05', 2),
      ('Full Stack Developer', 'Desenvolvimento web full-stack em saúde digital', 'Node.js, React, PostgreSQL, TypeScript', 6, 'Porto', '2024-01-25', 3),
      ('Machine Learning Engineer', 'Desenvolvimento de modelos de ML para fisioterapia', 'Python, TensorFlow, ML, Data Science', 6, 'Porto', '2024-02-10', 3),
      ('Mobile Developer - Flutter', 'Desenvolvimento de apps mobile multiplataforma', 'Flutter, Dart, Firebase, REST APIs', 5, 'Porto', '2024-01-18', 4),
      ('UI/UX Designer', 'Design de interfaces para produtos digitais', 'Figma, Adobe XD, Prototyping, User Research', 4, 'Porto', '2024-02-15', 4),
      ('Data Analyst', 'Análise de dados financeiros e criação de dashboards', 'SQL, Python, Power BI, Excel', 6, 'Porto', '2024-01-22', 5),
      ('Cybersecurity Analyst', 'Análise de vulnerabilidades e testes de segurança', 'Network Security, Pentesting, SIEM', 6, 'Porto', '2024-02-08', 5),
      ('Cloud Solutions Architect', 'Design e implementação de soluções cloud', 'AWS, Azure, Cloud Architecture, Microservices', 6, 'Matosinhos', '2024-01-28', 1),
      ('Software Engineer - Embedded', 'Desenvolvimento de software embebido para sistemas críticos', 'C/C++, RTOS, Linux Embedded, IoT', 6, 'Porto', '2024-02-12', 2),
      ('Product Designer', 'Design de produto e experiência do utilizador', 'Figma, User Research, Prototyping, Design System', 5, 'Porto', '2024-01-30', 3),
      ('Business Analyst', 'Análise de requisitos e processos de negócio', 'Business Analysis, SQL, Agile, Documentation', 5, 'Porto', '2024-02-03', 4),
      ('Scrum Master Junior', 'Facilitação de cerimónias Scrum e gestão ágil', 'Scrum, Agile, JIRA, Facilitation', 4, 'Porto', '2024-02-18', 5)
    `);
    console.log('Ofertas de Estágio inseridas (15 total)');

    // 8. Inserir Candidaturas
    await connection.query(`
      INSERT INTO Candidatura (data_submissao, estado, id_aluno, id_oferta) VALUES
      ('2024-01-20', 'Aceite', 1, 1),
      ('2024-02-05', 'Aceite', 2, 5),
      ('2024-01-25', 'Pendente', 3, 8),
      ('2024-02-10', 'Recusado', 4, 14),
      ('2024-01-30', 'Aceite', 5, 3),
      ('2024-02-12', 'Pendente', 6, 2),
      ('2024-02-08', 'Aceite', 7, 10),
      ('2024-01-22', 'Pendente', 8, 9),
      ('2024-02-15', 'Aceite', 9, 12),
      ('2024-02-18', 'Pendente', 10, 15)
    `);
    console.log('Candidaturas inseridas (10 total)');

    // 9. Inserir Estágios
    await connection.query(`
      INSERT INTO Estagio (data_inicio, data_fim, estado_final, id_candidatura, id_professor, id_orientador) VALUES
      ('2024-03-01', '2024-08-31', 'Concluido', 1, 1, 1),
      ('2024-03-15', '2024-09-15', 'Concluido', 2, 2, 3),
      ('2024-04-01', '2024-09-30', 'Concluido', 5, 3, 2),
      ('2024-03-20', '2024-09-20', 'Concluido', 7, 5, 5),
      ('2024-04-15', NULL, NULL, 9, 4, 2)
    `);
    console.log('Estágios inseridos (5 total)');

    // 10. Inserir Avaliações
    await connection.query(`
      INSERT INTO Avaliacao (tipo, data, pontuacao, relatorio_texto, id_estagio) VALUES
      ('Acompanhamento', '2024-05-15', 16, 'Excelente integração na equipa. Demonstra boas competências técnicas em Java e Spring Boot.', 1),
      ('Final', '2024-08-31', 18, 'Performance excecional. Contribuiu significativamente para o projeto de microserviços.', 1),
      ('Acompanhamento', '2024-06-01', 17, 'Muito competente em desenvolvimento full-stack. Proativa e autónoma.', 2),
      ('Final', '2024-09-15', 19, 'Superou todas as expectativas. Recomendada para contratação.', 2),
      ('Acompanhamento', '2024-06-15', 15, 'Bom progresso em DevOps. Necessita melhorar documentação.', 3),
      ('Final', '2024-09-30', 17, 'Evolução positiva. Domina bem as ferramentas de automação.', 3),
      ('Acompanhamento', '2024-06-10', 18, 'Excelente trabalho em cibersegurança. Muito dedicado e atento aos detalhes.', 4),
      ('Final', '2024-09-20', 20, 'Performance excecional em pentesting. Grande contributo para a segurança da empresa.', 4)
    `);
    console.log('Avaliações inseridas (8 total)');

    console.log('\nTodos os dados de exemplo foram inseridos com sucesso!');
    console.log('\nResumo:');
    console.log('   - 5 Empresas Tech Reais (Farfetch, Critical Software, Sword Health, Platforme, Natixis)');
    console.log('   - 10 Alunos (@my.istec.pt)');
    console.log('   - 5 Professores Orientadores (@my.istec.pt)');
    console.log('   - 5 Orientadores de Empresa');
    console.log('   - 3 Gestores (@istec.pt)');
    console.log('   - 15 Ofertas de Estágio (Porto e Matosinhos)');
    console.log('   - 10 Candidaturas');
    console.log('   - 5 Estágios');
    console.log('   - 8 Avaliações');

  } catch (err) {
    console.error('Erro ao inserir dados:', err.message);
    throw err;
  } finally {
    await connection.end();
    console.log('\nConexão encerrada.');
  }
}

insertExampleData();