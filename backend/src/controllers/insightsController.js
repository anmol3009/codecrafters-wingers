const { getMathInsights } = require('../services/insightsService');
const { db } = require('../config/firebase');

/**
 * GET /teacher-insights/math
 *
 * Returns dynamic analytics for all Math courses.
 * Protected: only accessible with a valid auth token.
 */
async function mathInsights(req, res, next) {
  try {
    const insights = await getMathInsights();
    res.json({ insights });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /teacher-insights/topic-wrong-counts
 *
 * Returns wrong answer counts per topic, sorted descending.
 */
async function getTopicWrongCounts(req, res, next) {
  try {
    const teacherId = process.env.DEFAULT_TEACHER_ID || 'default-teacher';

    const snapshot = await db
      .collection('teacherInsights')
      .doc(teacherId)
      .collection('topicWrongCounts')
      .orderBy('totalWrongAnswers', 'desc')
      .get();

    if (snapshot.empty) {
      return res.json([]);
    }

    const counts = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      lastUpdated: doc.data().lastUpdated?.toDate?.() || null,
    }));

    res.json(counts);
  } catch (err) {
    console.error('Topic wrong counts fetch error:', err);
    res.status(500).json({ error: err.message });
  }
}

module.exports = { mathInsights, getTopicWrongCounts };
