const express = require('express');
const { getConceptGraph } = require('../controllers/conceptController');

const router = express.Router();

router.get('/graph', getConceptGraph);

module.exports = router;
