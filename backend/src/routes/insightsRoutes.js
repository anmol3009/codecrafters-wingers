const router = require('express').Router();
const { mathInsights } = require('../controllers/insightsController');
const authMiddleware = require('../middleware/authMiddleware');

// GET /teacher-insights/math
router.get('/math', mathInsights);

module.exports = router;
