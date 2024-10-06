const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const sizeOf = require('image-size');
const { validationResult } = require('express-validator');
const {
  criarDiretoriosRecursivamente,
  moveFile,
  obterDiretorioDestino,
  possibleExtensions,
} = require('../utils');
const { extractZip, analyzePages } = require('../services');

exports.uploadImage = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, type, id } = req.body;

  if (!req.file) {
    return res.status(400).json({ error: 'O campo "imagem" é obrigatório.' });
  }

  let finalDir;
  try {
    finalDir = path.join(__dirname, '..', obterDiretorioDestino(type, id));
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }

  const tempFilePath = path.join(__dirname, '..', 'public/temp', req.file.originalname);

  moveFile(tempFilePath, finalDir, name, res);
};

exports.uploadZipFile = async (req, res, next) => {
  const { serieID, index, volume } = req.body;

  if (!serieID || !index) {
    return res.status(400).json({ error: 'ID da obra e capítulo são obrigatórios.' });
  }

  if (!req.file) {
    return res.status(400).json({ error: 'Nenhum arquivo enviado.' });
  }

  const zipFilePath = path.join(__dirname, '..', 'public/temp', req.file.originalname);
  const extractionPath = path.join(
    __dirname,
    '..',
    `public/series/${serieID}/chapters/vol-${volume}-cap-${index}`
  );

  try {
    const extractedImages = await extractZip(zipFilePath, extractionPath);
    res.json({
      message: 'Arquivos extraídos e renomeados com sucesso!',
      images: extractedImages,
    });
  } catch (err) {
    next(err);
  }
};

exports.analyzePages = async (req, res, next) => {
  const { pages, index, serieID, volume } = req.body;
  const chapterDir = path.join(
    __dirname,
    '..',
    `public/series/${serieID}/chapters/vol-${volume}-cap-${index}`
  );

  try {
    const sortedPages = await analyzePages(pages, chapterDir);
    res.json({
      status: 200,
      pages: sortedPages,
    });
  } catch (err) {
    next(err);
  }
};

exports.removeFile = (req, res, next) => {
  const { name, type, id } = req.body;

  if (!type) {
    return res.status(400).json({ error: 'O campo "type" é obrigatório.' });
  }

  if (!name) {
    return res.status(400).json({ error: 'O campo "name" é obrigatório.' });
  }

  let finalDir;
  try {
    finalDir = path.join(__dirname, '..', obterDiretorioDestino(type, id));
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }

  let fileFound = false;

  for (const ext of possibleExtensions) {
    const filePath = path.join(finalDir, `${name}${ext}`);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      fileFound = true;
    }
  }

  if (!fileFound) {
    return res.status(404).json({ error: 'Arquivo não encontrado.' });
  }

  res.json({ message: 'Arquivo removido com sucesso.' });
};
