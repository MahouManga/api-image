// Substitua 'seu_token_de_acesso' pelo token definido no servidor
require('dotenv').config();
const accessToken = process.env.ACCESS_TOKEN || 'TEMPORARIO';

const form = document.getElementById('uploadForm');

form.addEventListener('submit', function (event) {
  event.preventDefault(); // Impede o envio padrão do formulário e a atualização da página

  const formData = new FormData(form);

  fetch('/upload', {
    method: 'POST',
    headers: {
      Authorization: accessToken,
    },
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('Sucesso:', data);
      alert('Upload realizado com sucesso!');
    })
    .catch((error) => {
      console.error('Erro:', error);
      alert('Ocorreu um erro ao fazer o upload.');
    });
});