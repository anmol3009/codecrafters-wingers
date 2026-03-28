const { db } = require('../config/firebase');
const courses = require('../data/courses');

const USERS_COL = 'users';

/**
 * Compute dynamic teacher insights across ALL courses.
 *
 * Scans Firestore user documents and aggregates:
 *   - totalStudents, completionRate, avgScore, activeUsersToday
 *   - weakConcepts (sorted desc by failure count)
 *   - enrollmentTrend (monthly enrollment counts)
 *   - completionBreakdown (completed / in-progress / not-started)
 *   - studentOverview (per-student row data for the table)
 */
async function getMathInsights() {
  const snap = await db.collection(USERS_COL).get();
  const users = snap.docs.map((d) => ({ uid: d.id, ...d.data() }));

  // Filter to users enrolled in at least one course
  const enrolledStudents = users.filter((u) => {
    const enrolled = u.enrolledCourses || [];
    return enrolled.length > 0;
  });

  const totalStudents = enrolledStudents.length;

  if (totalStudents === 0) {
    return {
      totalStudents: 0,
      completionRate: 0,
      avgScore: 0,
      activeUsersToday: 0,
      weakConcepts: [],
      enrollmentTrend: [],
      completionBreakdown: [
        { name: 'Completed', value: 0 },
        { name: 'In Progress', value: 0 },
        { name: 'Not Started', value: 100 },
      ],
      studentOverview: [],
    };
  }

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  let studentsWithProgress = 0;
  let studentsCompleted = 0;
  let activeToday = 0;
  let totalCorrect = 0;
  let totalAttempts = 0;
  const conceptFailCounts = {};
  const monthlyEnrollments = {};
  const studentRows = [];

  for (const u of enrolledStudents) {
    const progress = u.progress || {};
    const enrolled = u.enrolledCourses || [];
    let hasAnyProgress = false;
    let allCoursesComplete = true;
    let userCorrect = 0;
    let userAttempts = 0;
    const userWeakAreas = [];

    // Track enrollment date for trend
    if (u.enrolledAt) {
      const d = new Date(u.enrolledAt);
      const key = d.toLocaleString('default', { month: 'short' });
      monthlyEnrollments[key] = (monthlyEnrollments[key] || 0) + 1;
    }

    for (const courseId of enrolled) {
      const cp = progress[courseId];
      const courseMeta = courses.find((c) => c.id === courseId);
      if (!courseMeta) continue;

      const completed = cp?.completedSections || [];
      if (completed.length > 0) hasAnyProgress = true;
      if (completed.length < courseMeta.syllabus.length) allCoursesComplete = false;

      // MCQ status aggregation
      const mcqStatus = cp?.mcqStatus || {};
      for (const status of Object.values(mcqStatus)) {
        totalAttempts++;
        userAttempts++;
        if (status === 'correct') { totalCorrect++; userCorrect++; }
      }

      // Incorrect concept counts
      const ic = cp?.incorrectConcepts || {};
      for (const [concept, count] of Object.entries(ic)) {
        conceptFailCounts[concept] = (conceptFailCounts[concept] || 0) + count;
        if (!userWeakAreas.includes(concept)) userWeakAreas.push(concept);
      }

      // Active today
      if (cp?.lastUpdated) {
        const lastUpdated = new Date(cp.lastUpdated);
        if (lastUpdated >= todayStart) activeToday++;
      }
    }

    if (hasAnyProgress) studentsWithProgress++;
    if (allCoursesComplete && hasAnyProgress) studentsCompleted++;

    // Build student row for table
    const primaryCourseId = enrolled[0];
    const primaryCourse = courses.find((c) => c.id === primaryCourseId);
    const primaryProgress = progress[primaryCourseId];
    const completedCount = primaryProgress?.completedSections?.length || 0;
    const totalSections = primaryCourse?.syllabus?.length || 1;

    studentRows.push({
      name: u.displayName || u.email || u.uid.slice(0, 8),
      course: primaryCourse?.title || primaryCourseId,
      progress: Math.round((completedCount / totalSections) * 100),
      score: userAttempts > 0 ? Math.round((userCorrect / userAttempts) * 100) : 0,
      weakAreas: userWeakAreas.slice(0, 3),
    });
  }

  const completionRate =
    totalStudents > 0
      ? Math.round((studentsWithProgress / totalStudents) * 100)
      : 0;

  const avgScore =
    totalAttempts > 0
      ? Math.round((totalCorrect / totalAttempts) * 100)
      : 0;

  // Sort weak concepts descending by failure count
  const weakConcepts = Object.entries(conceptFailCounts)
    .map(([concept, count]) => ({ concept, count }))
    .sort((a, b) => b.count - a.count);

  // Enrollment trend (monthly)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const enrollmentTrend = months
    .filter((m) => monthlyEnrollments[m])
    .map((month) => ({ month, enrollments: monthlyEnrollments[month] || 0 }));

  // Completion breakdown
  const notStarted = totalStudents - studentsWithProgress;
  const inProgress = studentsWithProgress - studentsCompleted;
  const completionBreakdown = [
    { name: 'Completed', value: totalStudents > 0 ? Math.round((studentsCompleted / totalStudents) * 100) : 0 },
    { name: 'In Progress', value: totalStudents > 0 ? Math.round((inProgress / totalStudents) * 100) : 0 },
    { name: 'Not Started', value: totalStudents > 0 ? Math.round((notStarted / totalStudents) * 100) : 0 },
  ];

  return {
    totalStudents,
    completionRate,
    avgScore,
    activeUsersToday: activeToday,
    weakConcepts,
    enrollmentTrend,
    completionBreakdown,
    studentOverview: studentRows,
  };
}

module.exports = { getMathInsights };
