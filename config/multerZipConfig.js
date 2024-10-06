const multer = require('multer');
const path = require('path');
const { criarDiretoriosRecursivamente } = require('../utils');

const zipStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const pastaBase = path.join(__dirname, '..', 'public/temp');
    criarDiretoriosRecursivamente(pastaBase);
    cb(null, pastaBase);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const uploadZip = multer({
  storage: zipStorage,
  fileFilter: (req, file, cb) => {
    if (path.extname(file.originalname).toLowerCase() !== '.zip') {
      return cb(new Error('Apenas arquivos ZIP são permitidos'), false);
    }
    cb(null, true);
  },
});

module.exports = uploadZip;