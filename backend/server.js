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

    connection.beginTransaction((err) => {
        if (err) {
            console.error('Erro ao iniciar transação:', err);
            res.status(500).json({ error: 'Erro ao iniciar transação.' });
            return;
        }

        const insertProdutoSql = 'INSERT INTO Produto (Nome, Preco) VALUES (?, ?)';
        
        connection.query(insertProdutoSql, [nome, preco], (err, result) => {
            if (err) {
                return connection.rollback(() => {
                    console.error('Erro ao inserir produto:', err);
                    res.status(500).send('Erro ao inserir produto.');
                });
            }

            const produtoId = result.insertId;

            const insertAvaliacaoSql = 'INSERT INTO avaliacao (id_produto) VALUES "inserir"';
            const insertDetalhesPedidoSql = 'INSERT INTO detalhespedido (id_produto) VALUES "inserir"';
            const insertProdutoCategoriaSql = 'INSERT INTO produtocategoria (id_produto) VALUES "inserir"';
            const insertProdutoFornecedorSql = 'INSERT INTO produtofornecedor (id_produto) VALUES "inserir"';

            connection.query(insertAvaliacaoSql, [produtoId], (err, result) => {
                if (err) {
                    return connection.rollback(() => {
                        console.error('Erro ao inserir avaliação:', err);
                        res.status(500).send('Erro ao inserir avaliação.');
                    });
                }

                connection.query(insertDetalhesPedidoSql, [produtoId], (err, result) => {
                    if (err) {
                        return connection.rollback(() => {
                            console.error('Erro ao inserir detalhes do pedido:', err);
                            res.status(500).send('Erro ao inserir detalhes do pedido.');
                        });
                    }

                    connection.query(insertProdutoCategoriaSql, [produtoId], (err, result) => {
                        if (err) {
                            return connection.rollback(() => {
                                console.error('Erro ao inserir categoria do produto:', err);
                                res.status(500).send('Erro ao inserir categoria do produto.');
                            });
                        }

                        connection.query(insertProdutoFornecedorSql, [produtoId], (err, result) => {
                            if (err) {
                                return connection.rollback(() => {
                                    console.error('Erro ao inserir fornecedor do produto:', err);
                                    res.status(500).send('Erro ao inserir fornecedor do produto.');
                                });
                            }

                            connection.commit((err) => {
                                if (err) {
                                    return connection.rollback(() => {
                                        console.error('Erro ao commitar transação:', err);
                                        res.status(500).json({ error: 'Erro ao commitar transação.' });
                                    });
                                }
                                console.log('Produto e registros relacionados inseridos com sucesso.');
                                res.status(200).send('Produto e registros relacionados inseridos com sucesso.');
                            });
                        });
                    });
                });
            });
        });
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

    connection.beginTransaction((err) => {
        if (err) {
            console.error('Erro ao iniciar transação:', err);
            res.status(500).json({ error: 'Erro ao iniciar transação.' });
            return;
        }

        const deleteAvaliacaoSql = 'DELETE FROM avaliacao WHERE id_produto = ?';
        const deleteDetalhesPedidoSql = 'DELETE FROM detalhespedido WHERE id_produto = ?';
        const deleteProdutoCategoriaSql = 'DELETE FROM produtocategoria WHERE id_produto = ?';
        const deleteProdutoFornecedorSql = 'DELETE FROM produtofornecedor WHERE id_produto = ?';
        const deleteProdutoSql = 'DELETE FROM produto WHERE id_produto = ?';

        connection.query(deleteAvaliacaoSql, [id], (err, result) => {
            if (err) {
                return connection.rollback(() => {
                    console.error('Erro ao deletar avaliação:', err);
                    res.status(500).json({ error: 'Erro ao deletar avaliação.' });
                });
            }

            connection.query(deleteDetalhesPedidoSql, [id], (err, result) => {
                if (err) {
                    return connection.rollback(() => {
                        console.error('Erro ao deletar detalhes do pedido:', err);
                        res.status(500).json({ error: 'Erro ao deletar detalhes do pedido.' });
                    });
                }

                connection.query(deleteProdutoCategoriaSql, [id], (err, result) => {
                    if (err) {
                        return connection.rollback(() => {
                            console.error('Erro ao deletar categoria do produto:', err);
                            res.status(500).json({ error: 'Erro ao deletar categoria do produto.' });
                        });
                    }

                    connection.query(deleteProdutoFornecedorSql, [id], (err, result) => {
                        if (err) {
                            return connection.rollback(() => {
                                console.error('Erro ao deletar fornecedor do produto:', err);
                                res.status(500).json({ error: 'Erro ao deletar fornecedor do produto.' });
                            });
                        }

                        connection.query(deleteProdutoSql, [id], (err, result) => {
                            if (err) {
                                return connection.rollback(() => {
                                    console.error('Erro ao deletar produto:', err);
                                    res.status(500).json({ error: 'Erro ao deletar produto.' });
                                });
                            }

                            if (result.affectedRows === 0) {
                                return connection.rollback(() => {
                                    res.status(404).json({ error: 'Produto não encontrado.' });
                                });
                            } else {
                                connection.commit((err) => {
                                    if (err) {
                                        return connection.rollback(() => {
                                            console.error('Erro ao commitar transação:', err);
                                            res.status(500).json({ error: 'Erro ao commitar transação.' });
                                        });
                                    }
                                    console.log('Produto deletado com sucesso:', result);
                                    res.json({ message: 'Produto deletado com sucesso.' });
                                });
                            }
                        });
                    });
                });
            });
        });
    });
});

// Rota para buscar detalhes de um produto específico e suas relações
app.get('/produtos/:id', (req, res) => {
    const { id } = req.params;

    const productDetailsSql = 'SELECT * FROM Produto WHERE ID_Produto = ?';
    const reviewsSql = 'SELECT * FROM avaliacao WHERE id_produto = ?';
    const orderDetailsSql = 'SELECT * FROM detalhespedido WHERE id_produto = ?';
    const categorySql = 'SELECT * FROM produtocategoria WHERE id_produto = ?';
    const supplierSql = 'SELECT * FROM produtofornecedor WHERE id_produto = ?';

    connection.beginTransaction((err) => {
        if (err) {
            console.error('Erro ao iniciar transação:', err);
            res.status(500).json({ error: 'Erro ao iniciar transação.' });
            return;
        }

        connection.query(productDetailsSql, [id], (err, productResult) => {
            if (err) {
                return connection.rollback(() => {
                    console.error('Erro ao buscar detalhes do produto:', err);
                    res.status(500).json({ error: 'Erro ao buscar detalhes do produto.' });
                });
            }
            if (productResult.length === 0) {
                return connection.rollback(() => {
                    res.status(404).json({ error: 'Produto não encontrado.' });
                });
            }

            const product = productResult[0];

            connection.query(reviewsSql, [id], (err, reviewsResult) => {
                if (err) {
                    return connection.rollback(() => {
                        console.error('Erro ao buscar avaliações:', err);
                        res.status(500).json({ error: 'Erro ao buscar avaliações.' });
                    });
                }

                connection.query(orderDetailsSql, [id], (err, orderDetailsResult) => {
                    if (err) {
                        return connection.rollback(() => {
                            console.error('Erro ao buscar detalhes do pedido:', err);
                            res.status(500).json({ error: 'Erro ao buscar detalhes do pedido.' });
                        });
                    }

                    connection.query(categorySql, [id], (err, categoryResult) => {
                        if (err) {
                            return connection.rollback(() => {
                                console.error('Erro ao buscar categorias:', err);
                                res.status(500).json({ error: 'Erro ao buscar categorias.' });
                            });
                        }

                        connection.query(supplierSql, [id], (err, supplierResult) => {
                            if (err) {
                                return connection.rollback(() => {
                                    console.error('Erro ao buscar fornecedores:', err);
                                    res.status(500).json({ error: 'Erro ao buscar fornecedores.' });
                                });
                            }

                            connection.commit((err) => {
                                if (err) {
                                    return connection.rollback(() => {
                                        console.error('Erro ao commitar transação:', err);
                                        res.status(500).json({ error: 'Erro ao commitar transação.' });
                                    });
                                }

                                res.json({
                                    produto: product,
                                    avaliacoes: reviewsResult,
                                    detalhesPedido: orderDetailsResult,
                                    categorias: categoryResult,
                                    fornecedores: supplierResult
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});


// Iniciar o servidor
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`Servidor está ouvindo na porta ${PORT}`);
});
