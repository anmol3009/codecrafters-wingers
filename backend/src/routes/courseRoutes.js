const router = require('express').Router();
const { listCourses, getCourse } = require('../controllers/courseController');

// Public — no auth required to browse courses
router.get('/', listCourses);
router.get('/:id', getCourse);

module.exports = router;
