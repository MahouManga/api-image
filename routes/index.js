const express = require('express');
const router = express.Router();

const uploadRoutes = require('./uploadRoutes');
const fileRoutes = require('./fileRoutes');

router.use('/', uploadRoutes);
router.use('/', fileRoutes);

module.exports = router;