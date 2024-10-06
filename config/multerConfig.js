const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { possibleExtensions, criarDiretoriosRecursivamente } = require('../utils');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let pastaBase = path.join(__dirname, '..', 'public/temp');
    criarDiretoriosRecursivamente(pastaBase);
    cb(null, pastaBase);
  },
  filename: function (req, file, cb) {
    const nome = req.body.name || file.originalname;
    cb(null, nome);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const fileExt = path.extname(file.originalname).toLowerCase();
    if (!possibleExtensions.includes(fileExt)) {
      return cb(new Error('Tipo de arquivo não permitido'), false);
    }
    cb(null, true);
  },
});

module.exports = upload;