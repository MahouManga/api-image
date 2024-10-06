// app.js
require('dotenv').config();
const express = require('express');
const path = require('path');
const helmet = require('helmet');
const compression = require('compression');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');

// Importar rotas
const routes = require('./routes');

// Importar middleware personalizado
const { errorHandler } = require('./middleware');

const app = express();

// Middleware global
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(morgan('combined'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Definir políticas de segurança
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  res.setHeader('Content-Security-Policy', "default-src 'self'; img-src 'self' data:;");
  next();
});

// Rotas
app.use('/', routes);

// Middleware de tratamento de erros
app.use(errorHandler);

module.exports = app;