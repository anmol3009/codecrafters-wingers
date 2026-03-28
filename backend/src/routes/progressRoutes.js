const router = require('express').Router();
const { videoComplete, getProgress } = require('../controllers/progressController');
const authMiddleware = require('../middleware/authMiddleware');

// POST /progress/video-complete
router.post('/video-complete', authMiddleware, videoComplete);

// GET /progress/:courseId
router.get('/:courseId', authMiddleware, getProgress);

module.exports = router;
