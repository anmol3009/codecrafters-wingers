const router = require('express').Router();
const { mathInsights, getTopicWrongCounts } = require('../controllers/insightsController');
const authMiddleware = require('../middleware/authMiddleware');

// GET /teacher-insights/math
router.get('/math', mathInsights);

// GET /teacher-insights/topic-wrong-counts
router.get('/topic-wrong-counts', authMiddleware, getTopicWrongCounts);

module.exports = router;
