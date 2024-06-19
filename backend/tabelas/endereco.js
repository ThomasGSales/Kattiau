const express = require("express");
const router = express.Router();
const banco = require("../banco");

// Selecionar todos os Enderecos ou selecionar especifico
//
const getListaEndereco = (req, res) => {
  if (req.query.ID_Endereco) {
    banco.conn.query(
      "SELECT * FROM Endereco where ID_Endereco = ?",
      [req.query.ID_Endereco],
      function (err, results, fields) {
        res.status(200).json(results);
      }
    );
  } else {
    banco.conn.query("SELECT * FROM Endereco", function (err, results, fields) {
      res.status(200).json(results);
    });
  }
};

// Cadastro de Endereco
const postCadastrarEndereco = (req, res) => {
  const { Rua, Cidade, ID_Cliente } = req.body;

  const query =
    "INSERT INTO Endereco (Rua, Cidade, ID_Cliente) VALUES (?, ?, ?)";
  banco.conn.query(query, [Rua, Cidade, ID_Cliente], (err, results) => {
    if (err) {
      res.status(500).json({ error: "Erro ao cadastrar Endereco." });
      return;
    }

    res.status(200).json({
      message: "Endereco cadastrado com sucesso.",
      results: results,
    });
  });
};

// Atualizar um registro de Endereco
const putAtualizarEndereco = (req, res, next) => {
  const { ID_Endereco, Rua, Cidade, ID_Cliente } = req.body;

  const query =
    "UPDATE Endereco SET Rua = ?, Cidade =?, ID_Cliente = ? WHERE ID_Endereco = ?";
  banco.conn.query(
    query,
    [Rua, Cidade, ID_Cliente, ID_Endereco],
    (err, results) => {
      if (err) {
        console.log(err);
        res
          .status(500)
          .json({ error: "Erro ao atualizar o registro do Endereco." });
        return;
      }

      res
        .status(200)
        .json({ message: "Registro do Endereco atualizado com sucesso." });
    }
  );
};

// Deletar um registro de Endereco
const deleteDeletarEndereco = (req, res) => {
  const ID_Endereco = req.params.EnderecoID;

  const query = "DELETE FROM Endereco WHERE ID_Endereco = ?";
  banco.conn.query(query, [ID_Endereco], (err, results) => {
    if (err) {
      console.log(err);
      res
        .status(500)
        .json({ error: "Erro ao deletar o registro do Endereco." });
      return;
    }

    res
      .status(200)
      .json({ message: "Registro do Endereco deletado com sucesso." });
  });
};

router.get("/getListaEndereco", getListaEndereco);
router.post("/postCadastrarEndereco", postCadastrarEndereco);
router.put("/putAtualizarEndereco", putAtualizarEndereco);
router.delete("/deleteDeletarEndereco/:EnderecoID", deleteDeletarEndereco);

module.exports = router;
