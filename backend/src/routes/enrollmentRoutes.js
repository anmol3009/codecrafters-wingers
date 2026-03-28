const router = require('express').Router();
const { enroll, getMyCourses } = require('../controllers/enrollmentController');
const authMiddleware = require('../middleware/authMiddleware');

// POST /enroll/:courseId
router.post('/:courseId', authMiddleware, enroll);

// GET /my-courses
// Registered separately in app.js but controllers live here
module.exports = router;
