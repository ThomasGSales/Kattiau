const express = require("express");
const router = express.Router();
const banco = require("../banco");

// Selecionar todos os Pagamentos ou selecionar especifico
//
const getListaPagamento = (req, res) => {
  if (req.query.ID_Pedido && req.query.ID_Pagamento) {
    banco.conn.query(
      "SELECT * FROM Pagamento where ID_Pedido = ? and ID_Pagamento = ?",
      [req.query.ID_Pedido, req.query.ID_Pagamento],
      function (err, results, fields) {
        res.status(200).json(results);
      }
    );
  } else {
    banco.conn.query(
      "SELECT * FROM Pagamento",
      function (err, results, fields) {
        res.status(200).json(results);
      }
    );
  }
};

// Cadastro de Pagamento
const postCadastrarPagamento = (req, res) => {
  const { ID_Pedido, ID_Pagamento, Metodo, Valor } = req.body;

  const query =
    "INSERT INTO Pagamento (ID_Pedido, ID_Pagamento, Metodo, Valor) VALUES (?, ?, ?, ?)";
  banco.conn.query(
    query,
    [ID_Pedido, ID_Pagamento, Metodo, Valor],
    (err, results) => {
      if (err) {
        res.status(500).json({ error: "Erro ao cadastrar Pagamento." });
        return;
      }

      res.status(200).json({
        message: "Pagamento cadastrado com sucesso.",
        results: results,
      });
    }
  );
};

// Atualizar um registro de Pagamento
const putAtualizarPagamento = (req, res, next) => {
  const { ID_Pedido, ID_Pagamento, Metodo, Valor } = req.body;

  const query =
    "UPDATE Pagamento SET ID_Pedido = ?, ID_Pagamento = ?, Metodo = ?, Valor = ? WHERE ID_Pedido = ? and ID_Pagamento = ?";
  banco.conn.query(
    query,
    [ID_Pedido, ID_Pagamento, Metodo, Valor, ID_Pedido, ID_Pagamento],
    (err, results) => {
      if (err) {
        console.log(err);
        res
          .status(500)
          .json({ error: "Erro ao atualizar o registro do Pagamento." });
        return;
      }

      res.status(200).json({
        message: "Registro do Pagamento atualizado com sucesso.",
      });
    }
  );
};

// Deletar um registro de Pagamento
const deleteDeletarPagamento = (req, res) => {
  const ID_Pedido = req.params.ID_Pedido;
  const ID_Pagamento = req.params.ID_Pagamento;

  const query =
    "DELETE FROM Pagamento WHERE ID_Pedido = ? and ID_Pagamento = ?";
  banco.conn.query(query, [ID_Pedido, ID_Pagamento], (err, results) => {
    if (err) {
      console.log(err);
      res
        .status(500)
        .json({ error: "Erro ao deletar o registro do Pagamento." });
      return;
    }

    res
      .status(200)
      .json({ message: "Registro do Pagamento deletado com sucesso." });
  });
};

router.get("/getListaPagamento", getListaPagamento);
router.post("/postCadastrarPagamento", postCadastrarPagamento);
router.put("/putAtualizarPagamento", putAtualizarPagamento);
router.delete(
  "/deleteDeletarPagamento/:ID_Pedido/:ID_Pagamento",
  deleteDeletarPagamento
);

module.exports = router;
