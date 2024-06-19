const express = require("express");
const router = express.Router();
const banco = require("../banco");

// Selecionar todos os Fornecedors ou selecionar especifico
//
const getListaFornecedor = (req, res) => {
  if (req.query.ID_Fornecedor) {
    banco.conn.query(
      "SELECT * FROM Fornecedor where ID_Fornecedor = ?",
      [req.query.ID_Fornecedor],
      function (err, results, fields) {
        res.status(200).json(results);
      }
    );
  } else {
    banco.conn.query(
      "SELECT * FROM Fornecedor",
      function (err, results, fields) {
        res.status(200).json(results);
      }
    );
  }
};

// Cadastro de Fornecedor
const postCadastrarFornecedor = (req, res) => {
  const { Nome, Email } = req.body;

  const query = "INSERT INTO Fornecedor (Nome, Email) VALUES (?, ?)";
  banco.conn.query(query, [Nome, Email], (err, results) => {
    if (err) {
      res.status(500).json({ error: "Erro ao cadastrar Fornecedor." });
      return;
    }

    res.status(200).json({
      message: "Fornecedor cadastrado com sucesso.",
      results: results,
    });
  });
};

// Atualizar um registro de Fornecedor
const putAtualizarFornecedor = (req, res, next) => {
  const { ID_Fornecedor, Nome, Email } = req.body;

  const query =
    "UPDATE Fornecedor SET Nome = ?, Email = ? WHERE ID_Fornecedor = ?";
  banco.conn.query(query, [Nome, Email, ID_Fornecedor], (err, results) => {
    if (err) {
      console.log(err);
      res
        .status(500)
        .json({ error: "Erro ao atualizar o registro do Fornecedor." });
      return;
    }

    res
      .status(200)
      .json({ message: "Registro do Fornecedor atualizado com sucesso." });
  });
};

// Deletar um registro de Fornecedor
const deleteDeletarFornecedor = (req, res) => {
  const ID_Fornecedor = req.params.FornecedorID;

  const query = "DELETE FROM Fornecedor WHERE ID_Fornecedor = ?";
  banco.conn.query(query, [ID_Fornecedor], (err, results) => {
    if (err) {
      console.log(err);
      res
        .status(500)
        .json({ error: "Erro ao deletar o registro do Fornecedor." });
      return;
    }

    res
      .status(200)
      .json({ message: "Registro do Fornecedor deletado com sucesso." });
  });
};

router.get("/getListaFornecedor", getListaFornecedor);
router.post("/postCadastrarFornecedor", postCadastrarFornecedor);
router.put("/putAtualizarFornecedor", putAtualizarFornecedor);
router.delete(
  "/deleteDeletarFornecedor/:FornecedorID",
  deleteDeletarFornecedor
);

module.exports = router;
