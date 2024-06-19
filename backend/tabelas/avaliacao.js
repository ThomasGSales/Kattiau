const express = require("express");
const router = express.Router();
const banco = require("../banco");

// Selecionar todos os Avaliacaos ou selecionar especifico
//
const getListaAvaliacao = (req, res) => {
  if (req.query.ID_Avaliacao) {
    banco.conn.query(
      "SELECT * FROM Avaliacao where ID_Avaliacao = ?",
      [req.query.ID_Avaliacao],
      function (err, results, fields) {
        res.status(200).json(results);
      }
    );
  } else {
    banco.conn.query(
      "SELECT * FROM Avaliacao",
      function (err, results, fields) {
        res.status(200).json(results);
      }
    );
  }
};

// Cadastro de Avaliacao
const postCadastrarAvaliacao = (req, res) => {
  const { Comentario, Avaliacao, ID_Produto, ID_Cliente } = req.body;

  const query =
    "INSERT INTO Avaliacao (Comentario, Avaliacao, ID_Produto, ID_Cliente) VALUES (?, ?, ?, ?)";
  banco.conn.query(
    query,
    [Comentario, Avaliacao, ID_Produto, ID_Cliente],
    (err, results) => {
      if (err) {
        res.status(500).json({ error: "Erro ao cadastrar Avaliacao." });
        return;
      }

      res.status(200).json({
        message: "Avaliacao cadastrado com sucesso.",
        results: results,
      });
    }
  );
};

// Atualizar um registro de Avaliacao
const putAtualizarAvaliacao = (req, res, next) => {
  const { ID_Avaliacao, Comentario, Avaliacao, ID_Produto, ID_Cliente } =
    req.body;

  const query =
    "UPDATE Avaliacao SET Comentario = ?, Avaliacao = ?, ID_Produto = ?, ID_Cliente = ? WHERE ID_Avaliacao = ?";
  banco.conn.query(
    query,
    [Comentario, Avaliacao, ID_Produto, ID_Cliente, ID_Avaliacao],
    (err, results) => {
      if (err) {
        console.log(err);
        res
          .status(500)
          .json({ error: "Erro ao atualizar o registro do Avaliacao." });
        return;
      }

      res
        .status(200)
        .json({ message: "Registro da Avaliacao atualizado com sucesso." });
    }
  );
};

// Deletar um registro de Avaliacao
const deleteDeletarAvaliacao = (req, res) => {
  const ID_Avaliacao = req.params.AvaliacaoID;

  const query = "DELETE FROM Avaliacao WHERE ID_Avaliacao = ?";
  banco.conn.query(query, [ID_Avaliacao], (err, results) => {
    if (err) {
      console.log(err);
      res
        .status(500)
        .json({ error: "Erro ao deletar o registro do Avaliacao." });
      return;
    }

    res
      .status(200)
      .json({ message: "Registro do Avaliacao deletado com sucesso." });
  });
};

router.get("/getListaAvaliacao", getListaAvaliacao);
router.post("/postCadastrarAvaliacao", postCadastrarAvaliacao);
router.put("/putAtualizarAvaliacao", putAtualizarAvaliacao);
router.delete("/deleteDeletarAvaliacao/:AvaliacaoID", deleteDeletarAvaliacao);

module.exports = router;
