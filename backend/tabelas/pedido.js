const express = require("express");
const router = express.Router();
const banco = require("../banco");

// Selecionar todos os Pedidos ou selecionar especifico
//
const getListaPedido = (req, res) => {
  if (req.query.ID_Pedido) {
    banco.conn.query(
      "SELECT * FROM Pedido where ID_Pedido = ?",
      [req.query.ID_Pedido],
      function (err, results, fields) {
        res.status(200).json(results);
      }
    );
  } else {
    banco.conn.query("SELECT * FROM Pedido", function (err, results, fields) {
      res.status(200).json(results);
    });
  }
};

// Cadastro de Pedido
const postCadastrarPedido = (req, res) => {
  const { DataPedido, ID_Cliente } = req.body;

  const query = "INSERT INTO Pedido (DataPedido, ID_Cliente) VALUES (?, ?)";
  banco.conn.query(query, [DataPedido, ID_Cliente], (err, results) => {
    if (err) {
      res.status(500).json({ error: "Erro ao cadastrar Pedido." });
      return;
    }

    res.status(200).json({
      message: "Pedido cadastrado com sucesso.",
      results: results,
    });
  });
};

// Atualizar um registro de Pedido
const putAtualizarPedido = (req, res, next) => {
  const { ID_Pedido, DataPedido, ID_Cliente } = req.body;

  const query =
    "UPDATE Pedido SET DataPedido = ?, ID_Cliente = ? WHERE ID_Pedido = ?";
  banco.conn.query(
    query,
    [DataPedido, ID_Cliente, ID_Pedido],
    (err, results) => {
      if (err) {
        console.log(err);
        res
          .status(500)
          .json({ error: "Erro ao atualizar o registro do Pedido." });
        return;
      }

      res
        .status(200)
        .json({ message: "Registro do Pedido atualizado com sucesso." });
    }
  );
};

// Deletar um registro de Pedido
const deleteDeletarPedido = (req, res) => {
  const ID_Pedido = req.params.PedidoID;

  const query = "DELETE FROM Pedido WHERE ID_Pedido = ?";
  banco.conn.query(query, [ID_Pedido], (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: "Erro ao deletar o registro do Pedido." });
      return;
    }

    res
      .status(200)
      .json({ message: "Registro do Pedido deletado com sucesso." });
  });
};

router.get("/getListaPedido", getListaPedido);
router.post("/postCadastrarPedido", postCadastrarPedido);
router.put("/putAtualizarPedido", putAtualizarPedido);
router.delete("/deleteDeletarPedido/:PedidoID", deleteDeletarPedido);

module.exports = router;
