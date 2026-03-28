const router = require('express').Router();
const { submitMCQ, getMockTest, generateMCQ } = require('../controllers/mcqController');
const authMiddleware = require('../middleware/authMiddleware');

// GET /mcq/mock
router.get('/mock', getMockTest);

// GET /mcq/generate/:courseId/:sectionId
router.get('/generate/:courseId/:sectionId', authMiddleware, generateMCQ);

// POST /mcq/submit
router.post('/submit', authMiddleware, submitMCQ);

module.exports = router;
