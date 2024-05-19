const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Middleware para permitir solicitações de diferentes origens (CORS)
app.use(cors());

// Configuração do banco de dados
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Tg@2407*',
    database: 'kattiau'
});

// Conectar ao banco de dados
connection.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        return;
    }
    console.log('Conectado ao banco de dados MySQL.');
});

// Middleware para análise de corpo de solicitação
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Rota para lidar com solicitações POST do formulário
app.post('/adicionar-produto', (req, res) => {
    const { nome, preco } = req.body;

    const sql = 'INSERT INTO Produto (Nome, Preco) VALUES (?, ?)';
    connection.query(sql, [nome, preco], (err, result) => {
        if (err) {
            console.error('Erro ao inserir produto:', err);
            res.status(500).send('Erro ao inserir produto.');
            return;
        }
        console.log('Produto inserido com sucesso:', result);
        res.status(200).send('Produto inserido com sucesso.');
    });
});

// Rota para listar todos os produtos
app.get('/produtos', (req, res) => {
    const sql = 'SELECT * FROM Produto';
    connection.query(sql, (err, results) => {
        if (err) {
            console.error('Erro ao buscar produtos:', err);
            res.status(500).json({ error: 'Erro ao buscar produtos.' });
            return;
        }
        res.json(results);
    });
});

// Rota para atualizar um produto
app.put('/produtos/:id', (req, res) => {
    const { id } = req.params;
    const { nome, preco } = req.body;

    const sql = 'UPDATE Produto SET Nome = ?, Preco = ? WHERE ID_Produto = ?';
    connection.query(sql, [nome, preco, id], (err, result) => {
        if (err) {
            console.error('Erro ao atualizar produto:', err);
            res.status(500).json({ error: 'Erro ao atualizar produto.' });
            return;
        }
        console.log('Produto atualizado com sucesso:', result);
        res.json({ message: 'Produto atualizado com sucesso.' });
    });
});

// Rota para deletar um produto
app.delete('/produtos/:id', (req, res) => {
    const { id } = req.params;

    const sql = 'DELETE FROM Produto WHERE ID_Produto = ?';
    connection.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Erro ao deletar produto:', err);
            res.status(500).json({ error: 'Erro ao deletar produto.' });
            return;
        }
        console.log('Produto deletado com sucesso:', result);
        res.json({ message: 'Produto deletado com sucesso.' });
    });
});

// Iniciar o servidor
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`Servidor está ouvindo na porta ${PORT}`);
});
