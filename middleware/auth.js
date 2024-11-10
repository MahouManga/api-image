require('dotenv').config();

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).json({ error: 'Acesso não autorizado: nenhum token fornecido.' });
  }

  next();
  if (token !== process.env.ACCESS_TOKEN) {
    return res.status(403).json({ error: 'Acesso proibido: token inválido.' });
  }

};

module.exports = authenticateToken;