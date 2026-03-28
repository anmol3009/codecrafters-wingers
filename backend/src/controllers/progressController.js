const { markVideoComplete, getCourseProgress } = require('../services/progressService');
const { getCourseRaw } = require('../services/courseService');
const { getEnrolledCourses } = require('../services/progressService');

/**
 * POST /progress/video-complete
 *
 * Body: { courseId, sectionId }
 *
 * Marks the section's video as watched and gates the MCQ as ready.
 */
async function videoComplete(req, res, next) {
  try {
    const { courseId, sectionId } = req.body;
    const uid = req.user.uid;

    if (!courseId || !sectionId) {
      return res.status(400).json({ error: 'courseId and sectionId are required' });
    }

    // Verify course exists
    const course = getCourseRaw(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Verify section exists in course
    const section = course.syllabus.find((s) => s.id === sectionId);
    if (!section) {
      return res.status(404).json({ error: 'Section not found in course' });
    }

    // Verify user is enrolled
    const enrolled = await getEnrolledCourses(uid);
    if (!enrolled.includes(courseId)) {
      return res.status(403).json({ error: 'Not enrolled in this course' });
    }

    const result = await markVideoComplete(uid, courseId, sectionId);

    res.json({
      success: true,
      message: 'Video marked as complete. MCQ is now unlocked.',
      ...result,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /progress/:courseId
 *
 * Returns the user's progress for a specific course.
 */
async function getProgress(req, res, next) {
  try {
    const { courseId } = req.params;
    const uid = req.user.uid;

    const progress = await getCourseProgress(uid, courseId);
    res.json({ courseId, progress });
  } catch (err) {
    next(err);
  }
}

module.exports = { videoComplete, getProgress };
