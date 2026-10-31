
const request = require('supertest');
const app = require('../src/app');
const pedidoRepository = require('../src/repositories/pedidoRepository');

describe('API de gerenciamento de pedidos', () => {
  beforeEach(() => {
    pedidoRepository.limpar();
  });

  const pedidoValido = {
    cliente: 'Carlos Silva',
    tipo: 'entrega',
    valor: 350,
    prioridade: 'normal'
  };

  test('POST /pedidos deve cadastrar um pedido e retornar 201', async () => {
    const resposta = await request(app).post('/pedidos').send(pedidoValido);

    expect(resposta.status).toBe(201);
    expect(resposta.body).toMatchObject({
      id: 1,
      cliente: 'Carlos Silva',
      tipo: 'entrega',
      valor: 350,
      prioridade: 'normal',
      status: 'recebido'
    });
  });

  test('POST /pedidos deve rejeitar cliente vazio', async () => {
    const resposta = await request(app)
      .post('/pedidos')
      .send({ ...pedidoValido, cliente: '   ' });

    expect(resposta.status).toBe(400);
    expect(resposta.body).toHaveProperty('mensagem');
  });

  test('POST /pedidos deve rejeitar valor menor ou igual a zero', async () => {
    const resposta = await request(app)
      .post('/pedidos')
      .send({ ...pedidoValido, valor: 0 });

    expect(resposta.status).toBe(400);
  });

  test('POST deve rejeitar tipo de pedido inválido', async () => {
  const resposta = await request(app)
    .post('/pedidos')
    .send({ ...pedidoValido, tipo: 'delivery' });

  expect(resposta.status).toBe(400);
});

test('POST deve rejeitar prioridade inválida', async () => {
  const resposta = await request(app)
    .post('/pedidos')
    .send({ ...pedidoValido, prioridade: 'urgente' });

  expect(resposta.status).toBe(400);
});

test('POST deve rejeitar valor enviado como texto', async () => {
  const resposta = await request(app)
    .post('/pedidos')
    .send({ ...pedidoValido, valor: '350' });

  expect(resposta.status).toBe(400);
});

  test('GET /pedidos deve listar os pedidos cadastrados', async () => {
    await request(app).post('/pedidos').send(pedidoValido);

    const resposta = await request(app).get('/pedidos');

    expect(resposta.status).toBe(200);
    expect(resposta.body).toHaveLength(1);
  });

  test('GET /pedidos/:id deve retornar 404 quando o pedido não existir', async () => {
    const resposta = await request(app).get('/pedidos/999');

    expect(resposta.status).toBe(404);
    expect(resposta.body).toHaveProperty('mensagem');
  });

  test('GET /pedidos/:id deve consultar um pedido existente', async () => {
    await request(app).post('/pedidos').send(pedidoValido);

    const resposta = await request(app).get('/pedidos/1');

    expect(resposta.status).toBe(200);
    expect(resposta.body.id).toBe(1);
  });

  test('PATCH deve atualizar o status seguindo uma transição permitida', async () => {
    await request(app).post('/pedidos').send(pedidoValido);

    const resposta = await request(app)
      .patch('/pedidos/1/status')
      .send({ status: 'em_preparacao' });

    expect(resposta.status).toBe(200);
    expect(resposta.body.status).toBe('em_preparacao');
  });

  test('PATCH deve rejeitar uma transição de status não permitida', async () => {
    await request(app).post('/pedidos').send(pedidoValido);

    const resposta = await request(app)
      .patch('/pedidos/1/status')
      .send({ status: 'entregue' });

    expect(resposta.status).toBe(400);
  });

  test('PATCH deve retornar 404 para um identificador inexistente', async () => {
    const resposta = await request(app)
      .patch('/pedidos/999/status')
      .send({ status: 'cancelado' });

    expect(resposta.status).toBe(404);
  });
});
