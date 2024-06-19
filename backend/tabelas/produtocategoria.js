const express = require("express");
const router = express.Router();
const banco = require("../banco");

// Selecionar todos os Produtocategorias ou selecionar especifico
//
const getListaProdutocategoria = (req, res) => {
  if (req.query.ID_Categoria && req.query.ID_Produto) {
    banco.conn.query(
      "SELECT * FROM Produtocategoria where ID_Categoria = ? and ID_Produto = ?",
      [req.query.ID_Categoria, req.query.ID_Produto],
      function (err, results, fields) {
        res.status(200).json(results);
      }
    );
  } else {
    banco.conn.query(
      "SELECT * FROM Produtocategoria",
      function (err, results, fields) {
        res.status(200).json(results);
      }
    );
  }
};

// Cadastro de Produtocategoria
const postCadastrarProdutocategoria = (req, res) => {
  const { ID_Categoria, ID_Produto } = req.body;

  const query =
    "INSERT INTO Produtocategoria (ID_Categoria, ID_Produto) VALUES (?, ?)";
  banco.conn.query(query, [ID_Categoria, ID_Produto], (err, results) => {
    if (err) {
      res.status(500).json({ error: "Erro ao cadastrar Produtocategoria." });
      return;
    }

    res.status(200).json({
      message: "Produtocategoria cadastrado com sucesso.",
      results: results,
    });
  });
};

// Atualizar um registro de Produtocategoria
const putAtualizarProdutocategoria = (req, res, next) => {
  const { ID_Categoria, ID_Produto, Novo_Produto, Novo_Categoria } = req.body;

  const query =
    "UPDATE Produtocategoria SET ID_Categoria = ?, ID_Produto = ? WHERE ID_Categoria = ? and ID_Produto = ?";
  banco.conn.query(
    query,
    [Novo_Categoria, Novo_Produto, ID_Categoria, ID_Produto],
    (err, results) => {
      if (err) {
        console.log(err);
        res
          .status(500)
          .json({ error: "Erro ao atualizar o registro do Produtocategoria." });
        return;
      }

      res.status(200).json({
        message: "Registro do Produtocategoria atualizado com sucesso.",
      });
    }
  );
};

// Deletar um registro de Produtocategoria
const deleteDeletarProdutocategoria = (req, res) => {
  const ID_Categoria = req.params.ID_Categoria;
  const ID_Produto = req.params.ID_Produto;

  const query =
    "DELETE FROM Produtocategoria WHERE ID_Categoria = ? and ID_Produto = ?";
  banco.conn.query(query, [ID_Categoria, ID_Produto], (err, results) => {
    if (err) {
      console.log(err);
      res
        .status(500)
        .json({ error: "Erro ao deletar o registro do Produtocategoria." });
      return;
    }

    res
      .status(200)
      .json({ message: "Registro do Produtocategoria deletado com sucesso." });
  });
};

router.get("/getListaProdutocategoria", getListaProdutocategoria);
router.post("/postCadastrarProdutocategoria", postCadastrarProdutocategoria);
router.put("/putAtualizarProdutocategoria", putAtualizarProdutocategoria);
router.delete(
  "/deleteDeletarProdutocategoria/:ID_Categoria/:ID_Produto",
  deleteDeletarProdutocategoria
);

module.exports = router;
