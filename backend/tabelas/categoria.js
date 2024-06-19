const express = require("express");
const router = express.Router();
const banco = require("../banco");

// Selecionar todos os Categorias ou selecionar especifico
//
const getListaCategoria = (req, res) => {
  if (req.query.ID_Categoria) {
    banco.conn.query(
      "SELECT * FROM Categoria where ID_Categoria = ?",
      [req.query.ID_Categoria],
      function (err, results, fields) {
        res.status(200).json(results);
      }
    );
  } else {
    banco.conn.query(
      "SELECT * FROM Categoria",
      function (err, results, fields) {
        res.status(200).json(results);
      }
    );
  }
};

// Cadastro de Categoria
const postCadastrarCategoria = (req, res) => {
  const { Nome } = req.body;

  const query = "INSERT INTO Categoria (Nome) VALUES (?)";
  banco.conn.query(query, [Nome], (err, results) => {
    if (err) {
      res.status(500).json({ error: "Erro ao cadastrar Categoria." });
      return;
    }

    res.status(200).json({
      message: "Categoria cadastrado com sucesso.",
      results: results,
    });
  });
};

// Atualizar um registro de Categoria
const putAtualizarCategoria = (req, res, next) => {
  const { ID_Categoria, Nome } = req.body;

  const query = "UPDATE Categoria SET Nome = ? WHERE ID_Categoria = ?";
  banco.conn.query(query, [Nome, ID_Categoria], (err, results) => {
    if (err) {
      console.log(err);
      res
        .status(500)
        .json({ error: "Erro ao atualizar o registro do Categoria." });
      return;
    }

    res
      .status(200)
      .json({ message: "Registro do Categoria atualizado com sucesso." });
  });
};

// Deletar um registro de Categoria
const deleteDeletarCategoria = (req, res) => {
  const ID_Categoria = req.params.CategoriaID;

  const query = "DELETE FROM Categoria WHERE ID_Categoria = ?";
  banco.conn.query(query, [ID_Categoria], (err, results) => {
    if (err) {
      console.log(err);
      res
        .status(500)
        .json({ error: "Erro ao deletar o registro do Categoria." });
      return;
    }

    res
      .status(200)
      .json({ message: "Registro do Categoria deletado com sucesso." });
  });
};

router.get("/getListaCategoria", getListaCategoria);
router.post("/postCadastrarCategoria", postCadastrarCategoria);
router.put("/putAtualizarCategoria", putAtualizarCategoria);
router.delete("/deleteDeletarCategoria/:CategoriaID", deleteDeletarCategoria);

module.exports = router;
