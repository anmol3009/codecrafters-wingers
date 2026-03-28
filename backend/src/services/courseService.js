const courses = require('../data/courses');

/**
 * Return all courses, optionally filtered by subject and/or level.
 */
function getAllCourses({ subject, level } = {}) {
  let result = [...courses];

  if (subject) {
    result = result.filter(
      (c) => c.subject.toLowerCase() === subject.toLowerCase()
    );
  }
  if (level) {
    result = result.filter(
      (c) => c.level.toLowerCase() === level.toLowerCase()
    );
  }

  // Strip syllabus details from list view to keep payload small
  return result.map(({ syllabus: _s, ...meta }) => ({
    ...meta,
    sectionCount: _s.length,
  }));
}

/**
 * Return a single course with full syllabus.
 * MCQ answers are stripped so they are never exposed in the GET.
 */
function getCourseById(id) {
  const course = courses.find((c) => c.id === id);
  if (!course) return null;

  // Hide correctAnswer from the client — validated server-side
  const sanitized = {
    ...course,
    syllabus: course.syllabus.map((section) => ({
      ...section,
      mcqs: section.mcqs.map(({ correctAnswer: _ca, ...q }) => q),
    })),
  };

  return sanitized;
}

/**
 * Return the raw course (with answers) for internal use.
 */
function getCourseRaw(id) {
  return courses.find((c) => c.id === id) ?? null;
}

module.exports = { getAllCourses, getCourseById, getCourseRaw };
