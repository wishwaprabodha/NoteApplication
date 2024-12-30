const express = require('express');
const { healthCheck } = require('../controllers/helathController');

const router = express.Router();

router.get('/health', healthCheck);

module.exports = router;