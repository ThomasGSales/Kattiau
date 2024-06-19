const mysql = require("mysql2");

// Configuração do banco de dados
const conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Tg@2407*",
  database: "kattiau",
});

// Conectar ao banco de dados
conn.connect((err) => {
  if (err) {
    console.error("Erro ao conectar ao banco de dados:", err);
    return;
  }
  console.log("Conectado ao banco de dados MySQL.");
});

module.exports = { conn };
