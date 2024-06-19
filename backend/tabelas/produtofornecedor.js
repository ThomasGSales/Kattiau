const express = require("express");
const router = express.Router();
const banco = require("../banco");

// Selecionar todos os Produtofornecedors ou selecionar especifico
//
const getListaProdutofornecedor = (req, res) => {
  if (req.query.ID_Fornecedor && req.query.ID_Produto) {
    banco.conn.query(
      "SELECT * FROM Produtofornecedor where ID_Fornecedor = ? and ID_Produto = ?",
      [req.query.ID_Fornecedor, req.query.ID_Produto],
      function (err, results, fields) {
        res.status(200).json(results);
      }
    );
  } else {
    banco.conn.query(
      "SELECT * FROM Produtofornecedor",
      function (err, results, fields) {
        res.status(200).json(results);
      }
    );
  }
};

// Cadastro de Produtofornecedor
const postCadastrarProdutofornecedor = (req, res) => {
  const { ID_Fornecedor, ID_Produto } = req.body;

  const query =
    "INSERT INTO Produtofornecedor (ID_Fornecedor, ID_Produto) VALUES (?, ?)";
  banco.conn.query(query, [ID_Fornecedor, ID_Produto], (err, results) => {
    if (err) {
      res.status(500).json({ error: "Erro ao cadastrar Produtofornecedor." });
      return;
    }

    res.status(200).json({
      message: "Produtofornecedor cadastrado com sucesso.",
      results: results,
    });
  });
};

// Atualizar um registro de Produtofornecedor
const putAtualizarProdutofornecedor = (req, res, next) => {
  const { ID_Fornecedor, ID_Produto, Novo_Produto, Novo_Fornecedor } = req.body;

  const query =
    "UPDATE Produtofornecedor SET ID_Fornecedor = ?, ID_Produto = ? WHERE ID_Fornecedor = ? and ID_Produto = ?";
  banco.conn.query(
    query,
    [Novo_Fornecedor, Novo_Produto, ID_Fornecedor, ID_Produto],
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).json({
          error: "Erro ao atualizar o registro do Produtofornecedor.",
        });
        return;
      }

      res.status(200).json({
        message: "Registro do Produtofornecedor atualizado com sucesso.",
      });
    }
  );
};

// Deletar um registro de Produtofornecedor
const deleteDeletarProdutofornecedor = (req, res) => {
  const ID_Fornecedor = req.params.ID_Fornecedor;
  const ID_Produto = req.params.ID_Produto;

  const query =
    "DELETE FROM Produtofornecedor WHERE ID_Fornecedor = ? and ID_Produto = ?";
  banco.conn.query(query, [ID_Fornecedor, ID_Produto], (err, results) => {
    if (err) {
      console.log(err);
      res
        .status(500)
        .json({ error: "Erro ao deletar o registro do Produtofornecedor." });
      return;
    }

    res
      .status(200)
      .json({ message: "Registro do Produtofornecedor deletado com sucesso." });
  });
};

router.get("/getListaProdutofornecedor", getListaProdutofornecedor);
router.post("/postCadastrarProdutofornecedor", postCadastrarProdutofornecedor);
router.put("/putAtualizarProdutofornecedor", putAtualizarProdutofornecedor);
router.delete(
  "/deleteDeletarProdutofornecedor/:ID_Fornecedor/:ID_Produto",
  deleteDeletarProdutofornecedor
);

module.exports = router;
