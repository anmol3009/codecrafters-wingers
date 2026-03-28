const router = require('express').Router();
const { submitMCQ, getMockTest } = require('../controllers/mcqController');
const authMiddleware = require('../middleware/authMiddleware');

// GET /mcq/mock
router.get('/mock', getMockTest);

// POST /mcq/submit
router.post('/submit', authMiddleware, submitMCQ);

module.exports = router;
