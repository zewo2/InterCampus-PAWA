const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

connection.connect(function(err) {
    if (err) throw err;
    console.log('Conectado ao MySQL!');

    connection.query("CREATE DATABASE IF NOT EXISTS intercampus_db", function(err, result) {
        if (err) throw err;
        console.log("Base de Dados 'intercampus_db' criada com sucesso!");
        connection.end();
    });
});