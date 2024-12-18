require('dotenv').config();

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).json({ error: 'Acesso não autorizado: nenhum token fornecido.' });
  }

  if (token !== process.env.ACCESS_TOKEN) {
    console.log('enviado', token)
    console.log('token', process.env.ACCESS_TOKEN)
    return res.status(403).json({ error: 'Acesso proibido: token inválido.'});
  }
  next();

};

module.exports = authenticateToken;