const express = require("express");
const router = express.Router();
const banco = require("../banco");

// Selecionar todos os Detalhespedidos ou selecionar especifico
//
const getListaDetalhespedido = (req, res) => {
  if (req.query.ID_Pedido && req.query.ID_Produto) {
    banco.conn.query(
      "SELECT * FROM Detalhespedido where ID_Pedido = ? and ID_Produto = ?",
      [req.query.ID_Pedido, req.query.ID_Produto],
      function (err, results, fields) {
        res.status(200).json(results);
      }
    );
  } else {
    banco.conn.query(
      "SELECT * FROM Detalhespedido",
      function (err, results, fields) {
        res.status(200).json(results);
      }
    );
  }
};

// Cadastro de Detalhespedido
const postCadastrarDetalhespedido = (req, res) => {
  const { ID_Pedido, ID_Produto, Quantidade, PrecoUnitario } = req.body;

  const query =
    "INSERT INTO Detalhespedido (ID_Pedido, ID_Produto, Quantidade, PrecoUnitario) VALUES (?, ?, ?, ?)";
  banco.conn.query(
    query,
    [ID_Pedido, ID_Produto, Quantidade, PrecoUnitario],
    (err, results) => {
      if (err) {
        res.status(500).json({ error: "Erro ao cadastrar Detalhespedido." });
        return;
      }

      res.status(200).json({
        message: "Detalhespedido cadastrado com sucesso.",
        results: results,
      });
    }
  );
};

// Atualizar um registro de Detalhespedido
const putAtualizarDetalhespedido = (req, res, next) => {
  const {
    ID_Pedido,
    ID_Produto,
    Quantidade,
    PrecoUnitario,
    Novo_Pedido,
    Novo_Produto,
  } = req.body;

  const query =
    "UPDATE Detalhespedido SET ID_Pedido = ?, ID_Produto = ?, Quantidade = ?, PrecoUnitario = ? WHERE ID_Pedido = ? and ID_Produto = ?";
  banco.conn.query(
    query,
    [
      Novo_Pedido,
      Novo_Produto,
      Quantidade,
      PrecoUnitario,
      ID_Pedido,
      ID_Produto,
    ],
    (err, results) => {
      if (err) {
        console.log(err);
        res
          .status(500)
          .json({ error: "Erro ao atualizar o registro do Detalhespedido." });
        return;
      }

      res.status(200).json({
        message: "Registro do Detalhespedido atualizado com sucesso.",
      });
    }
  );
};

// Deletar um registro de Detalhespedido
const deleteDeletarDetalhespedido = (req, res) => {
  const ID_Pedido = req.params.ID_Pedido;
  const ID_Produto = req.params.ID_Produto;

  const query =
    "DELETE FROM Detalhespedido WHERE ID_Pedido = ? and ID_Produto = ?";
  banco.conn.query(query, [ID_Pedido, ID_Produto], (err, results) => {
    if (err) {
      console.log(err);
      res
        .status(500)
        .json({ error: "Erro ao deletar o registro do Detalhespedido." });
      return;
    }

    res
      .status(200)
      .json({ message: "Registro do Detalhespedido deletado com sucesso." });
  });
};

router.get("/getListaDetalhespedido", getListaDetalhespedido);
router.post("/postCadastrarDetalhespedido", postCadastrarDetalhespedido);
router.put("/putAtualizarDetalhespedido", putAtualizarDetalhespedido);
router.delete(
  "/deleteDeletarDetalhespedido/:ID_Pedido/:ID_Produto",
  deleteDeletarDetalhespedido
);

module.exports = router;
