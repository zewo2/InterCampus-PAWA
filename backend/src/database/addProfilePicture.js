const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const mysql = require('mysql2/promise');

async function addProfilePictureColumn() {
  const dbName = process.env.DB_DATABASE || 'intercampus_db';
  let connection;

  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: dbName
    });

    console.log('Conectado ao MySQL!');

    // Check if column already exists
    const [columns] = await connection.execute(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = ? 
      AND TABLE_NAME = 'Utilizador' 
      AND COLUMN_NAME = 'profile_picture'
    `, [dbName]);

    if (columns.length > 0) {
      console.log('A coluna profile_picture já existe na tabela Utilizador.');
    } else {
      // Add profile_picture column to Utilizador table
      await connection.execute(`
        ALTER TABLE Utilizador 
        ADD COLUMN profile_picture VARCHAR(500) DEFAULT NULL COMMENT 'Relative path to profile picture'
      `);
      console.log('✓ Coluna profile_picture adicionada à tabela Utilizador com sucesso!');
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(__dirname, '../../uploads/profile-pictures');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
      console.log('✓ Diretório uploads/profile-pictures criado com sucesso!');
    } else {
      console.log('O diretório uploads/profile-pictures já existe.');
    }

    // Create a .gitkeep file to ensure the directory is tracked
    const gitkeepPath = path.join(uploadsDir, '.gitkeep');
    if (!fs.existsSync(gitkeepPath)) {
      fs.writeFileSync(gitkeepPath, '');
      console.log('✓ Arquivo .gitkeep criado no diretório uploads/profile-pictures.');
    }

    console.log('\n✅ Migração concluída com sucesso!');
    console.log('📁 As imagens de perfil serão armazenadas em: backend/uploads/profile-pictures/');
    console.log('💾 O caminho relativo será salvo no banco de dados na coluna profile_picture.');
    
  } catch (err) {
    console.error('❌ Erro durante a migração:', err.message);
    throw err;
  } finally {
    if (connection) {
      try {
        await connection.end();
        console.log('Conexão encerrada.');
      } catch (e) {
        console.warn('Erro ao encerrar a conexão:', e.message);
      }
    }
  }
}

addProfilePictureColumn();
