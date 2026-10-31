
const pedidoService = require('../services/pedidoService');

function criar(req, res, next) {
  try {
    const pedido = pedidoService.criar(req.body);
    return res.status(201).json(pedido);
  } catch (erro) {
    return next(erro);
  }
}

function listar(req, res, next) {
  try {
    return res.status(200).json(pedidoService.listar());
  } catch (erro) {
    return next(erro);
  }
}

function buscarPorId(req, res, next) {
  try {
    const pedido = pedidoService.buscarPorId(req.params.id);
    return res.status(200).json(pedido);
  } catch (erro) {
    return next(erro);
  }
}

function atualizarStatus(req, res, next) {
  try {
    const pedido = pedidoService.atualizarStatus(req.params.id, req.body);
    return res.status(200).json(pedido);
  } catch (erro) {
    return next(erro);
  }
}

module.exports = { criar, listar, buscarPorId, atualizarStatus };
