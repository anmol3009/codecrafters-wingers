const { enrollCourse, getEnrolledCourses } = require('../services/progressService');
const { getCourseById, getCourseRaw } = require('../services/courseService');

/**
 * POST /enroll/:courseId
 *
 * Simulates payment success → enrols the authenticated user.
 */
async function enroll(req, res, next) {
  try {
    const { courseId } = req.params;
    const uid = req.user.uid;

    // Validate course exists
    const course = getCourseById(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const result = await enrollCourse(uid, courseId);

    if (result.alreadyEnrolled) {
      return res.json({
        message: 'Already enrolled in this course',
        courseId,
        enrolled: true,
      });
    }

    res.status(201).json({
      message: `Successfully enrolled in "${course.title}"`,
      courseId,
      enrolled: true,
      paymentSimulated: true,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /my-courses
 *
 * Returns full course details for all courses the user is enrolled in.
 */
async function getMyCourses(req, res, next) {
  try {
    const uid = req.user.uid;
    const enrolledIds = await getEnrolledCourses(uid);

    const courses = enrolledIds
      .map((id) => getCourseById(id))
      .filter(Boolean); // drop any stale ids

    res.json({ courses });
  } catch (err) {
    next(err);
  }
}

module.exports = { enroll, getMyCourses };
