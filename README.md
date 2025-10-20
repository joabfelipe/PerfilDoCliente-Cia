# Aplicação — Formulário Perfil (MongoDB/Oracle)

Este backend Express fornece captura de formulários de visitantes, histórico, painel em tempo real e administração de usuários, com alternância de banco via `DB_ADAPTER` entre MongoDB (Mongoose) e Oracle (Sequelize).

## Visão Geral
- Alternância de banco sem alterar controladores (`DB_ADAPTER=mongoose|sequelize`).
- Camada de repositório (`db/`) abstrai operações de dados para `users` e `forms`.
- Sessões mantidas em MongoDB (`connect-mongo`).
- Emissão de eventos Socket (`novo_formulario`) para painel em tempo real.

## Arquitetura
- **Server**: `server.js` inicializa conexão conforme adaptador e registra rotas.
- **Adapter**: `config/dbAdapter.js` expõe `isMongoose` e `isSequelize`.
- **Conexões**:
  - `config/db.js`: Mongoose (MongoDB).
  - `config/dbOracle.js`: Sequelize (Oracle) via variáveis `.env`.
- **Modelos**:
  - Mongoose: `models/userModel.js`, `models/formModel.js`.
  - Sequelize: `models/sequelize/userModel.js`, `models/sequelize/formModel.js`.
- **Repositórios**: `db/users.js`, `db/forms.js` (normalizam outputs, ex.: `_id`).
- **Controladores**: usam repositórios (`require('../db')`) para CRUD.
- **Sessão**: `express-session` com `connect-mongo` e `MONGO_URI`.
- **Socket**: `config/socket.js` injeta `io` em `req`.

## Variáveis de Ambiente
```
PORT=3000
MONGO_URI=<sua-uri-mongodb>
SESSION_SECRET=<seu-segredo-de-sessao>
DB_ADAPTER=mongoose   # ou: sequelize
ORACLE_USER=<usuario>
ORACLE_PASSWORD=<senha>
ORACLE_HOST=oracle_host
ORACLE_CONNECT_STRING=localhost:1521/XEPDB1
```

- `DB_ADAPTER=mongoose`: usa MongoDB/Mongoose.
- `DB_ADAPTER=sequelize`: usa Oracle/Sequelize.
- Sessões permanecem em MongoDB (ver notas abaixo).

Para detalhes, consulte `docs/DB_ADAPTER.md`.

## Pré-requisitos Oracle (Sequelize)
- Instale dependências do Oracle:
  - `npm install sequelize oracledb`
  - Dialeto Oracle: se necessário, instale o pacote do dialeto (ex.: `sequelize-oracle`).
- Configure `ORACLE_USER`, `ORACLE_PASSWORD`, `ORACLE_CONNECT_STRING` no `.env`.
- Garanta acesso ao servidor Oracle (ex.: `localhost:1521/XEPDB1`).

> Observação: O dialeto Oracle em Sequelize é mantido por terceiros. Verifique compatibilidade da versão do driver `oracledb` com seu ambiente.

## Estrutura de Pastas
- `config/` — Conexões e adapter (`db.js`, `dbOracle.js`, `dbAdapter.js`, `socket.js`).
- `controllers/` — Lógica de rotas e renderização.
- `db/` — Repositórios unificados de dados (`index.js`, `users.js`, `forms.js`).
- `models/` — Modelos Mongoose e Sequelize.
- `public/` — HTML/CSS/Assets e views EJS.
- `routes/` — Definições de rotas Express.

## Repositórios
- `db/users.js`
  - `find()` — lista usuários.
  - `findOneByEmail(email)` — busca por email.
  - `create({ email, senha, perfil })` — cria usuário (hash de senha via hooks/middlewares).
  - `deleteById(id)` — exclui por ID.
  - Normaliza saída: `{ _id, email, perfil, senha, validarSenha(...) }`.
- `db/forms.js`
  - `findSortedByDateDesc()` — lista formulários ordenados por `data_horario_visita` (desc).
  - `getById(id)` — obtém formulário por ID.
  - `updateById(id, updates)` — atualiza campos.
  - `create(dados)` — cria formulário.
  - Normaliza saída com `_id` e campos compatíveis.

## Modelos
- `models/userModel.js` (Mongoose) — `email`, `senha`, `perfil` com `validarSenha` e `pre('save')` para hash.
- `models/formModel.js` (Mongoose) — campos do formulário; arrays (`horario`, `importancia`, `motivacao`).
- `models/sequelize/userModel.js` — hooks `beforeCreate/Update` para hash; método `validarSenha`.
- `models/sequelize/formModel.js` — uso de `TEXT` com getters/setters JSON para arrays.

## Controladores
- `authController.js` — login/logout usando `db.users`.
- `formController.js` — render da página e criação com `db.forms.create`; emite `novo_formulario`.
- `historicoController.js` — lista/detalhe/atualiza com `db.forms`; HTML preservado.
- `adminController.js` — lista/cria/exclui com `db.users`.
- `indexController.js`, `painelController.js` — renderização de páginas.

## Rotas
- `GET /auth/login` — página de login.
- `POST /auth/login` — autenticação.
- `GET /auth/logout` — destrói sessão.
- `GET /formulario` — exibe formulário HTML (protegida).
- `POST /submit` — submissão de formulário (protegida).
- `GET /historico` — lista formulários (protegida).
- `GET /historico/:id` — detalhe (protegida).
- `POST /historico/:id` — atualização de observações (protegida).
- `POST /co/:id` — atualização em fluxo “consultora” (protegida).
- `GET /api/historico` — lista em JSON (pública ou conforme middleware).
- `GET /admin` — painel de usuários (protegida: gestor/suporte).
- `POST /admin` — cria usuário (protegida).
- `POST /admin/delete` — exclui usuário (protegida).
- `GET /painel` — painel em tempo real (protegida: gestor/vendedora/suporte).
- `GET /index` — tela inicial (protegida: gestor/vendedora/recepcao/suporte).

## Sessões
- `express-session` + `connect-mongo` usando `MONGO_URI`.
- Mesmo com `DB_ADAPTER=sequelize`, as sessões continuam em MongoDB.
- Caso deseje migrar sessões, considere `connect-session-sequelize`.

## Eventos Socket
- Emissão: `req.io.emit('novo_formulario', dadosForm)` ao criar um formulário.
- Consumo: `painelController.js` escuta `novo_formulario` e apresenta notificações, com áudio e histórico.

## Execução
1. Configure `.env` (veja seção de Variáveis de Ambiente).
2. Instale dependências:
   - `npm install`
   - Para Oracle: `npm install sequelize oracledb` (+ dialeto Oracle se necessário)
3. Inicie: `npm start` ou `node server.js`.
4. Acesse: `http://localhost:3000/`.

## Alternar Banco (Passo a Passo)
- MongoDB:
  - Defina `DB_ADAPTER=mongoose`.
  - Garanta `MONGO_URI` válido.
- Oracle:
  - Defina `DB_ADAPTER=sequelize`.
  - Configure `ORACLE_*` no `.env`.
  - Instale dependências do Oracle.

## Arquivos Criados/Alterados (Resumo)
- **Criados**: `config/dbAdapter.js`, `config/dbOracle.js`, `models/sequelize/userModel.js`, `models/sequelize/formModel.js`, `db/users.js`, `db/forms.js`, `db/index.js`, `docs/DB_ADAPTER.md`.
- **Alterados**: `controllers/adminController.js`, `controllers/historicoController.js`, `controllers/authController.js`, `controllers/formController.js`, `server.js`, `.env`.

## Notas e Limitações
- Oracle via Sequelize depende de dialeto externo; valide versões e compatibilidade.
- Campos de arrays em Oracle são persistidos como JSON serializado (getters/setters convertem automaticamente).
- As views e respostas HTML foram preservadas, garantindo comportamento idêntico.

## Próximos Passos
- Adicionar testes automatizados para repositórios e controladores.
- Opcional: migrar sessões para Sequelize (`connect-session-sequelize`).
- Opcional: adicionar `sequelize.sync()` ou gerenciador de migrações (ex.: `umzug`) para schema Oracle.