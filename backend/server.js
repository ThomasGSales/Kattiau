const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const router = express.Router();

const app = express();

// Middleware para permitir solicitações de diferentes origens (CORS)
app.use(cors());
app.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// Middleware para análise de corpo de solicitação
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const avaliacao = require("./tabelas/avaliacao");
app.use("/", avaliacao);

const categoria = require("./tabelas/categoria");
app.use("/", categoria);

const cliente = require("./tabelas/cliente");
app.use("/", cliente);

const detalhespedido = require("./tabelas/detalhespedido");
app.use("/", detalhespedido);

const endereco = require("./tabelas/endereco");
app.use("/", endereco);

const fornecedor = require("./tabelas/fornecedor");
app.use("/", fornecedor);

const pagamento = require("./tabelas/pagamento");
app.use("/", pagamento);

const pedido = require("./tabelas/pedido");
app.use("/", pedido);

const produto = require("./tabelas/produto");
app.use("/", produto);

const produtocategoria = require("./tabelas/produtocategoria");
app.use("/", produtocategoria);

const produtofornecedor = require("./tabelas/produtofornecedor");
app.use("/", produtofornecedor);

// Iniciar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor está ouvindo na porta ${PORT}`);
});
