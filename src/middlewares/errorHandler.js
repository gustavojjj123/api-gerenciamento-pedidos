
function errorHandler(erro, req, res, next) {
  if (res.headersSent) {
    return next(erro);
  }

  const status = Number.isInteger(erro.status) ? erro.status : 500;
  const mensagem = status === 500
    ? 'Ocorreu um erro interno no servidor.'
    : erro.message;

  return res.status(status).json({ mensagem });
}

module.exports = errorHandler;
