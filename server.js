require('dotenv/config');
const path = require('path');
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const { isMongoose, isSequelize } = require('./config/dbAdapter');

// Inicializa conexão com DB conforme adaptador
if (isMongoose) {
  require('./config/db');
} else if (isSequelize) {
  const sequelize = require('./config/dbOracle');
  sequelize.authenticate()
    .then(() => console.log('Conectado ao Oracle via Sequelize'))
    .catch((err) => {
      console.error('Erro ao conectar ao Oracle:', err);
      process.exit(1);
    });
}

// Importa rotas
const authRoutes = require('./routes/authRoutes');
const formRoutes = require('./routes/formRoutes');
const historicoRoutes = require('./routes/historicoRoutes');
const painelRoutes = require('./routes/painelRoutes');
const adminRoutes = require('./routes/adminRoutes');

const proteger = require('./middleware/proteger');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const server = http.createServer(app);
const io = require('./config/socket')(server);

// Views e arquivos estáticos
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'public', 'views'));
app.use('/assets', express.static(path.join(__dirname, 'public', 'assets')));

// Middlewares globais
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI })
}));

app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  next();
});

// Injeta Socket.io no request
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Rotas
app.use('/auth', authRoutes);
app.use(formRoutes);
app.use(historicoRoutes);
app.use(painelRoutes);
app.use(adminRoutes);

// Redireciona raiz
app.get('/', proteger(['gestor', 'vendedora', 'recepcao', 'suporte']), (req, res) => {
  res.redirect('/index');
});

// Handler de erros no final da cadeia
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
