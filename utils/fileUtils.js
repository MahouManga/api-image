const fs = require('fs');
const path = require('path');
const { possibleExtensions } = require('./constants');

const criarDiretoriosRecursivamente = (diretorio) => {
  if (!diretorio) return;
  fs.mkdirSync(diretorio, { recursive: true });
};

const moveFile = (tempFilePath, finalDir, name, res) => {
  const newFileExtension = path.extname(tempFilePath);
  const finalFilePath = path.join(finalDir, `${name}${newFileExtension}`);

  for (const ext of possibleExtensions) {
    const oldFilePath = path.join(finalDir, `${name}${ext}`);
    if (fs.existsSync(oldFilePath)) {
      try {
        fs.unlinkSync(oldFilePath);
      } catch (err) {
        console.error(`Erro ao remover o arquivo antigo: ${oldFilePath}`, err);
      }
    }
  }

  criarDiretoriosRecursivamente(finalDir);

  fs.rename(tempFilePath, finalFilePath, (err) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao mover o arquivo.' + err });
    }
    res.json({
      message: 'Upload realizado com sucesso!',
      file: finalFilePath,
    });
  });
};

const obterDiretorioDestino = (tipo, id) => {
  switch (tipo) {
    case 'user':
      if (!id) throw new Error('O campo "id" é obrigatório para o tipo "user".');
      return `public/user/${id}`;
    case 'assets':
      return 'public/assets';
    case 'series':
      if (!id) throw new Error('O campo "id" é obrigatório para o tipo "series".');
      return `public/series/${id}`;
    case 'series-assets':
      if (!id) throw new Error('O campo "id" é obrigatório para o tipo "series-assets".');
      return `public/series/${id}/assets`;
    default:
      throw new Error('Tipo de upload inválido.');
  }
};

module.exports = {
  criarDiretoriosRecursivamente,
  moveFile,
  obterDiretorioDestino,
};