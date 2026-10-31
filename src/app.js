
const express = require('express');
const pedidoRoutes = require('./routes/pedidoRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(express.json());
app.use('/pedidos', pedidoRoutes);

app.use((req, res) => {
  res.status(404).json({ mensagem: 'Rota não encontrada.' });
});

app.use(errorHandler);

module.exports = app;
