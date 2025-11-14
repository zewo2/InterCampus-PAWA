const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE || 'intercampus_db'
});

const tables = [
  `CREATE TABLE IF NOT EXISTS Utilizador (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(255) COMMENT 'Empresa, Aluno, Professor, Gestor'
  )`,

  `CREATE TABLE IF NOT EXISTS Empresa (
    id_empresa INTEGER PRIMARY KEY AUTO_INCREMENT,
    nome_empresa VARCHAR(255),
    NIF VARCHAR(255),
    morada VARCHAR(255),
    validada BOOLEAN,
    id_utilizador INTEGER NOT NULL,
    FOREIGN KEY (id_utilizador) REFERENCES Utilizador(id)
  )`,

  `CREATE TABLE IF NOT EXISTS OrientadorEmpresa (
    id_orientador INTEGER PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(255),
    cargo VARCHAR(255),
    email VARCHAR(255),
    telefone VARCHAR(255),
    id_empresa INTEGER NOT NULL,
    CONSTRAINT empresa_orientador FOREIGN KEY (id_empresa) REFERENCES Empresa(id_empresa)
  )`,

  `CREATE TABLE IF NOT EXISTS Aluno (
    id_aluno INTEGER PRIMARY KEY AUTO_INCREMENT,
    curso VARCHAR(255),
    CV TEXT,
    competencias TEXT,
    area_interesse VARCHAR(255),
    id_utilizador INTEGER NOT NULL,
    estagio_status BOOLEAN,
    FOREIGN KEY (id_utilizador) REFERENCES Utilizador(id)
  )`,

  `CREATE TABLE IF NOT EXISTS Gestor (
    id_gestor INTEGER PRIMARY KEY AUTO_INCREMENT,
    id_utilizador INTEGER NOT NULL,
    FOREIGN KEY (id_utilizador) REFERENCES Utilizador(id)
  )`,

  `CREATE TABLE IF NOT EXISTS ProfessorOrientador (
    id_professor INTEGER PRIMARY KEY AUTO_INCREMENT,
    departamento VARCHAR(255),
    id_utilizador INTEGER NOT NULL,
    FOREIGN KEY (id_utilizador) REFERENCES Utilizador(id)
  )`,

  `CREATE TABLE IF NOT EXISTS OfertaEstagio (
    id_oferta INTEGER PRIMARY KEY AUTO_INCREMENT,
    titulo VARCHAR(255),
    descricao TEXT,
    requisitos TEXT,
    duracao INTEGER,
    local VARCHAR(255),
    data_publicacao DATE,
    id_empresa INTEGER NOT NULL,
    CONSTRAINT empresa_oferta FOREIGN KEY (id_empresa) REFERENCES Empresa(id_empresa)
  )`,

  `CREATE TABLE IF NOT EXISTS Candidatura (
    id_candidatura INTEGER PRIMARY KEY AUTO_INCREMENT,
    data_submissao DATE,
    estado VARCHAR(255) COMMENT 'Pendente, Aceite, Recusado',
    id_aluno INTEGER NOT NULL,
    id_oferta INTEGER NOT NULL,
    CONSTRAINT aluno_candidatura FOREIGN KEY (id_aluno) REFERENCES Aluno(id_aluno),
    CONSTRAINT oferta_candidatura FOREIGN KEY (id_oferta) REFERENCES OfertaEstagio(id_oferta)
  )`,

  `CREATE TABLE IF NOT EXISTS Estagio (
    id_estagio INTEGER PRIMARY KEY AUTO_INCREMENT,
    data_inicio DATE,
    data_fim DATE,
    estado_final VARCHAR(255) COMMENT 'Concluido, Cancelado',
    id_candidatura INTEGER NOT NULL,
    id_professor INTEGER NOT NULL,
    id_orientador INTEGER NOT NULL COMMENT 'Orientador dentro da empresa',
    CONSTRAINT candidatura_estagio FOREIGN KEY (id_candidatura) REFERENCES Candidatura(id_candidatura),
    CONSTRAINT professor_estagio FOREIGN KEY (id_professor) REFERENCES ProfessorOrientador(id_professor),
    CONSTRAINT orientador_estagio FOREIGN KEY (id_orientador) REFERENCES OrientadorEmpresa(id_orientador)
  )`,

  `CREATE TABLE IF NOT EXISTS Avaliacao (
    id_avaliacao INTEGER PRIMARY KEY AUTO_INCREMENT,
    tipo VARCHAR(255) COMMENT 'Acompanhamento, Final',
    data DATE,
    pontuacao INTEGER,
    relatorio_texto TEXT,
    id_estagio INTEGER NOT NULL,
    CONSTRAINT estagio_avaliacao FOREIGN KEY (id_estagio) REFERENCES Estagio(id_estagio)
  )`,

  `CREATE TABLE IF NOT EXISTS DocumentoEstagio (
    id_documento INTEGER PRIMARY KEY AUTO_INCREMENT,
    id_estagio INTEGER NOT NULL,
    nome_original VARCHAR(255) NOT NULL,
    ficheiro VARCHAR(255) NOT NULL,
    categoria VARCHAR(100),
    tipo VARCHAR(100),
    tamanho INTEGER,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT estagio_documento FOREIGN KEY (id_estagio) REFERENCES Estagio(id_estagio)
  )`
];

async function createTables() {
  try {
    await connection.promise().connect();
    console.log('Conectado ao MySQL!');

    for (const [index, sql] of tables.entries()) {
      await connection.promise().query(sql);
      console.log(`Tabela ${index + 1}/${tables.length} criada com sucesso!`);
    }

    console.log('\nTodas as tabelas foram criadas com sucesso!');
  } catch (err) {
    console.error('Erro ao criar tabelas:', err.message);
    throw err;
  } finally {
    await connection.promise().end();
    console.log('Conexão encerrada.');
  }
}

createTables();