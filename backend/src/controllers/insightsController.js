const { getMathInsights } = require('../services/insightsService');

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

module.exports = { mathInsights };
