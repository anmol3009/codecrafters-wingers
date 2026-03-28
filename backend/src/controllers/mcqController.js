const { getCourseRaw, getAllCourses } = require('../services/courseService');
const { recordMCQResult, resetProgressFromSection, getCourseProgress, getEnrolledCourses } = require('../services/progressService');
const { traceRootCause, findSectionForConcept } = require('../services/conceptService');
const { diagnoseError } = require('../services/diagnosisService');
const { generateDynamicMCQ } = require('../services/mcqGeneratorService');
const { db } = require('../config/firebase');

/**
 * GET /mcq/generate/:courseId/:sectionId
 * Generates an LLM-based MCQ for the specific section.
 */
async function generateMCQ(req, res, next) {
  try {
    const { courseId, sectionId } = req.params;
    const course = getCourseRaw(courseId);
    if (!course) return res.status(404).json({ error: 'Course not found' });

    const section = course.syllabus.find(s => s.id === sectionId);
    if (!section) return res.status(404).json({ error: 'Section not found' });

    const mcq = await generateDynamicMCQ({
      courseTitle: course.title,
      sectionTitle: section.title,
      conceptTag: section.conceptTag || 'General Knowledge'
    });

    if (!mcq) {
      // Fallback to static if AI fails
      return res.status(500).json({ error: 'Failed to generate AI question' });
    }

    res.json({ mcq });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /mcq/submit
 */
async function submitMCQ(req, res, next) {
  try {
    const { courseId, sectionId, questionId, selectedAnswer } = req.body;
    const uid = req.user.uid;

    // ── Validation ──────────────────────────────────────────────────────────
    if (!courseId || !sectionId || !questionId || selectedAnswer === undefined) {
      return res.status(400).json({
        error: 'courseId, sectionId, questionId, and selectedAnswer are required',
      });
    }

    // ── Fetch course ─────────────────────────────────────────────────────────
    const course = getCourseRaw(courseId);
    if (!course) return res.status(404).json({ error: 'Course not found' });

    // ── Verify enrollment ────────────────────────────────────────────────────
    const enrolled = await getEnrolledCourses(uid);
    if (!enrolled.includes(courseId)) {
      return res.status(403).json({ error: 'Not enrolled in this course' });
    }

    // ── Find section ──────────────────────────────────────────────
    const section = course.syllabus.find((s) => s.id === sectionId);
    if (!section) return res.status(404).json({ error: 'Section not found' });

    // Verify video was watched (MCQ gate)
    const progress = await getCourseProgress(uid, courseId);
    const videoWatched = progress.videoWatched || [];
    if (!videoWatched.includes(sectionId)) {
      return res.status(403).json({
        error: 'Video not yet completed for this section. Watch the video first.',
      });
    }

    // ── Handle Dynamic vs Static Question ──────────────────────────────────
    let question;
    let isCorrect;
    const isDynamic = questionId === 'ai-generated';

    if (isDynamic) {
      if (!req.body.dynamicQuestion) {
        return res.status(400).json({ error: 'dynamicQuestion payload required for AI submission' });
      }
      question = req.body.dynamicQuestion;
      isCorrect = Number(selectedAnswer) === question.correctAnswer;
    } else {
      question = section.mcqs.find((q) => q.id === questionId);
      if (!question) return res.status(404).json({ error: 'Question not found' });
      isCorrect = Number(selectedAnswer) === question.correctAnswer;
    }

    const conceptTag = question.conceptTag || section.conceptTag;

    // Persist result
    await recordMCQResult(uid, courseId, sectionId, conceptTag, isCorrect);

    // ── CORRECT ──────────────────────────────────────────────────────────────
    if (isCorrect) {
      const currentIdx = course.syllabus.findIndex((s) => s.id === sectionId);
      const nextSection = course.syllabus[currentIdx + 1] ?? null;

      return res.json({
        success: true,
        correct: true,
        correctIndex: question.correctAnswer,
        explanation: question.explanation,
        nextSectionId: nextSection ? nextSection.id : null,
        message: 'Correct! You have successfully completed this lesson challenge.',
      });
    }

    // ── INCORRECT ─────────────────────────────────────────────────────────────
    let { rootCause, path } = traceRootCause(conceptTag);
    let aiExplanation = null;
    let detailedExplanation = null;
    let recommendations = [];

    // Call LLM for deep cognitive diagnosis
    try {
      const allCourses = getAllCourses().map(c => ({ id: c.id, title: c.title }));
      
      const aiResult = await diagnoseError({
        question,
        correctAnswer: question.correctAnswer,
        selectedAnswer,
        approachText: req.body.explanationText || '',
        conceptTag,
        availableCourses: allCourses
      });

      if (aiResult && aiResult.rootCause) {
        rootCause = aiResult.rootCause;
        aiExplanation = aiResult.explanation;
        detailedExplanation = aiResult.detailedExplanation;
        
        if (aiResult.suggestedRevisePath) {
          path = aiResult.suggestedRevisePath;
        }

        if (aiResult.recommendedCourseIds) {
          recommendations = aiResult.recommendedCourseIds.map(rid => {
            const c = allCourses.find(course => course.id === rid);
            return {
              id: rid,
              title: c ? c.title : rid,
              isEnrolled: enrolled.includes(rid)
            };
          });
        }
      }
    } catch (aiErr) {
      console.warn('[AI Diagnosis] Skipped – using static tracing:', aiErr.message);
    }

    // Logic to find restart point
    const allSectionIds = course.syllabus.map((s) => s.id);
    let restartFromSectionId = findSectionForConcept(course, rootCause);
    if (!restartFromSectionId) restartFromSectionId = allSectionIds[0];

    // Reset progress
    await resetProgressFromSection(uid, courseId, restartFromSectionId, allSectionIds);

    // ─── Update Teacher Insights ───────────────────────────────────────
    try {
      const topicName = conceptTag;
      const topicKey = topicName.replace(/\s+/g, '_').toLowerCase();
      const DEFAULT_TEACHER_ID = process.env.DEFAULT_TEACHER_ID || 'default-teacher';

      const topicRef = db
        .collection('teacherInsights')
        .doc(DEFAULT_TEACHER_ID)
        .collection('topicWrongCounts')
        .doc(topicKey);

      const topicDoc = await topicRef.get();
      if (!topicDoc.exists) {
        await topicRef.set({
          topicName,
          courseId,
          courseTitle: course.title || courseId,
          totalWrongAnswers: 1,
          lastUpdated: new Date(),
        });
      } else {
        await topicRef.update({
          totalWrongAnswers: (topicDoc.data().totalWrongAnswers || 0) + 1,
          lastUpdated: new Date(),
        });
      }
    } catch (topicErr) {
      console.error('Topic wrong count update failed:', topicErr.message);
    }

    return res.json({
      success: false,
      correct: false,
      correctIndex: question.correctAnswer,
      explanation: aiExplanation || question.explanation,
      detailedExplanation,
      recommendations,
      conceptTag,
      rootCause,
      path,
      restartFromSectionId,
      message: `We've diagnosed a gap in your "${rootCause}" knowledge based on your thinking process.`,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /mcq/mock
 */
function getMockTest(req, res, next) {
  try {
    const courses = require('../data/courses.js');
    let pool = [];
    for (const c of courses) {
      for (const section of c.syllabus) {
        if (section.mcqs) {
          pool.push(...section.mcqs);
        }
      }
    }

    pool = pool.map(({ correctAnswer, ...q }) => ({
      ...q,
      correctIndex: correctAnswer
    }));

    const shuffled = pool.sort(() => Math.random() - 0.5).slice(0, 30);
    res.json({ questions: shuffled });
  } catch (err) {
    next(err);
  }
}

module.exports = { submitMCQ, getMockTest, generateMCQ };

