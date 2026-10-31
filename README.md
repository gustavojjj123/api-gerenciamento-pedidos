
# API de Gerenciamento de Pedidos

Projeto desenvolvido para a atividade prática de API REST. A aplicação permite cadastrar, listar, consultar e atualizar o status de pedidos de uma pequena loja.

## Tecnologias

- Node.js
- Express
- JavaScript
- Jest e Supertest
- Postman

Os dados ficam armazenados em memória. Por isso, os pedidos são apagados quando o servidor é reiniciado.

## Como executar

É necessário ter o Node.js instalado.

```bash
npm install
npm start
```

A API ficará disponível em `http://localhost:3000`.

Para executar os testes:

```bash
npm test
```

Para executar em modo de desenvolvimento:

```bash
npm run dev
```

## Organização do projeto

```text
src/
  app.js
  server.js
  controllers/
    pedidoController.js
  middlewares/
    errorHandler.js
  repositories/
    pedidoRepository.js
  routes/
    pedidoRoutes.js
  services/
    pedidoService.js
  utils/
    AppError.js
tests/
  pedidos.test.js
postman/
  Gerenciamento-de-Pedidos.postman_collection.json
evidencias/
```

- **Routes:** define os caminhos da API e direciona as requisições.
- **Controllers:** recebe a requisição e devolve a resposta HTTP.
- **Services:** contém as regras de negócio e as validações.
- **Repositories:** controla o armazenamento em memória.
- **Middlewares:** trata os erros que chegam à aplicação.

## Endpoints

| Método | Rota | Resultado |
|---|---|---|
| POST | `/pedidos` | Cadastra um pedido (201) |
| GET | `/pedidos` | Lista os pedidos (200) |
| GET | `/pedidos/:id` | Consulta um pedido (200 ou 404) |
| PATCH | `/pedidos/:id/status` | Atualiza o status (200, 400 ou 404) |

### Exemplo de cadastro

`POST http://localhost:3000/pedidos`

```json
{
  "cliente": "Carlos Silva",
  "tipo": "entrega",
  "valor": 350,
  "prioridade": "normal"
}
```

Resposta esperada: HTTP 201.

```json
{
  "id": 1,
  "cliente": "Carlos Silva",
  "tipo": "entrega",
  "valor": 350,
  "prioridade": "normal",
  "status": "recebido"
}
```

### Atualização de status

`PATCH http://localhost:3000/pedidos/1/status`

```json
{
  "status": "em_preparacao"
}
```

## Valores aceitos e regras

- **Tipo:** `entrega` ou `retirada`.
- **Prioridade:** `baixa`, `normal` ou `alta`.
- **Status:** `recebido`, `em_preparacao`, `enviado`, `entregue` ou `cancelado`.

Transições permitidas:

| Status atual | Próximos status permitidos |
|---|---|
| recebido | em_preparacao, cancelado |
| em_preparacao | enviado, cancelado |
| enviado | entregue |
| entregue | nenhum |
| cancelado | nenhum |

O cliente é obrigatório e não pode conter apenas espaços. O valor precisa ser numérico e maior que zero. Tipos, prioridades e status fora das opções documentadas são rejeitados.

## Tratamento de erros

- **400:** dados inválidos ou mudança de status não permitida.
- **404:** pedido ou rota não encontrado.
- **500:** erro inesperado no servidor.

As respostas de erro são enviadas em JSON, com a propriedade `mensagem`.

## Testes

Os testes automatizados usam Jest e Supertest. Eles verificam cadastro válido, validações, listagem, consulta, atualização de status, transição inválida e identificador inexistente.

Execute `npm test` para rodar os testes.

## Postman

Importe o arquivo `postman/Gerenciamento-de-Pedidos.postman_collection.json` no Postman. Execute as requisições com o servidor ligado.

## Evidências para entrega

Salve capturas reais do Postman na pasta `evidencias/`, mostrando método, URL, corpo quando aplicável, resposta e código HTTP:

1. `01-criacao.png` — POST válido com resposta 201.
2. `02-validacao.png` — POST inválido com resposta 400.
3. `03-listagem.png` — GET da lista com resposta 200.
4. `04-consulta-inexistente.png` — GET de ID inexistente com resposta 404.
5. `05-atualizacao.png` — PATCH válido com resposta 200.

As imagens devem ser capturadas após executar as requisições de verdade. Não são incluídas capturas simuladas.

## Git e GitHub

Depois de conferir os arquivos e executar os testes, crie o repositório no GitHub e faça commits reais durante o desenvolvimento. Uma sequência possível:

1. `chore: iniciar estrutura do projeto`
2. `feat: criar rotas e cadastro de pedidos`
3. `feat: adicionar consulta e atualização de status`
4. `test: adicionar testes automatizados`
5. `docs: documentar API e coleção do Postman`

Não envie a pasta `node_modules` para o GitHub.
