const router = require('express').Router();
const { signup, login, googleAuth, getMe } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// All routes require a valid Firebase token (verified by authMiddleware)
router.post('/signup', authMiddleware, signup);
router.post('/login', authMiddleware, login);
router.post('/google', authMiddleware, googleAuth);
router.get('/me', authMiddleware, getMe);

module.exports = router;
