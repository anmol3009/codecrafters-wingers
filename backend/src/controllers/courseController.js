const { getAllCourses, getCourseById } = require('../services/courseService');

/**
 * GET /courses
 * GET /courses?subject=Mathematics&level=Beginner
 */
function listCourses(req, res) {
  const { subject, level } = req.query;
  const courses = getAllCourses({ subject, level });
  res.json({ courses });
}

/**
 * GET /courses/:id
 */
function getCourse(req, res) {
  const course = getCourseById(req.params.id);
  if (!course) {
    return res.status(404).json({ error: 'Course not found' });
  }
  res.json({ course });
}

module.exports = { listCourses, getCourse };
