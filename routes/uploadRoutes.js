const express = require('express');
const { body } = require('express-validator');
const { uploadController } = require('../controllers');
const { multerConfig, multerZipConfig } = require('../config');
const { validateRequest } = require('../middleware');
const { authenticateToken } = require('../middleware');

const router = express.Router();

// Aplica o middleware 'authenticateToken' às rotas de upload
router.post(
  '/upload',
  authenticateToken,
  multerConfig.single('imagem'),
  body('name').notEmpty().withMessage('O campo "name" é obrigatório.'),
  body('type').notEmpty().withMessage('O campo "type" é obrigatório.'),
  validateRequest,
  uploadController.uploadImage
);

router.post(
  '/upload-zip',
  authenticateToken,
  multerZipConfig.single('zipFile'),
  uploadController.uploadZipFile
);

router.post('/analyze-pages', authenticateToken, uploadController.analyzePages);

router.delete('/remove', authenticateToken, uploadController.removeFile);

module.exports = router;