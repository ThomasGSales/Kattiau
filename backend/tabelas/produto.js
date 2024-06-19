const express = require("express");
const router = express.Router();
const banco = require("../banco");

// Selecionar todos os Produtos ou selecionar especifico
//
const getListaProduto = (req, res) => {
  if (req.query.ID_Produto) {
    banco.conn.query(
      "SELECT * FROM Produto where ID_Produto = ?",
      [req.query.ID_Produto],
      function (err, results, fields) {
        res.status(200).json(results);
      }
    );
  } else {
    banco.conn.query("SELECT * FROM Produto", function (err, results, fields) {
      res.status(200).json(results);
    });
  }
};

// Cadastro de Produto
const postCadastrarProduto = (req, res) => {
  const { Nome, Preco } = req.body;

  const query = "INSERT INTO Produto (Nome, Preco) VALUES (?, ?)";
  banco.conn.query(query, [Nome, Preco], (err, results) => {
    if (err) {
      res.status(500).json({ error: "Erro ao cadastrar Produto." });
      return;
    }

    res.status(200).json({
      message: "Produto cadastrado com sucesso.",
      results: results,
    });
  });
};

// Atualizar um registro de Produto
const putAtualizarProduto = (req, res, next) => {
  const { ID_Produto, Nome, Preco } = req.body;

  const query = "UPDATE Produto SET Nome = ?, Preco = ? WHERE ID_Produto = ?";
  banco.conn.query(query, [Nome, Preco, ID_Produto], (err, results) => {
    if (err) {
      console.log(err);
      res
        .status(500)
        .json({ error: "Erro ao atualizar o registro do Produto." });
      return;
    }

    res
      .status(200)
      .json({ message: "Registro do Produto atualizado com sucesso." });
  });
};

// Deletar um registro de Produto
const deleteDeletarProduto = (req, res) => {
  const ID_Produto = req.params.ProdutoID;

  const query = "DELETE FROM Produto WHERE ID_Produto = ?";
  banco.conn.query(query, [ID_Produto], (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: "Erro ao deletar o registro do Produto." });
      return;
    }

    res
      .status(200)
      .json({ message: "Registro do Produto deletado com sucesso." });
  });
};

router.get("/getListaProduto", getListaProduto);
router.post("/postCadastrarProduto", postCadastrarProduto);
router.put("/putAtualizarProduto", putAtualizarProduto);
router.delete("/deleteDeletarProduto/:ProdutoID", deleteDeletarProduto);

module.exports = router;
