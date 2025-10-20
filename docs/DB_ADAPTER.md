# Alternância de Banco por Adaptador

Defina `DB_ADAPTER` no `.env` para alternar o backend de dados sem quebrar controladores.

## Variáveis de ambiente

```
# Porta do servidor
PORT=3000

# Sessões (mantidas no MongoDB)
MONGO_URI=<sua-uri-mongodb>
SESSION_SECRET=<seu-segredo-de-sessao>

# Adaptador de banco
DB_ADAPTER=mongoose   # ou: sequelize

# Oracle (Sequelize)
ORACLE_USER=<usuario>
ORACLE_PASSWORD=<senha>
ORACLE_HOST=oracle_host
ORACLE_CONNECT_STRING=localhost:1521/XEPDB1
```

- `DB_ADAPTER=mongoose`: A aplicação usa Mongoose/MongoDB.
- `DB_ADAPTER=sequelize`: A aplicação usa Sequelize/Oracle.
- Sessões continuam em MongoDB (via `connect-mongo`). Se desejar migrar sessões, avalie `connect-session-sequelize`.

## Inicialização
- Com `mongoose`, a conexão é feita via `config/db.js`.
- Com `sequelize`, a conexão é feita via `config/dbOracle.js` e autenticada em `server.js`.

## Camada de Abstração
- Controladores usam repositórios em `db/` (`users`, `forms`) para manter comportamento idêntico em ambos os bancos.