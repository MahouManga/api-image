const logger = require('../utils/logger');

module.exports = (err, req, res, next) => {
  if (err.status === 413) {
    logger.error('Payload muito grande:', err);
    return res.status(413).json({ error: 'Payload muito grande' });
  }
  if (err.isOperational) {
    res.status(err.statusCode).json({ error: err.message });
  } else {
    logger.error(err.stack);
    res.status(500).json({ error: 'Erro Interno do Servidor' });
  }
};