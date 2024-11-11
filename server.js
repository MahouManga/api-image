// server.js
const app = require('./app');
const PORT = process.env.API_PORT || 4001;

app.listen(PORT, () => {
  console.log(process.env.ACCESS_TOKEN)
  console.log(`Servidor rodando na porta ${PORT}`);
});