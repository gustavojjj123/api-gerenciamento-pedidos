
const pedidoRepository = require('../repositories/pedidoRepository');
const AppError = require('../utils/AppError');

const TIPOS = ['entrega', 'retirada'];
const PRIORIDADES = ['baixa', 'normal', 'alta'];
const STATUS = ['recebido', 'em_preparacao', 'enviado', 'entregue', 'cancelado'];

const TRANSICOES = {
  recebido: ['em_preparacao', 'cancelado'],
  em_preparacao: ['enviado', 'cancelado'],
  enviado: ['entregue'],
  entregue: [],
  cancelado: []
};

function criar(dados) {
  if (!dados || typeof dados !== 'object' || Array.isArray(dados)) {
    throw new AppError('O corpo da requisição deve ser um objeto JSON.', 400);
  }

  const cliente = typeof dados.cliente === 'string' ? dados.cliente.trim() : '';
  if (!cliente) {
    throw new AppError('O campo cliente é obrigatório.', 400);
  }

  if (typeof dados.valor !== 'number' || !Number.isFinite(dados.valor) || dados.valor <= 0) {
    throw new AppError('O valor deve ser numérico e maior que zero.', 400);
  }

  if (!TIPOS.includes(dados.tipo)) {
    throw new AppError(`Tipo inválido. Utilize: ${TIPOS.join(', ')}.`, 400);
  }

  if (!PRIORIDADES.includes(dados.prioridade)) {
    throw new AppError(`Prioridade inválida. Utilize: ${PRIORIDADES.join(', ')}.`, 400);
  }

  return pedidoRepository.criar({
    cliente,
    tipo: dados.tipo,
    valor: dados.valor,
    prioridade: dados.prioridade,
    status: 'recebido'
  });
}

function listar() {
  return pedidoRepository.listar();
}

function buscarPorId(id) {
  const pedido = pedidoRepository.buscarPorId(id);
  if (!pedido) {
    throw new AppError('Pedido não encontrado.', 404);
  }
  return pedido;
}

function atualizarStatus(id, dados) {
  const pedido = buscarPorId(id);

  if (!dados || typeof dados !== 'object' || Array.isArray(dados)) {
    throw new AppError('O corpo da requisição deve ser um objeto JSON.', 400);
  }

  if (typeof dados.status !== 'string' || !STATUS.includes(dados.status)) {
    throw new AppError(`Status inválido. Utilize: ${STATUS.join(', ')}.`, 400);
  }

  if (!TRANSICOES[pedido.status].includes(dados.status)) {
    throw new AppError(`Não é permitido alterar de "${pedido.status}" para "${dados.status}".`, 400);
  }

  return pedidoRepository.atualizarStatus(id, dados.status);
}

module.exports = { criar, listar, buscarPorId, atualizarStatus };
