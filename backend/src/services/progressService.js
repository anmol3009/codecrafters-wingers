const { db } = require('../config/firebase');

const USERS_COL = 'users';

/* ─────────────────────────────────────────
   Helpers
───────────────────────────────────────── */

function userRef(uid) {
  return db.collection(USERS_COL).doc(uid);
}

/* ─────────────────────────────────────────
   Enrollment
───────────────────────────────────────── */

/**
 * Enroll a user in a course (idempotent).
 * Simulates payment success — always succeeds.
 */
async function enrollCourse(uid, courseId) {
  const ref = userRef(uid);
  const snap = await ref.get();

  if (!snap.exists) {
    throw Object.assign(new Error('User not found'), { status: 404 });
  }

  const data = snap.data();

  if (data.enrolledCourses && data.enrolledCourses.includes(courseId)) {
    return { alreadyEnrolled: true };
  }

  await ref.update({
    enrolledCourses: [...(data.enrolledCourses || []), courseId],
  });

  return { alreadyEnrolled: false };
}

/**
 * Return all courses a user is enrolled in.
 */
async function getEnrolledCourses(uid) {
  const snap = await userRef(uid).get();
  if (!snap.exists) return [];
  return snap.data().enrolledCourses || [];
}

/* ─────────────────────────────────────────
   Progress helpers
───────────────────────────────────────── */

/**
 * Fetch the progress sub-document for a specific course.
 */
async function getCourseProgress(uid, courseId) {
  const snap = await userRef(uid).get();
  if (!snap.exists) return null;
  const progress = snap.data().progress || {};
  return (
    progress[courseId] || {
      currentSection: null,
      completedSections: [],
      mcqStatus: {},
      incorrectConcepts: {},
    }
  );
}

/**
 * Mark a section as ready for MCQ (video watched).
 * Stores that the video was completed so the MCQ gate can open.
 */
async function markVideoComplete(uid, courseId, sectionId) {
  const snap = await userRef(uid).get();
  if (!snap.exists) throw Object.assign(new Error('User not found'), { status: 404 });

  const progress = snap.data().progress || {};
  const cp = progress[courseId] || {
    currentSection: null,
    completedSections: [],
    mcqStatus: {},
    incorrectConcepts: {},
    videoWatched: [],
  };

  const videoWatched = cp.videoWatched || [];
  if (!videoWatched.includes(sectionId)) {
    videoWatched.push(sectionId);
  }

  await userRef(uid).update({
    [`progress.${courseId}`]: { ...cp, currentSection: sectionId, videoWatched },
  });

  return { sectionId, videoComplete: true, mcqUnlocked: true };
}

/**
 * Record an MCQ result (correct or incorrect) and update section / concept tracking.
 *
 * Returns the updated course progress object.
 */
async function recordMCQResult(uid, courseId, sectionId, conceptTag, isCorrect) {
  const snap = await userRef(uid).get();
  if (!snap.exists) throw Object.assign(new Error('User not found'), { status: 404 });

  const progress = snap.data().progress || {};
  const cp = progress[courseId] || {
    currentSection: sectionId,
    completedSections: [],
    mcqStatus: {},
    incorrectConcepts: {},
    videoWatched: [],
  };

  // Update MCQ status for this section
  cp.mcqStatus[sectionId] = isCorrect ? 'correct' : 'incorrect';

  if (isCorrect) {
    // Mark section complete and remove from incorrectConcepts if previously wrong
    if (!cp.completedSections.includes(sectionId)) {
      cp.completedSections.push(sectionId);
    }
    // Clean up incorrect concept tracking if recovered
    delete cp.incorrectConcepts[conceptTag];
  } else {
    // Increment failure count for the concept
    cp.incorrectConcepts[conceptTag] = (cp.incorrectConcepts[conceptTag] || 0) + 1;
  }

  await userRef(uid).update({ [`progress.${courseId}`]: cp });
  return cp;
}

/**
 * Reset a student's progress for a course from a given section onwards.
 * Used by the concept-based retry system.
 */
async function resetProgressFromSection(uid, courseId, fromSectionId, allSectionIds) {
  const snap = await userRef(uid).get();
  if (!snap.exists) throw Object.assign(new Error('User not found'), { status: 404 });

  const progress = snap.data().progress || {};
  const cp = progress[courseId] || {
    currentSection: fromSectionId,
    completedSections: [],
    mcqStatus: {},
    incorrectConcepts: {},
    videoWatched: [],
  };

  // Find the index of the restart section and remove all completed sections from that point
  const cutIdx = allSectionIds.indexOf(fromSectionId);
  if (cutIdx !== -1) {
    cp.completedSections = cp.completedSections.filter((sid) => {
      return allSectionIds.indexOf(sid) < cutIdx;
    });
    // Also clear videoWatched from that point
    cp.videoWatched = (cp.videoWatched || []).filter((sid) => {
      return allSectionIds.indexOf(sid) < cutIdx;
    });
  }

  cp.currentSection = fromSectionId;

  await userRef(uid).update({ [`progress.${courseId}`]: cp });
  return cp;
}

module.exports = {
  enrollCourse,
  getEnrolledCourses,
  getCourseProgress,
  markVideoComplete,
  recordMCQResult,
  resetProgressFromSection,
};
