const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const mysql = require('mysql2/promise');

async function resetDatabase() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE || 'intercampus_db'
  });

  try {
    console.log('Conectado ao MySQL!');
    console.log('A limpar todas as tabelas...\n');

    // Disable foreign key checks temporarily to allow truncation
    await connection.query('SET FOREIGN_KEY_CHECKS = 0');

    // Truncate all tables in reverse order of dependencies
    const tables = [
      'Avaliacao',
      'DocumentoEstagio',
      'Estagio',
      'Candidatura',
      'OfertaEstagio',
      'OrientadorEmpresa',
      'Empresa',
      'ProfessorOrientador',
      'Gestor',
      'Aluno',
      'Utilizador'
    ];

    for (const table of tables) {
      await connection.query(`TRUNCATE TABLE ${table}`);
      console.log(`✓ Tabela ${table} limpa`);
    }

    // Re-enable foreign key checks
    await connection.query('SET FOREIGN_KEY_CHECKS = 1');

    console.log('\n✅ Todas as tabelas foram limpas com sucesso!');
    console.log('Execute "npm run seed-db" para inserir dados de exemplo novamente.\n');

  } catch (err) {
    console.error('❌ Erro ao limpar base de dados:', err.message);
    throw err;
  } finally {
    await connection.end();
    console.log('Conexão encerrada.');
  }
}

resetDatabase();
