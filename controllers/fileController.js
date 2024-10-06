const path = require('path');
const { listarArquivos, servirArquivos } = require('../services');

exports.listUserFiles = (req, res) => {
  const directoryPath = path.join(__dirname, '..', `public/user/${req.params.id}`);
  const files = listarArquivos(directoryPath);
  res.json(files);
};

exports.listAssetsFiles = (req, res) => {
  const directoryPath = path.join(__dirname, '..', 'public/assets');
  const files = listarArquivos(directoryPath);
  res.json(files);
};

exports.listSeriesFiles = (req, res) => {
  const directoryPath = path.join(__dirname, '..', `public/series/${req.params.id}`);
  const files = listarArquivos(directoryPath);
  res.json(files);
};

exports.listSeriesAssetsFiles = (req, res) => {
  const directoryPath = path.join(__dirname, '..', `public/series/${req.params.id}/assets`);
  const files = listarArquivos(directoryPath);
  res.json(files);
};

exports.serveImage = (req, res) => {
  const directoryPath = path.join(__dirname, '..', 'public/image');
  servirArquivos(directoryPath, req, res);
};

exports.serveUserFile = (req, res) => {
  const directoryPath = path.join(__dirname, '..', `public/user/${req.params.id}`);
  servirArquivos(directoryPath, req, res);
};

exports.serveAssetsFile = (req, res) => {
  const directoryPath = path.join(__dirname, '..', 'public/assets');
  servirArquivos(directoryPath, req, res);
};

exports.serveSeriesFile = (req, res) => {
  const directoryPath = path.join(__dirname, '..', `public/series/${req.params.id}`);
  servirArquivos(directoryPath, req, res);
};

exports.serveSeriesAssetsFile = (req, res) => {
  const directoryPath = path.join(__dirname, '..', `public/series/${req.params.id}/assets`);
  servirArquivos(directoryPath, req, res);
};

exports.serveChapterFile = (req, res) => {
  const directoryPath = path.join(
    __dirname,
    '..',
    `public/series/${req.params.id}/chapters/${req.params.cap}`
  );
  servirArquivos(directoryPath, req, res);
};
