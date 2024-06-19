const express = require("express");
const router = express.Router();
const banco = require("../banco");

// Selecionar todos os Clientes ou selecionar especifico
//
const getListaCliente = (req, res) => {
  if (req.query.ID_Cliente) {
    banco.conn.query(
      "SELECT * FROM Cliente where ID_Cliente = ?",
      [req.query.ID_Cliente],
      function (err, results, fields) {
        res.status(200).json(results);
      }
    );
  } else {
    banco.conn.query("SELECT * FROM Cliente", function (err, results, fields) {
      res.status(200).json(results);
    });
  }
};

// Cadastro de Cliente
const postCadastrarCliente = (req, res) => {
  const { Nome, Email } = req.body;

  const query = "INSERT INTO Cliente (Nome, Email) VALUES (?, ?)";
  banco.conn.query(query, [Nome, Email], (err, results) => {
    if (err) {
      res.status(500).json({ error: "Erro ao cadastrar Cliente." });
      return;
    }

    res.status(200).json({
      message: "Cliente cadastrado com sucesso.",
      results: results,
    });
  });
};

// Atualizar um registro de Cliente
const putAtualizarCliente = (req, res, next) => {
  const { ID_Cliente, Nome, Email } = req.body;

  const query = "UPDATE Cliente SET Nome = ?, Email = ? WHERE ID_Cliente = ?";
  banco.conn.query(query, [Nome, Email, ID_Cliente], (err, results) => {
    if (err) {
      console.log(err);
      res
        .status(500)
        .json({ error: "Erro ao atualizar o registro do Cliente." });
      return;
    }

    res
      .status(200)
      .json({ message: "Registro do Cliente atualizado com sucesso." });
  });
};

// Deletar um registro de Cliente
const deleteDeletarCliente = (req, res) => {
  const ID_Cliente = req.params.ClienteID;

  const query = "DELETE FROM Cliente WHERE ID_Cliente = ?";
  banco.conn.query(query, [ID_Cliente], (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: "Erro ao deletar o registro do Cliente." });
      return;
    }

    res
      .status(200)
      .json({ message: "Registro do Cliente deletado com sucesso." });
  });
};

router.get("/getListaCliente", getListaCliente);
router.post("/postCadastrarCliente", postCadastrarCliente);
router.put("/putAtualizarCliente", putAtualizarCliente);
router.delete("/deleteDeletarCliente/:ClienteID", deleteDeletarCliente);

module.exports = router;
