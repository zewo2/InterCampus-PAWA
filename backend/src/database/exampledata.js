const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

const DEFAULT_PASSWORD = process.env.SEED_DEFAULT_PASSWORD || 'InterCampus123!';
const BCRYPT_ROUNDS = 10;

const companyDefinitions = [
  {
    nomeEmpresa: 'Farfetch',
    userNome: 'Farfetch Talent',
    userEmail: 'talento@farfetch.com',
    nif: '510661718',
    morada: 'Rua da Lionesa 446, 4465-671 Leça do Balio',
    validada: true
  },
  {
    nomeEmpresa: 'Critical Software',
    userNome: 'Critical Software Careers',
    userEmail: 'talento@criticalsoftware.com',
    nif: '502028351',
    morada: 'Rua de Gonçalo Cristóvão 347, 4000-270 Porto',
    validada: true
  },
  {
    nomeEmpresa: 'Sword Health',
    userNome: 'Sword Health People',
    userEmail: 'talento@swordhealth.com',
    nif: '514333261',
    morada: 'Alameda de Espregueira 319, 4200-272 Porto',
    validada: true
  },
  {
    nomeEmpresa: 'Platforme',
    userNome: 'Platforme Recruiting',
    userEmail: 'talento@platforme.com',
    nif: '513845572',
    morada: 'Rua do Campo Alegre 1021, 4150-180 Porto',
    validada: true
  },
  {
    nomeEmpresa: 'Natixis',
    userNome: 'Natixis Portugal',
    userEmail: 'talento@natixis.com',
    nif: '980383326',
    morada: 'Avenida da Boavista 1195, 4100-129 Porto',
    validada: true
  },
  {
    nomeEmpresa: 'Talkdesk',
    userNome: 'Talkdesk Talent',
    userEmail: 'talento@talkdesk.com',
    nif: '509620084',
    morada: 'Rua do Conde de Redondo 145, 1150-103 Lisboa',
    validada: true
  },
  {
    nomeEmpresa: 'OutSystems',
    userNome: 'OutSystems Careers',
    userEmail: 'talento@outsystems.com',
    nif: '504184171',
    morada: 'Av. Dom João II 1.09.1, 1990-096 Lisboa',
    validada: true
  },
  {
    nomeEmpresa: 'Feedzai',
    userNome: 'Feedzai People',
    userEmail: 'talento@feedzai.com',
    nif: '509602382',
    morada: 'Rua Dr. António Champalimaud 1, 1600-514 Lisboa',
    validada: true
  },
  {
    nomeEmpresa: 'Remote',
    userNome: 'Remote HR',
    userEmail: 'talento@remote.com',
    nif: '980473020',
    morada: 'Rua Tomás da Fonseca, 1600-209 Lisboa',
    validada: true
  },
  {
    nomeEmpresa: 'Defined.ai',
    userNome: 'Defined.ai Talent',
    userEmail: 'talento@defined.ai',
    nif: '514920785',
    morada: 'Avenida da Boavista 620, 4100-111 Porto',
    validada: true
  },
  {
    nomeEmpresa: 'Sensei',
    userNome: 'Sensei Hiring',
    userEmail: 'talento@sensei.tech',
    nif: '514827396',
    morada: 'Rua Viriato 13, 1050-233 Lisboa',
    validada: true
  },
  {
    nomeEmpresa: 'Unbabel',
    userNome: 'Unbabel Talent',
    userEmail: 'talento@unbabel.com',
    nif: '513289470',
    morada: 'Rua do Conde de Redondo 145, 1150-103 Lisboa',
    validada: true
  },
  {
    nomeEmpresa: 'Kencko',
    userNome: 'Kencko Careers',
    userEmail: 'talento@kencko.com',
    nif: '514762193',
    morada: 'Rua do Salitre 175, 1250-096 Lisboa',
    validada: true
  },
  {
    nomeEmpresa: 'Landing.Jobs',
    userNome: 'Landing.Jobs People',
    userEmail: 'talento@landing.jobs',
    nif: '513862740',
    morada: 'Rua Braamcamp 88, 1250-052 Lisboa',
    validada: true
  },
  {
    nomeEmpresa: 'Critical Manufacturing',
    userNome: 'Critical Manufacturing Careers',
    userEmail: 'talento@criticalmanufacturing.com',
    nif: '502846642',
    morada: 'Rua Eng. Frederico Ulrich 2650, 4470-605 Maia',
    validada: true
  },
  {
    nomeEmpresa: 'Mercedes-Benz.io',
    userNome: 'Mercedes-Benz.io Talent',
    userEmail: 'talento@mercedes-benz.io',
    nif: '980515340',
    morada: 'Rua do Conde de Redondo 145, 1150-103 Lisboa',
    validada: true
  },
  {
    nomeEmpresa: 'TeamViewer Portugal',
    userNome: 'TeamViewer Portugal HR',
    userEmail: 'talento@teamviewer.com',
    nif: '514003560',
    morada: 'Rua do Heroísmo 333, 4300-256 Porto',
    validada: true
  },
  {
    nomeEmpresa: 'Sky Technology Center',
    userNome: 'Sky Technology Center Talent',
    userEmail: 'talento@sky.com',
    nif: '980407820',
    morada: 'Rua do Heroísmo 366, 4300-256 Porto',
    validada: false
  },
  {
    nomeEmpresa: 'Vodafone Portugal',
    userNome: 'Vodafone Portugal Careers',
    userEmail: 'talento@vodafone.com',
    nif: '500098486',
    morada: 'Avenida D. João II 36, 1998-017 Lisboa',
    validada: true
  },
  {
    nomeEmpresa: 'Bosch Portugal',
    userNome: 'Bosch Portugal Talent',
    userEmail: 'talento@bosch.com',
    nif: '500220447',
    morada: 'Avenida Infante Dom Henrique 333, 1800-282 Lisboa',
    validada: true
  }
];

const studentDefinitions = [
  {
    nome: 'Andre Gomes',
    email: 'andre.gomes@my.istec.pt',
    curso: 'Engenharia Informática',
    cv: 'Estudante focado em desenvolvimento backend e arquitetura de microserviços.',
    competencias: 'Java, Spring Boot, Docker, PostgreSQL, Redis',
    areaInteresse: 'Desenvolvimento Backend',
    estagioStatus: true
  },
  {
    nome: 'Joana Sousa',
    email: 'joana.sousa@my.istec.pt',
    curso: 'Engenharia Informática',
    cv: 'Dev frontend apaixonada por experiências responsivas.',
    competencias: 'React, TypeScript, Tailwind, Jest, Cypress',
    areaInteresse: 'Frontend',
    estagioStatus: true
  },
  {
    nome: 'Diogo Rocha',
    email: 'diogo.rocha@my.istec.pt',
    curso: 'Data Science',
    cv: 'Data Scientist focado em machine learning aplicado a fintech.',
    competencias: 'Python, Pandas, TensorFlow, Airflow, SQL',
    areaInteresse: 'Machine Learning',
    estagioStatus: false
  },
  {
    nome: 'Mariana Silva',
    email: 'mariana.silva@my.istec.pt',
    curso: 'Design Digital',
    cv: 'UX/UI designer com experiência em research e testes de usabilidade.',
    competencias: 'Figma, User Research, Prototyping, Design Systems',
    areaInteresse: 'Design de Interfaces',
    estagioStatus: false
  },
  {
    nome: 'Hugo Fernandes',
    email: 'hugo.fernandes@my.istec.pt',
    curso: 'Gestão de TI',
    cv: 'Gestor de projeto júnior com certificação Scrum Master.',
    competencias: 'Scrum, Kanban, Jira, Confluence, Comunicação',
    areaInteresse: 'Gestão de Projetos',
    estagioStatus: true
  },
  {
    nome: 'Ines Carvalho',
    email: 'ines.carvalho@my.istec.pt',
    curso: 'Engenharia Informática',
    cv: 'Desenvolvedora full-stack com forte componente devops.',
    competencias: 'Node.js, React, AWS, Terraform, CI/CD',
    areaInteresse: 'Full-stack',
    estagioStatus: false
  },
  {
    nome: 'Ricardo Lopes',
    email: 'ricardo.lopes@my.istec.pt',
    curso: 'Cibersegurança',
    cv: 'Especialista em testes de intrusão e resposta a incidentes.',
    competencias: 'Pentesting, SIEM, Kali Linux, Python, OWASP',
    areaInteresse: 'Segurança Informática',
    estagioStatus: true
  },
  {
    nome: 'Patricia Campos',
    email: 'patricia.campos@my.istec.pt',
    curso: 'Data Science',
    cv: 'Analista de dados com foco em dashboards para áreas comerciais.',
    competencias: 'Power BI, DAX, SQL, Python, Storytelling',
    areaInteresse: 'Analytics',
    estagioStatus: false
  },
  {
    nome: 'Nuno Ribeiro',
    email: 'nuno.ribeiro@my.istec.pt',
    curso: 'Engenharia Informática',
    cv: 'Developer .NET focado em soluções enterprise.',
    competencias: 'C#, .NET 8, Azure, Blazor, SQL Server',
    areaInteresse: 'Plataformas Microsoft',
    estagioStatus: true
  },
  {
    nome: 'Filipa Matos',
    email: 'filipa.matos@my.istec.pt',
    curso: 'Marketing Digital',
    cv: 'Especialista em campanhas pagas e SEO técnico.',
    competencias: 'SEO, SEM, Google Ads, Analytics, Copywriting',
    areaInteresse: 'Marketing & Comunicação',
    estagioStatus: false
  },
  {
    nome: 'Bruno Costa',
    email: 'bruno.costa@my.istec.pt',
    curso: 'Engenharia Informática',
    cv: 'Programador mobile com experiência em Flutter.',
    competencias: 'Flutter, Dart, Firebase, REST, GraphQL',
    areaInteresse: 'Mobile',
    estagioStatus: true
  },
  {
    nome: 'Sofia Almeida',
    email: 'sofia.almeida@my.istec.pt',
    curso: 'Design Digital',
    cv: 'Designer de produto com foco em acessibilidade digital.',
    competencias: 'Figma, WCAG, Design Ops, User Testing',
    areaInteresse: 'Product Design',
    estagioStatus: false
  },
  {
    nome: 'Paulo Correia',
    email: 'paulo.correia@my.istec.pt',
    curso: 'Engenharia Informática',
    cv: 'DevOps Engineer júnior com paixão por automação.',
    competencias: 'Docker, Kubernetes, ArgoCD, Grafana, Bash',
    areaInteresse: 'DevOps',
    estagioStatus: true
  },
  {
    nome: 'Vera Pinto',
    email: 'vera.pinto@my.istec.pt',
    curso: 'Data Science',
    cv: 'Analista de dados focada em customer analytics.',
    competencias: 'SQL, Python, Tableau, Segmentação, CRM',
    areaInteresse: 'Customer Intelligence',
    estagioStatus: false
  },
  {
    nome: 'Luis Morais',
    email: 'luis.morais@my.istec.pt',
    curso: 'Engenharia Informática',
    cv: 'Backend developer com experiência em Go e Rust.',
    competencias: 'Go, Rust, gRPC, Kubernetes, PostgreSQL',
    areaInteresse: 'Backend escalável',
    estagioStatus: true
  },
  {
    nome: 'Beatriz Castro',
    email: 'beatriz.castro@my.istec.pt',
    curso: 'Gestão de TI',
    cv: 'Gestora de produto júnior focada em discovery contínuo.',
    competencias: 'Product Discovery, OKRs, Figma, Agile',
    areaInteresse: 'Product Management',
    estagioStatus: false
  },
  {
    nome: 'Tiago Marques',
    email: 'tiago.marques@my.istec.pt',
    curso: 'Cibersegurança',
    cv: 'Especialista em análise de vulnerabilidades e DevSecOps.',
    competencias: 'OWASP, SAST, DAST, Python, Azure Security',
    areaInteresse: 'DevSecOps',
    estagioStatus: true
  },
  {
    nome: 'Rita Nogueira',
    email: 'rita.nogueira@my.istec.pt',
    curso: 'Data Science',
    cv: 'Cientista de dados com foco em NLP e LLMs.',
    competencias: 'Python, Transformers, HuggingFace, SQL',
    areaInteresse: 'NLP',
    estagioStatus: true
  },
  {
    nome: 'Carlos Lima',
    email: 'carlos.lima@my.istec.pt',
    curso: 'Engenharia Informática',
    cv: 'Full-stack developer apaixonado por GraphQL.',
    competencias: 'Node.js, GraphQL, React, Apollo, Prisma',
    areaInteresse: 'Full-stack',
    estagioStatus: true
  },
  {
    nome: 'Helena Figueiredo',
    email: 'helena.figueiredo@my.istec.pt',
    curso: 'Design Digital',
    cv: 'UX researcher com experiência em diary studies.',
    competencias: 'Research, Personas, Prototyping, Analytics',
    areaInteresse: 'UX Research',
    estagioStatus: false
  },
  {
    nome: 'Goncalo Teixeira',
    email: 'goncalo.teixeira@my.istec.pt',
    curso: 'Engenharia Informática',
    cv: 'Software engineer com foco em integrações ERP.',
    competencias: 'C#, Azure Functions, SQL Server, SAP',
    areaInteresse: 'Integrações',
    estagioStatus: true
  },
  {
    nome: 'Margarida Azevedo',
    email: 'margarida.azevedo@my.istec.pt',
    curso: 'Data Science',
    cv: 'Data analyst especializada em analytics para produto.',
    competencias: 'Product Analytics, Mixpanel, SQL, Python',
    areaInteresse: 'Product Analytics',
    estagioStatus: false
  },
  {
    nome: 'Rui Fonseca',
    email: 'rui.fonseca@my.istec.pt',
    curso: 'Engenharia Informática',
    cv: 'Dev full-stack com experiência em Laravel e Vue.',
    competencias: 'PHP, Laravel, Vue.js, MySQL, Redis',
    areaInteresse: 'Full-stack',
    estagioStatus: true
  },
  {
    nome: 'Ana Mendes',
    email: 'ana.mendes@my.istec.pt',
    curso: 'Marketing Digital',
    cv: 'Especialista em content marketing e estratégia social.',
    competencias: 'Content Strategy, SEO, Analytics, Social Media',
    areaInteresse: 'Marketing',
    estagioStatus: false
  },
  {
    nome: 'Joao Neves',
    email: 'joao.neves@my.istec.pt',
    curso: 'Engenharia Informática',
    cv: 'Developer focado em micro frontends e performance.',
    competencias: 'React, Webpack Module Federation, Vitest, CI/CD',
    areaInteresse: 'Frontend',
    estagioStatus: true
  }
];

const professorDefinitions = [
  { nome: 'Prof. Carolina Mendes', email: 'carolina.mendes@my.istec.pt', departamento: 'Engenharia Informática' },
  { nome: 'Prof. Tiago Nunes', email: 'tiago.nunes@my.istec.pt', departamento: 'Arquitetura de Software' },
  { nome: 'Prof. Andre Soares', email: 'andre.soares@my.istec.pt', departamento: 'Cibersegurança' },
  { nome: 'Prof. Ines Barbosa', email: 'ines.barbosa@my.istec.pt', departamento: 'Gestão de TI' },
  { nome: 'Prof. Rita Oliveira', email: 'rita.oliveira@my.istec.pt', departamento: 'Design Digital' },
  { nome: 'Prof. Bruno Martins', email: 'bruno.martins@my.istec.pt', departamento: 'Cloud & DevOps' },
  { nome: 'Prof. Marta Figueira', email: 'marta.figueira@my.istec.pt', departamento: 'Data Science' },
  { nome: 'Prof. Joao Duarte', email: 'joao.duarte@my.istec.pt', departamento: 'Arquitetura Empresarial' },
  { nome: 'Prof. Sara Moreira', email: 'sara.moreira@my.istec.pt', departamento: 'UX Research' },
  { nome: 'Prof. Pedro Leite', email: 'pedro.leite@my.istec.pt', departamento: 'Mobile & IoT' },
  { nome: 'Prof. Ana Ferreira', email: 'ana.ferreira@my.istec.pt', departamento: 'Product Management' },
  { nome: 'Prof. Luis Costa', email: 'luis.costa@my.istec.pt', departamento: 'Inteligência Artificial' },
  { nome: 'Prof. Beatriz Lopes', email: 'beatriz.lopes@my.istec.pt', departamento: 'Analítica de Negócio' },
  { nome: 'Prof. Ricardo Amaral', email: 'ricardo.amaral@my.istec.pt', departamento: 'Cibersegurança' },
  { nome: 'Prof. Catarina Matos', email: 'catarina.matos@my.istec.pt', departamento: 'Experiência do Utilizador' },
  { nome: 'Prof. Paulo Ribeiro', email: 'paulo.ribeiro@my.istec.pt', departamento: 'Sistemas Distribuídos' },
  { nome: 'Prof. Helena Tavares', email: 'helena.tavares@my.istec.pt', departamento: 'Engenharia de Software' },
  { nome: 'Prof. Filipe Duarte', email: 'filipe.duarte@my.istec.pt', departamento: 'Sistemas de Informação' },
  { nome: 'Prof. Raquel Pires', email: 'raquel.pires@my.istec.pt', departamento: 'Gestão & Estratégia' },
  { nome: 'Prof. Victor Carvalho', email: 'victor.carvalho@my.istec.pt', departamento: 'Dados & Analytics' }
];

const gestorDefinitions = Array.from({ length: 20 }).map((_, index) => {
  const number = String(index + 1).padStart(2, '0');
  return {
    nome: `Administrador Gestor ${number}`,
    email: `gestor.${number}@istec.pt`
  };
});

const orientadorDefinitions = [
  { nome: 'Miguel Ferreira', cargo: 'Engineering Manager', email: 'miguel.ferreira@farfetch.com', telefone: '912345678', empresa: 'Farfetch' },
  { nome: 'Sofia Almeida', cargo: 'Tech Lead', email: 'sofia.almeida@criticalsoftware.com', telefone: '923456789', empresa: 'Critical Software' },
  { nome: 'Paulo Santos', cargo: 'Head of Engineering', email: 'paulo.santos@swordhealth.com', telefone: '934567890', empresa: 'Sword Health' },
  { nome: 'Helena Costa', cargo: 'CTO', email: 'helena.costa@platforme.com', telefone: '945678901', empresa: 'Platforme' },
  { nome: 'Ricardo Oliveira', cargo: 'Senior Developer', email: 'ricardo.oliveira@natixis.com', telefone: '956789012', empresa: 'Natixis' },
  { nome: 'Marisa Duarte', cargo: 'Product Director', email: 'marisa.duarte@talkdesk.com', telefone: '968123456', empresa: 'Talkdesk' },
  { nome: 'Joao Figueiredo', cargo: 'VP Engineering', email: 'joao.figueiredo@outsystems.com', telefone: '969234567', empresa: 'OutSystems' },
  { nome: 'Patricia Leal', cargo: 'Head of Data', email: 'patricia.leal@feedzai.com', telefone: '971345678', empresa: 'Feedzai' },
  { nome: 'Bruno Azevedo', cargo: 'Director of Engineering', email: 'bruno.azevedo@remote.com', telefone: '972456789', empresa: 'Remote' },
  { nome: 'Andreia Rocha', cargo: 'AI Program Manager', email: 'andreia.rocha@defined.ai', telefone: '973567890', empresa: 'Defined.ai' },
  { nome: 'Nuno Guerra', cargo: 'Retail Innovation Lead', email: 'nuno.guerra@sensei.tech', telefone: '974678901', empresa: 'Sensei' },
  { nome: 'Carla Reis', cargo: 'Customer Success Director', email: 'carla.reis@unbabel.com', telefone: '975789012', empresa: 'Unbabel' },
  { nome: 'Rui Duarte', cargo: 'Operations Lead', email: 'rui.duarte@kencko.com', telefone: '976890123', empresa: 'Kencko' },
  { nome: 'Vera Cardoso', cargo: 'Community Manager', email: 'vera.cardoso@landing.jobs', telefone: '977901234', empresa: 'Landing.Jobs' },
  { nome: 'Carlos Barros', cargo: 'Manufacturing Lead', email: 'carlos.barros@criticalmanufacturing.com', telefone: '978012345', empresa: 'Critical Manufacturing' },
  { nome: 'Diana Moreira', cargo: 'Engineering Manager', email: 'diana.moreira@mercedes-benz.io', telefone: '979123456', empresa: 'Mercedes-Benz.io' },
  { nome: 'Luis Carvalho', cargo: 'Engineering Lead', email: 'luis.carvalho@teamviewer.com', telefone: '980234567', empresa: 'TeamViewer Portugal' },
  { nome: 'Teresa Andrade', cargo: 'Technology Manager', email: 'teresa.andrade@sky.com', telefone: '981345678', empresa: 'Sky Technology Center' },
  { nome: 'Filipe Matias', cargo: 'Innovation Lead', email: 'filipe.matias@vodafone.com', telefone: '982456789', empresa: 'Vodafone Portugal' },
  { nome: 'Helder Pinho', cargo: 'Plant Digital Manager', email: 'helder.pinho@bosch.com', telefone: '983567890', empresa: 'Bosch Portugal' }
];

const offerDefinitions = [
  {
    titulo: 'Backend Developer - Commerce Platform',
    descricao: 'Desenvolvimento de APIs escaláveis para e-commerce global.',
    requisitos: 'Java, Spring Boot, Kafka, Redis, Microservices',
    duracao: 6,
    local: 'Porto',
    dataPublicacao: '2024-01-15',
    empresa: 'Farfetch'
  },
  {
    titulo: 'Frontend Developer - Design Systems',
    descricao: 'Implementação de novos componentes no design system da organização.',
    requisitos: 'React, TypeScript, Storybook, Testing Library',
    duracao: 6,
    local: 'Porto',
    dataPublicacao: '2024-01-20',
    empresa: 'Critical Software'
  },
  {
    titulo: 'Machine Learning Engineer - Digital Health',
    descricao: 'Construção de modelos de ML para acompanhamento remoto de fisioterapia.',
    requisitos: 'Python, TensorFlow, Azure ML, Data Pipelines',
    duracao: 6,
    local: 'Porto',
    dataPublicacao: '2024-02-01',
    empresa: 'Sword Health'
  },
  {
    titulo: 'DevOps Engineer - Fashion Tech',
    descricao: 'Automação de pipelines CI/CD e observabilidade para plataforma moda.',
    requisitos: 'Docker, Kubernetes, GitHub Actions, Grafana',
    duracao: 5,
    local: 'Porto',
    dataPublicacao: '2024-02-05',
    empresa: 'Platforme'
  },
  {
    titulo: 'Data Analyst - Corporate Banking',
    descricao: 'Criação de dashboards para equipas de corporate banking.',
    requisitos: 'SQL, Power BI, Python, Banking Analytics',
    duracao: 6,
    local: 'Porto',
    dataPublicacao: '2024-01-22',
    empresa: 'Natixis'
  },
  {
    titulo: 'Product Designer - Contact Center',
    descricao: 'Desenho de experiências omnicanal para soluções de contact center.',
    requisitos: 'Figma, Research, Prototyping, UX Writing',
    duracao: 6,
    local: 'Lisboa',
    dataPublicacao: '2024-02-10',
    empresa: 'Talkdesk'
  },
  {
    titulo: 'Full-stack Developer - Low-code Platform',
    descricao: 'Desenvolvimento de extensões e integrações para plataforma low-code.',
    requisitos: 'C#, .NET, React, Azure, REST',
    duracao: 6,
    local: 'Lisboa',
    dataPublicacao: '2024-02-12',
    empresa: 'OutSystems'
  },
  {
    titulo: 'Data Scientist - Fraud Prevention',
    descricao: 'Modelos de deteção de fraude em pagamentos digitais.',
    requisitos: 'Python, Spark, ML Ops, Fraud Analytics',
    duracao: 6,
    local: 'Lisboa',
    dataPublicacao: '2024-02-15',
    empresa: 'Feedzai'
  },
  {
    titulo: 'Remote Operations Engineer',
    descricao: 'Suporte a operações distribuídas para equipas globais.',
    requisitos: 'SRE, Terraform, AWS, Observability, Incident Response',
    duracao: 5,
    local: 'Remoto',
    dataPublicacao: '2024-02-18',
    empresa: 'Remote'
  },
  {
    titulo: 'NLP Engineer - Conversational AI',
    descricao: 'Desenvolvimento de pipelines NLP para bots multilingue.',
    requisitos: 'Python, Transformers, AWS, Prompt Engineering',
    duracao: 6,
    local: 'Porto',
    dataPublicacao: '2024-02-20',
    empresa: 'Defined.ai'
  },
  {
    titulo: 'Computer Vision Engineer - Retail',
    descricao: 'Construção de modelos de visão computacional para lojas autónomas.',
    requisitos: 'Python, OpenCV, PyTorch, Edge Devices',
    duracao: 6,
    local: 'Lisboa',
    dataPublicacao: '2024-02-22',
    empresa: 'Sensei'
  },
  {
    titulo: 'Localization Specialist - AI Translation',
    descricao: 'Gestão de qualidade de traduções automáticas e feedback dos clientes.',
    requisitos: 'Localization QA, CAT Tools, Analytics, SQL',
    duracao: 5,
    local: 'Lisboa',
    dataPublicacao: '2024-02-24',
    empresa: 'Unbabel'
  },
  {
    titulo: 'Sustainability Analyst - Food Tech',
    descricao: 'Análise de dados de sustentabilidade em cadeias de abastecimento alimentares.',
    requisitos: 'Python, LCA, SQL, ESG Reporting',
    duracao: 6,
    local: 'Lisboa',
    dataPublicacao: '2024-02-26',
    empresa: 'Kencko'
  },
  {
    titulo: 'Community Manager - Tech Talent',
    descricao: 'Ativar a comunidade de talentos tecnológicos em eventos e plataformas.',
    requisitos: 'Comunicação, Marketing Digital, CRM, Eventos',
    duracao: 4,
    local: 'Lisboa',
    dataPublicacao: '2024-02-28',
    empresa: 'Landing.Jobs'
  },
  {
    titulo: 'Manufacturing Data Engineer',
    descricao: 'Integração de dados de chão de fábrica com MES e ERP.',
    requisitos: 'SQL Server, OPC-UA, MES, Azure, ETL',
    duracao: 6,
    local: 'Maia',
    dataPublicacao: '2024-03-01',
    empresa: 'Critical Manufacturing'
  },
  {
    titulo: 'Cloud Architect - Automotive',
    descricao: 'Desenho de arquiteturas cloud para soluções de mobilidade.',
    requisitos: 'AWS, Azure, Microservices, Observability',
    duracao: 6,
    local: 'Lisboa',
    dataPublicacao: '2024-03-03',
    empresa: 'Mercedes-Benz.io'
  },
  {
    titulo: 'AR/VR Engineer',
    descricao: 'Desenvolvimento de experiências AR/VR para assistência remota.',
    requisitos: 'Unity, C#, HoloLens, UX, Geração de Conteúdo',
    duracao: 6,
    local: 'Porto',
    dataPublicacao: '2024-03-05',
    empresa: 'TeamViewer Portugal'
  },
  {
    titulo: 'Data Engineer - Media Streaming',
    descricao: 'Pipelines de dados em tempo real para análise de consumo de media.',
    requisitos: 'Kafka, BigQuery, Python, Airflow, Data Ops',
    duracao: 6,
    local: 'Porto',
    dataPublicacao: '2024-03-07',
    empresa: 'Sky Technology Center'
  },
  {
    titulo: '5G Network Engineer',
    descricao: 'Planeamento e otimização de redes 5G em ambiente urbano.',
    requisitos: '5G, RF Planning, Python, Linux, Análise de Dados',
    duracao: 5,
    local: 'Lisboa',
    dataPublicacao: '2024-03-09',
    empresa: 'Vodafone Portugal'
  },
  {
    titulo: 'Industry 4.0 Developer',
    descricao: 'Digitalização de processos industriais e manutenção preditiva.',
    requisitos: 'IIoT, PLC, Python, Azure IoT, Analytics',
    duracao: 6,
    local: 'Aveiro',
    dataPublicacao: '2024-03-11',
    empresa: 'Bosch Portugal'
  }
];

const candidaturaDefinitions = [
  { ref: 'cand-andre-farfetch', dataSubmissao: '2024-03-12', estado: 'Aceite', alunoEmail: 'andre.gomes@my.istec.pt', ofertaTitulo: 'Backend Developer - Commerce Platform' },
  { ref: 'cand-joana-critical', dataSubmissao: '2024-03-14', estado: 'Aceite', alunoEmail: 'joana.sousa@my.istec.pt', ofertaTitulo: 'Frontend Developer - Design Systems' },
  { ref: 'cand-diogo-sword', dataSubmissao: '2024-03-16', estado: 'Aceite', alunoEmail: 'diogo.rocha@my.istec.pt', ofertaTitulo: 'Machine Learning Engineer - Digital Health' },
  { ref: 'cand-mariana-platforme', dataSubmissao: '2024-03-18', estado: 'Aceite', alunoEmail: 'mariana.silva@my.istec.pt', ofertaTitulo: 'DevOps Engineer - Fashion Tech' },
  { ref: 'cand-hugo-natixis', dataSubmissao: '2024-03-20', estado: 'Aceite', alunoEmail: 'hugo.fernandes@my.istec.pt', ofertaTitulo: 'Data Analyst - Corporate Banking' },
  { ref: 'cand-ines-talkdesk', dataSubmissao: '2024-03-22', estado: 'Aceite', alunoEmail: 'ines.carvalho@my.istec.pt', ofertaTitulo: 'Product Designer - Contact Center' },
  { ref: 'cand-ricardo-outsyst', dataSubmissao: '2024-03-24', estado: 'Aceite', alunoEmail: 'ricardo.lopes@my.istec.pt', ofertaTitulo: 'Full-stack Developer - Low-code Platform' },
  { ref: 'cand-patricia-feedzai', dataSubmissao: '2024-03-26', estado: 'Aceite', alunoEmail: 'patricia.campos@my.istec.pt', ofertaTitulo: 'Data Scientist - Fraud Prevention' },
  { ref: 'cand-nuno-remote', dataSubmissao: '2024-03-28', estado: 'Aceite', alunoEmail: 'nuno.ribeiro@my.istec.pt', ofertaTitulo: 'Remote Operations Engineer' },
  { ref: 'cand-filipa-defined', dataSubmissao: '2024-03-30', estado: 'Aceite', alunoEmail: 'filipa.matos@my.istec.pt', ofertaTitulo: 'NLP Engineer - Conversational AI' },
  { ref: 'cand-bruno-sensei', dataSubmissao: '2024-04-01', estado: 'Aceite', alunoEmail: 'bruno.costa@my.istec.pt', ofertaTitulo: 'Computer Vision Engineer - Retail' },
  { ref: 'cand-sofia-unbabel', dataSubmissao: '2024-04-03', estado: 'Aceite', alunoEmail: 'sofia.almeida@my.istec.pt', ofertaTitulo: 'Localization Specialist - AI Translation' },
  { ref: 'cand-paulo-kencko', dataSubmissao: '2024-04-05', estado: 'Aceite', alunoEmail: 'paulo.correia@my.istec.pt', ofertaTitulo: 'Sustainability Analyst - Food Tech' },
  { ref: 'cand-vera-landing', dataSubmissao: '2024-04-07', estado: 'Aceite', alunoEmail: 'vera.pinto@my.istec.pt', ofertaTitulo: 'Community Manager - Tech Talent' },
  { ref: 'cand-luis-criticalman', dataSubmissao: '2024-04-09', estado: 'Aceite', alunoEmail: 'luis.morais@my.istec.pt', ofertaTitulo: 'Manufacturing Data Engineer' },
  { ref: 'cand-beatriz-mercedes', dataSubmissao: '2024-04-11', estado: 'Aceite', alunoEmail: 'beatriz.castro@my.istec.pt', ofertaTitulo: 'Cloud Architect - Automotive' },
  { ref: 'cand-tiago-teamviewer', dataSubmissao: '2024-04-13', estado: 'Aceite', alunoEmail: 'tiago.marques@my.istec.pt', ofertaTitulo: 'AR/VR Engineer' },
  { ref: 'cand-rita-sky', dataSubmissao: '2024-04-15', estado: 'Aceite', alunoEmail: 'rita.nogueira@my.istec.pt', ofertaTitulo: 'Data Engineer - Media Streaming' },
  { ref: 'cand-carlos-vodafone', dataSubmissao: '2024-04-17', estado: 'Aceite', alunoEmail: 'carlos.lima@my.istec.pt', ofertaTitulo: '5G Network Engineer' },
  { ref: 'cand-helena-bosch', dataSubmissao: '2024-04-19', estado: 'Aceite', alunoEmail: 'helena.figueiredo@my.istec.pt', ofertaTitulo: 'Industry 4.0 Developer' }
];

const stageDefinitions = [
  {
    ref: 'stage-01',
    candidaturaRef: 'cand-andre-farfetch',
    professorEmail: 'carolina.mendes@my.istec.pt',
    orientadorEmail: 'miguel.ferreira@farfetch.com',
    dataInicio: '2024-05-02',
    dataFim: '2024-10-31',
    estadoFinal: 'Concluido'
  },
  {
    ref: 'stage-02',
    candidaturaRef: 'cand-joana-critical',
    professorEmail: 'tiago.nunes@my.istec.pt',
    orientadorEmail: 'sofia.almeida@criticalsoftware.com',
    dataInicio: '2024-05-06',
    dataFim: '2024-11-04',
    estadoFinal: 'Concluido'
  },
  {
    ref: 'stage-03',
    candidaturaRef: 'cand-diogo-sword',
    professorEmail: 'andre.soares@my.istec.pt',
    orientadorEmail: 'paulo.santos@swordhealth.com',
    dataInicio: '2024-05-13',
    dataFim: '2024-11-15',
    estadoFinal: 'Concluido'
  },
  {
    ref: 'stage-04',
    candidaturaRef: 'cand-mariana-platforme',
    professorEmail: 'ines.barbosa@my.istec.pt',
    orientadorEmail: 'helena.costa@platforme.com',
    dataInicio: '2024-05-20',
    dataFim: '2024-11-18',
    estadoFinal: 'Concluido'
  },
  {
    ref: 'stage-05',
    candidaturaRef: 'cand-hugo-natixis',
    professorEmail: 'rita.oliveira@my.istec.pt',
    orientadorEmail: 'ricardo.oliveira@natixis.com',
    dataInicio: '2024-05-27',
    dataFim: '2024-11-25',
    estadoFinal: 'Concluido'
  },
  {
    ref: 'stage-06',
    candidaturaRef: 'cand-ines-talkdesk',
    professorEmail: 'bruno.martins@my.istec.pt',
    orientadorEmail: 'marisa.duarte@talkdesk.com',
    dataInicio: '2024-06-03',
    dataFim: '2024-12-02',
    estadoFinal: 'Concluido'
  },
  {
    ref: 'stage-07',
    candidaturaRef: 'cand-ricardo-outsyst',
    professorEmail: 'marta.figueira@my.istec.pt',
    orientadorEmail: 'joao.figueiredo@outsystems.com',
    dataInicio: '2024-06-10',
    dataFim: '2024-12-09',
    estadoFinal: 'Concluido'
  },
  {
    ref: 'stage-08',
    candidaturaRef: 'cand-patricia-feedzai',
    professorEmail: 'joao.duarte@my.istec.pt',
    orientadorEmail: 'patricia.leal@feedzai.com',
    dataInicio: '2024-06-17',
    dataFim: '2024-12-16',
    estadoFinal: 'Concluido'
  },
  {
    ref: 'stage-09',
    candidaturaRef: 'cand-nuno-remote',
    professorEmail: 'sara.moreira@my.istec.pt',
    orientadorEmail: 'bruno.azevedo@remote.com',
    dataInicio: '2024-07-01',
    dataFim: null,
    estadoFinal: null
  },
  {
    ref: 'stage-10',
    candidaturaRef: 'cand-filipa-defined',
    professorEmail: 'pedro.leite@my.istec.pt',
    orientadorEmail: 'andreia.rocha@defined.ai',
    dataInicio: '2024-07-08',
    dataFim: null,
    estadoFinal: null
  },
  {
    ref: 'stage-11',
    candidaturaRef: 'cand-bruno-sensei',
    professorEmail: 'ana.ferreira@my.istec.pt',
    orientadorEmail: 'nuno.guerra@sensei.tech',
    dataInicio: '2024-07-15',
    dataFim: null,
    estadoFinal: null
  },
  {
    ref: 'stage-12',
    candidaturaRef: 'cand-sofia-unbabel',
    professorEmail: 'luis.costa@my.istec.pt',
    orientadorEmail: 'carla.reis@unbabel.com',
    dataInicio: '2024-07-22',
    dataFim: null,
    estadoFinal: null
  },
  {
    ref: 'stage-13',
    candidaturaRef: 'cand-paulo-kencko',
    professorEmail: 'beatriz.lopes@my.istec.pt',
    orientadorEmail: 'rui.duarte@kencko.com',
    dataInicio: '2024-08-05',
    dataFim: null,
    estadoFinal: null
  },
  {
    ref: 'stage-14',
    candidaturaRef: 'cand-vera-landing',
    professorEmail: 'ricardo.amaral@my.istec.pt',
    orientadorEmail: 'vera.cardoso@landing.jobs',
    dataInicio: '2024-08-12',
    dataFim: null,
    estadoFinal: null
  },
  {
    ref: 'stage-15',
    candidaturaRef: 'cand-luis-criticalman',
    professorEmail: 'catarina.matos@my.istec.pt',
    orientadorEmail: 'carlos.barros@criticalmanufacturing.com',
    dataInicio: '2024-08-19',
    dataFim: null,
    estadoFinal: null
  },
  {
    ref: 'stage-16',
    candidaturaRef: 'cand-beatriz-mercedes',
    professorEmail: 'paulo.ribeiro@my.istec.pt',
    orientadorEmail: 'diana.moreira@mercedes-benz.io',
    dataInicio: '2024-09-02',
    dataFim: null,
    estadoFinal: null
  },
  {
    ref: 'stage-17',
    candidaturaRef: 'cand-tiago-teamviewer',
    professorEmail: 'helena.tavares@my.istec.pt',
    orientadorEmail: 'luis.carvalho@teamviewer.com',
    dataInicio: '2024-09-09',
    dataFim: null,
    estadoFinal: null
  },
  {
    ref: 'stage-18',
    candidaturaRef: 'cand-rita-sky',
    professorEmail: 'filipe.duarte@my.istec.pt',
    orientadorEmail: 'teresa.andrade@sky.com',
    dataInicio: '2024-09-16',
    dataFim: null,
    estadoFinal: null
  },
  {
    ref: 'stage-19',
    candidaturaRef: 'cand-carlos-vodafone',
    professorEmail: 'raquel.pires@my.istec.pt',
    orientadorEmail: 'filipe.matias@vodafone.com',
    dataInicio: '2024-09-23',
    dataFim: null,
    estadoFinal: null
  },
  {
    ref: 'stage-20',
    candidaturaRef: 'cand-helena-bosch',
    professorEmail: 'victor.carvalho@my.istec.pt',
    orientadorEmail: 'helder.pinho@bosch.com',
    dataInicio: '2024-10-07',
    dataFim: null,
    estadoFinal: null
  }
];

const evaluationDefinitions = [
  { stageRef: 'stage-01', tipo: 'Acompanhamento', data: '2024-07-15', pontuacao: 17, relatorio: 'Progresso consistente em integrações de pagamentos.' },
  { stageRef: 'stage-01', tipo: 'Final', data: '2024-10-31', pontuacao: 19, relatorio: 'Entrega final impecável, excedeu expectativa em performance.' },
  { stageRef: 'stage-02', tipo: 'Acompanhamento', data: '2024-07-18', pontuacao: 16, relatorio: 'Avanço sólido nas bibliotecas de componentes.' },
  { stageRef: 'stage-02', tipo: 'Final', data: '2024-11-04', pontuacao: 18, relatorio: 'Contribuiu com novos padrões no design system.' },
  { stageRef: 'stage-03', tipo: 'Acompanhamento', data: '2024-08-01', pontuacao: 18, relatorio: 'Modelos de previsão com melhoria de 7% na accuracy.' },
  { stageRef: 'stage-03', tipo: 'Final', data: '2024-11-15', pontuacao: 19, relatorio: 'Deployment estável em produção com monitorização ativa.' },
  { stageRef: 'stage-04', tipo: 'Acompanhamento', data: '2024-08-05', pontuacao: 15, relatorio: 'Precisa reforçar documentação, mas pipelines entregues.' },
  { stageRef: 'stage-04', tipo: 'Final', data: '2024-11-18', pontuacao: 17, relatorio: 'Automatizou o rollout azul/verde sem incidentes.' },
  { stageRef: 'stage-05', tipo: 'Acompanhamento', data: '2024-08-12', pontuacao: 16, relatorio: 'Dashboards em Power BI prontos para equipas comerciais.' },
  { stageRef: 'stage-05', tipo: 'Final', data: '2024-11-25', pontuacao: 18, relatorio: 'Implementou métricas que reduziram o tempo de reporte em 25%.' },
  { stageRef: 'stage-06', tipo: 'Acompanhamento', data: '2024-09-02', pontuacao: 17, relatorio: 'Explorou fluxos omnicanal e entregou testes de usabilidade.' },
  { stageRef: 'stage-06', tipo: 'Final', data: '2024-12-02', pontuacao: 18, relatorio: 'Design refinado aprovado por stakeholders globais.' },
  { stageRef: 'stage-07', tipo: 'Acompanhamento', data: '2024-09-09', pontuacao: 16, relatorio: 'Extensões low-code entregues para clientes enterprise.' },
  { stageRef: 'stage-07', tipo: 'Final', data: '2024-12-09', pontuacao: 17, relatorio: 'Integração com sistemas legacy sem incidentes.' },
  { stageRef: 'stage-08', tipo: 'Acompanhamento', data: '2024-09-16', pontuacao: 18, relatorio: 'Modelos de fraude calibrados com elevada precisão.' },
  { stageRef: 'stage-08', tipo: 'Final', data: '2024-12-16', pontuacao: 20, relatorio: 'Reduziu falsos positivos em 12% num piloto real.' },
  { stageRef: 'stage-09', tipo: 'Acompanhamento', data: '2024-09-30', pontuacao: 15, relatorio: 'Monitorização e runbooks em curso.' },
  { stageRef: 'stage-10', tipo: 'Acompanhamento', data: '2024-10-07', pontuacao: 16, relatorio: 'Modelos NLP em fase de testes com dados reais.' },
  { stageRef: 'stage-11', tipo: 'Acompanhamento', data: '2024-10-14', pontuacao: 15, relatorio: 'Prototipos de visão computacional validados em loja piloto.' },
  { stageRef: 'stage-12', tipo: 'Acompanhamento', data: '2024-10-21', pontuacao: 17, relatorio: 'Processos de QA linguístico otimizados com automação.' }
];

const documentDefinitions = [
  { stageRef: 'stage-01', nomeOriginal: 'relatorio-final-andre-gomes.pdf', ficheiro: 'stage-01-relatorio-final.pdf', categoria: 'relatorio', tipo: 'application/pdf', tamanho: 823456, uploadedAt: '2024-10-31 16:45:00' },
  { stageRef: 'stage-01', nomeOriginal: 'avaliacao-final-andre-gomes.docx', ficheiro: 'stage-01-avaliacao-final.docx', categoria: 'avaliacao', tipo: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', tamanho: 256000, uploadedAt: '2024-11-01 09:00:00' },
  { stageRef: 'stage-02', nomeOriginal: 'relatorio-final-joana-sousa.pdf', ficheiro: 'stage-02-relatorio-final.pdf', categoria: 'relatorio', tipo: 'application/pdf', tamanho: 745210, uploadedAt: '2024-11-05 14:30:00' },
  { stageRef: 'stage-02', nomeOriginal: 'avaliacao-final-joana-sousa.xlsx', ficheiro: 'stage-02-avaliacao-final.xlsx', categoria: 'avaliacao', tipo: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', tamanho: 182300, uploadedAt: '2024-11-06 10:10:00' },
  { stageRef: 'stage-03', nomeOriginal: 'relatorio-final-diogo-rocha.pdf', ficheiro: 'stage-03-relatorio-final.pdf', categoria: 'relatorio', tipo: 'application/pdf', tamanho: 912340, uploadedAt: '2024-11-16 17:20:00' },
  { stageRef: 'stage-03', nomeOriginal: 'avaliacao-final-diogo-rocha.docx', ficheiro: 'stage-03-avaliacao-final.docx', categoria: 'avaliacao', tipo: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', tamanho: 230144, uploadedAt: '2024-11-17 09:15:00' },
  { stageRef: 'stage-04', nomeOriginal: 'relatorio-final-mariana-silva.pdf', ficheiro: 'stage-04-relatorio-final.pdf', categoria: 'relatorio', tipo: 'application/pdf', tamanho: 688430, uploadedAt: '2024-11-19 15:05:00' },
  { stageRef: 'stage-04', nomeOriginal: 'avaliacao-final-mariana-silva.pdf', ficheiro: 'stage-04-avaliacao-final.pdf', categoria: 'avaliacao', tipo: 'application/pdf', tamanho: 305221, uploadedAt: '2024-11-20 11:40:00' },
  { stageRef: 'stage-05', nomeOriginal: 'relatorio-final-hugo-fernandes.pdf', ficheiro: 'stage-05-relatorio-final.pdf', categoria: 'relatorio', tipo: 'application/pdf', tamanho: 612350, uploadedAt: '2024-11-26 13:55:00' },
  { stageRef: 'stage-05', nomeOriginal: 'avaliacao-final-hugo-fernandes.docx', ficheiro: 'stage-05-avaliacao-final.docx', categoria: 'avaliacao', tipo: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', tamanho: 210564, uploadedAt: '2024-11-27 09:50:00' },
  { stageRef: 'stage-06', nomeOriginal: 'slide-review-ines-carvalho.pptx', ficheiro: 'stage-06-design-review.pptx', categoria: 'outro', tipo: 'application/vnd.openxmlformats-officedocument.presentationml.presentation', tamanho: 1456720, uploadedAt: '2024-10-10 12:00:00' },
  { stageRef: 'stage-07', nomeOriginal: 'plano-testes-ricardo-lopes.pdf', ficheiro: 'stage-07-plano-testes.pdf', categoria: 'relatorio', tipo: 'application/pdf', tamanho: 432123, uploadedAt: '2024-10-15 11:20:00' },
  { stageRef: 'stage-08', nomeOriginal: 'relatorio-intermedio-patricia-campos.pdf', ficheiro: 'stage-08-relatorio-intermedio.pdf', categoria: 'relatorio', tipo: 'application/pdf', tamanho: 501230, uploadedAt: '2024-10-18 09:35:00' },
  { stageRef: 'stage-09', nomeOriginal: 'runbook-operacoes-remote.pdf', ficheiro: 'stage-09-runbook.pdf', categoria: 'outro', tipo: 'application/pdf', tamanho: 382114, uploadedAt: '2024-09-20 16:45:00' },
  { stageRef: 'stage-10', nomeOriginal: 'documentacao-modelos-filipa-matos.pdf', ficheiro: 'stage-10-doc-modelos.pdf', categoria: 'relatorio', tipo: 'application/pdf', tamanho: 552890, uploadedAt: '2024-10-25 14:25:00' },
  { stageRef: 'stage-11', nomeOriginal: 'teste-cameras-bruno-costa.xlsx', ficheiro: 'stage-11-testes-cameras.xlsx', categoria: 'outro', tipo: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', tamanho: 185670, uploadedAt: '2024-10-28 08:55:00' },
  { stageRef: 'stage-12', nomeOriginal: 'qa-linguistico-sofia-almeida.pdf', ficheiro: 'stage-12-qa-linguistico.pdf', categoria: 'relatorio', tipo: 'application/pdf', tamanho: 462210, uploadedAt: '2024-11-04 10:50:00' },
  { stageRef: 'stage-13', nomeOriginal: 'analise-sustentabilidade-paulo-correia.pdf', ficheiro: 'stage-13-analise-sustentabilidade.pdf', categoria: 'relatorio', tipo: 'application/pdf', tamanho: 642330, uploadedAt: '2024-11-08 17:05:00' },
  { stageRef: 'stage-14', nomeOriginal: 'relatorio-eventos-vera-pinto.pdf', ficheiro: 'stage-14-relatorio-eventos.pdf', categoria: 'relatorio', tipo: 'application/pdf', tamanho: 392110, uploadedAt: '2024-11-11 18:25:00' },
  { stageRef: 'stage-15', nomeOriginal: 'checklist-fabrica-luis-morais.xlsx', ficheiro: 'stage-15-checklist-fabrica.xlsx', categoria: 'outro', tipo: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', tamanho: 205660, uploadedAt: '2024-11-14 07:50:00' },
  { stageRef: 'stage-16', nomeOriginal: 'arquitetura-cloud-beatriz-castro.pdf', ficheiro: 'stage-16-arquitetura-cloud.pdf', categoria: 'relatorio', tipo: 'application/pdf', tamanho: 712440, uploadedAt: '2024-11-18 15:15:00' }
];

const companyUsers = companyDefinitions.map((company) => ({
  nome: company.userNome,
  email: company.userEmail,
  role: 'Empresa'
}));

const studentUsers = studentDefinitions.map((student) => ({
  nome: student.nome,
  email: student.email,
  role: 'Aluno'
}));

const professorUsers = professorDefinitions.map((professor) => ({
  nome: professor.nome,
  email: professor.email,
  role: 'Professor'
}));

const gestorUsers = gestorDefinitions.map((gestor) => ({
  nome: gestor.nome,
  email: gestor.email,
  role: 'Gestor'
}));

function hashPassword() {
  return bcrypt.hashSync(DEFAULT_PASSWORD, BCRYPT_ROUNDS);
}

function ensure(map, key, errorMessage) {
  const value = map.get(key);
  if (value == null) {
    throw new Error(errorMessage);
  }
  return value;
}

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

    const allUsers = [...companyUsers, ...studentUsers, ...professorUsers, ...gestorUsers];
    const userValues = allUsers.map((user) => [user.nome, user.email, hashPassword(), user.role]);
    await connection.query('INSERT INTO Utilizador (nome, email, password, role) VALUES ?', [userValues]);
    console.log(`Utilizadores inseridos (${allUsers.length} total)`);

    const [userRows] = await connection.query(
      'SELECT id, email FROM Utilizador WHERE email IN (?)',
      [allUsers.map((user) => user.email)]
    );
    const userIdByEmail = new Map(userRows.map((row) => [row.email, row.id]));

    const companyValues = companyDefinitions.map((company) => [
      company.nomeEmpresa,
      company.nif,
      company.morada,
      company.validada,
      ensure(userIdByEmail, company.userEmail, `Utilizador da empresa ${company.nomeEmpresa} não encontrado`)
    ]);
    await connection.query(
      'INSERT INTO Empresa (nome_empresa, NIF, morada, validada, id_utilizador) VALUES ?',
      [companyValues]
    );
    console.log(`Empresas inseridas (${companyDefinitions.length} total)`);

    const [companyRows] = await connection.query(
      'SELECT id_empresa, nome_empresa FROM Empresa WHERE nome_empresa IN (?)',
      [companyDefinitions.map((company) => company.nomeEmpresa)]
    );
    const companyIdByName = new Map(companyRows.map((row) => [row.nome_empresa, row.id_empresa]));

    const orientadorValues = orientadorDefinitions.map((orientador) => [
      orientador.nome,
      orientador.cargo,
      orientador.email,
      orientador.telefone,
      ensure(companyIdByName, orientador.empresa, `Empresa ${orientador.empresa} não encontrada para orientador ${orientador.nome}`)
    ]);
    await connection.query(
      'INSERT INTO OrientadorEmpresa (nome, cargo, email, telefone, id_empresa) VALUES ?',
      [orientadorValues]
    );
    console.log(`Orientadores de empresa inseridos (${orientadorDefinitions.length} total)`);

    const studentValues = studentDefinitions.map((student) => [
      student.curso,
      student.cv,
      student.competencias,
      student.areaInteresse,
      ensure(userIdByEmail, student.email, `Utilizador do aluno ${student.nome} não encontrado`),
      student.estagioStatus ? 1 : 0
    ]);
    await connection.query(
      'INSERT INTO Aluno (curso, CV, competencias, area_interesse, id_utilizador, estagio_status) VALUES ?',
      [studentValues]
    );
    console.log(`Alunos inseridos (${studentDefinitions.length} total)`);

    const gestorValues = gestorDefinitions.map((gestor) => [
      ensure(userIdByEmail, gestor.email, `Utilizador do gestor ${gestor.nome} não encontrado`)
    ]);
    await connection.query('INSERT INTO Gestor (id_utilizador) VALUES ?', [gestorValues]);
    console.log(`Gestores inseridos (${gestorDefinitions.length} total)`);

    const professorValues = professorDefinitions.map((professor) => [
      professor.departamento,
      ensure(userIdByEmail, professor.email, `Utilizador do professor ${professor.nome} não encontrado`)
    ]);
    await connection.query(
      'INSERT INTO ProfessorOrientador (departamento, id_utilizador) VALUES ?',
      [professorValues]
    );
    console.log(`Professores orientadores inseridos (${professorDefinitions.length} total)`);

    const [studentRows] = await connection.query(
      `SELECT a.id_aluno, u.email
       FROM Aluno a
       INNER JOIN Utilizador u ON a.id_utilizador = u.id
       WHERE u.email IN (?)`,
      [studentDefinitions.map((student) => student.email)]
    );
    const alunoIdByEmail = new Map(studentRows.map((row) => [row.email, row.id_aluno]));

    const [professorRows] = await connection.query(
      `SELECT p.id_professor, u.email
       FROM ProfessorOrientador p
       INNER JOIN Utilizador u ON p.id_utilizador = u.id
       WHERE u.email IN (?)`,
      [professorDefinitions.map((professor) => professor.email)]
    );
    const professorIdByEmail = new Map(professorRows.map((row) => [row.email, row.id_professor]));

    const [orientadorRows] = await connection.query(
      'SELECT id_orientador, email FROM OrientadorEmpresa WHERE email IN (?)',
      [orientadorDefinitions.map((orientador) => orientador.email)]
    );
    const orientadorIdByEmail = new Map(orientadorRows.map((row) => [row.email, row.id_orientador]));

    const offerValues = offerDefinitions.map((offer) => [
      offer.titulo,
      offer.descricao,
      offer.requisitos,
      offer.duracao,
      offer.local,
      offer.dataPublicacao,
      ensure(companyIdByName, offer.empresa, `Empresa ${offer.empresa} não encontrada para oferta ${offer.titulo}`)
    ]);
    await connection.query(
      'INSERT INTO OfertaEstagio (titulo, descricao, requisitos, duracao, local, data_publicacao, id_empresa) VALUES ?',
      [offerValues]
    );
    console.log(`Ofertas de estágio inseridas (${offerDefinitions.length} total)`);

    const [offerRows] = await connection.query(
      'SELECT id_oferta, titulo FROM OfertaEstagio WHERE titulo IN (?)',
      [offerDefinitions.map((offer) => offer.titulo)]
    );
    const ofertaIdByTitulo = new Map(offerRows.map((row) => [row.titulo, row.id_oferta]));

    const candidaturaValues = candidaturaDefinitions.map((candidatura) => [
      candidatura.dataSubmissao,
      candidatura.estado,
      ensure(alunoIdByEmail, candidatura.alunoEmail, `Aluno ${candidatura.alunoEmail} não encontrado`),
      ensure(ofertaIdByTitulo, candidatura.ofertaTitulo, `Oferta ${candidatura.ofertaTitulo} não encontrada`)
    ]);
    await connection.query(
      'INSERT INTO Candidatura (data_submissao, estado, id_aluno, id_oferta) VALUES ?',
      [candidaturaValues]
    );
    console.log(`Candidaturas inseridas (${candidaturaDefinitions.length} total)`);

    const [candidaturaRows] = await connection.query(
      `SELECT c.id_candidatura, u.email AS alunoEmail, o.titulo AS ofertaTitulo
       FROM Candidatura c
       INNER JOIN Aluno a ON c.id_aluno = a.id_aluno
       INNER JOIN Utilizador u ON a.id_utilizador = u.id
       INNER JOIN OfertaEstagio o ON c.id_oferta = o.id_oferta
       WHERE o.titulo IN (?)`,
      [candidaturaDefinitions.map((candidatura) => candidatura.ofertaTitulo)]
    );

    const candidaturaIdByKey = new Map(
      candidaturaRows.map((row) => [`${row.alunoEmail}|${row.ofertaTitulo}`, row.id_candidatura])
    );

    const stageValues = stageDefinitions.map((stage) => {
      const candidatura = candidaturaDefinitions.find((item) => item.ref === stage.candidaturaRef);
      if (!candidatura) {
        throw new Error(`Candidatura ${stage.candidaturaRef} não encontrada para estágio ${stage.ref}`);
      }
      const candidaturaKey = `${candidatura.alunoEmail}|${candidatura.ofertaTitulo}`;
      return [
        stage.dataInicio,
        stage.dataFim,
        stage.estadoFinal,
        ensure(candidaturaIdByKey, candidaturaKey, `Candidatura ${candidaturaKey} não encontrada`),
        ensure(professorIdByEmail, stage.professorEmail, `Professor ${stage.professorEmail} não encontrado`),
        ensure(orientadorIdByEmail, stage.orientadorEmail, `Orientador ${stage.orientadorEmail} não encontrado`)
      ];
    });

    await connection.query(
      'INSERT INTO Estagio (data_inicio, data_fim, estado_final, id_candidatura, id_professor, id_orientador) VALUES ?',
      [stageValues]
    );
    console.log(`Estágios inseridos (${stageDefinitions.length} total)`);

    const [stageRows] = await connection.query(
      `SELECT e.id_estagio, u.email AS alunoEmail, o.titulo AS ofertaTitulo
       FROM Estagio e
       INNER JOIN Candidatura c ON e.id_candidatura = c.id_candidatura
       INNER JOIN Aluno a ON c.id_aluno = a.id_aluno
       INNER JOIN Utilizador u ON a.id_utilizador = u.id
       INNER JOIN OfertaEstagio o ON c.id_oferta = o.id_oferta`
    );

    const stageIdByKey = new Map(
      stageRows.map((row) => [`${row.alunoEmail}|${row.ofertaTitulo}`, row.id_estagio])
    );

    const stageIdByRef = new Map();
    for (const stage of stageDefinitions) {
      const candidatura = candidaturaDefinitions.find((item) => item.ref === stage.candidaturaRef);
      const key = `${candidatura.alunoEmail}|${candidatura.ofertaTitulo}`;
      stageIdByRef.set(stage.ref, ensure(stageIdByKey, key, `Estágio para ${key} não encontrado`));
    }

    const evaluationValues = evaluationDefinitions.map((evaluation) => [
      evaluation.tipo,
      evaluation.data,
      evaluation.pontuacao,
      evaluation.relatorio,
      ensure(stageIdByRef, evaluation.stageRef, `Estágio ${evaluation.stageRef} não encontrado para avaliação`)
    ]);
    await connection.query(
      'INSERT INTO Avaliacao (tipo, data, pontuacao, relatorio_texto, id_estagio) VALUES ?',
      [evaluationValues]
    );
    console.log(`Avaliações inseridas (${evaluationDefinitions.length} total)`);

    const documentValues = documentDefinitions.map((document) => [
      ensure(stageIdByRef, document.stageRef, `Estágio ${document.stageRef} não encontrado para documento`),
      document.nomeOriginal,
      document.ficheiro,
      document.categoria,
      document.tipo,
      document.tamanho,
      document.uploadedAt
    ]);
    await connection.query(
      'INSERT INTO DocumentoEstagio (id_estagio, nome_original, ficheiro, categoria, tipo, tamanho, uploaded_at) VALUES ?',
      [documentValues]
    );
    console.log(`Documentos inseridos (${documentDefinitions.length} total)`);

    console.log('\nTodos os dados de exemplo foram inseridos com sucesso!');
    console.log('\nResumo:');
    console.log(`   - ${companyDefinitions.length} Empresas tech validadas`);
    console.log(`   - ${studentDefinitions.length} Alunos`);
    console.log(`   - ${professorDefinitions.length} Professores orientadores`);
    console.log(`   - ${gestorDefinitions.length} Gestores`);
    console.log(`   - ${offerDefinitions.length} Ofertas de estágio`);
    console.log(`   - ${candidaturaDefinitions.length} Candidaturas`);
    console.log(`   - ${stageDefinitions.length} Estágios acompanhados`);
    console.log(`   - ${evaluationDefinitions.length} Avaliações registadas`);
    console.log(`   - ${documentDefinitions.length} Documentos associados`);
    console.log(`\nPalavra-passe padrão para contas seed: ${DEFAULT_PASSWORD}`);

  } catch (err) {
    console.error('Erro ao inserir dados:', err.message);
    throw err;
  } finally {
    await connection.end();
    console.log('\nConexão encerrada.');
  }
}

insertExampleData();