const express = require('express');
const { fileController } = require('../controllers');

const router = express.Router();

// Rotas para listar arquivos
router.get('/user/:id/files', fileController.listUserFiles);
router.get('/assets/files', fileController.listAssetsFiles);
router.get('/series/:id/files', fileController.listSeriesFiles);
router.get('/series/:id/assets/files', fileController.listSeriesAssetsFiles);

// Rotas para servir arquivos
router.get('/image/:name', fileController.serveImage);
router.get('/user/:id/:name', fileController.serveUserFile);
router.get('/assets/:name', fileController.serveAssetsFile);
router.get('/series/:id/:name', fileController.serveSeriesFile);
router.get('/series/:id/assets/:name', fileController.serveSeriesAssetsFile);
router.get('/series/:id/chapters/:cap/:name', fileController.serveChapterFile);

module.exports = router;