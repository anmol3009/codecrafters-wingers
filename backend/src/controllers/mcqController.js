const { getCourseRaw, getAllCourses } = require('../services/courseService');
const { recordMCQResult, resetProgressFromSection, getCourseProgress, getEnrolledCourses } = require('../services/progressService');
const { traceRootCause, findSectionForConcept } = require('../services/conceptService');
const { diagnoseError } = require('../services/diagnosisService');
const { db } = require('../config/firebase');

/**
 * POST /mcq/submit
 *
 * Body:
 * {
 *   courseId,
 *   sectionId,
 *   questionId,
 *   selectedAnswer,       // number (0-based index)
 *   explanationText       // optional student notes
 * }
 *
 * Logic:
 *  - Look up the MCQ in the static course data
 *  - Compare selectedAnswer to correctAnswer
 *  - If CORRECT  → mark section complete, unlock next, return success
 *  - If INCORRECT → trace concept dependency graph, compute restart section,
 *                   reset progress, return restart instruction
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

    // ── Find section & question ──────────────────────────────────────────────
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

    const question = section.mcqs.find((q) => q.id === questionId);
    if (!question) return res.status(404).json({ error: 'Question not found' });

    // ── Evaluate answer ──────────────────────────────────────────────────────
    const isCorrect = Number(selectedAnswer) === question.correctAnswer;
    const conceptTag = question.conceptTag || section.conceptTag;

    // Persist result
    await recordMCQResult(uid, courseId, sectionId, conceptTag, isCorrect);

    // ── CORRECT ──────────────────────────────────────────────────────────────
    if (isCorrect) {
      // Find next section
      const currentIdx = course.syllabus.findIndex((s) => s.id === sectionId);
      const nextSection = course.syllabus[currentIdx + 1] ?? null;

      return res.json({
        success: true,
        correct: true,
        correctIndex: question.correctAnswer,
        explanation: question.explanation,
        nextSectionId: nextSection ? nextSection.id : null,
        message: nextSection
          ? `Great job! You've unlocked: "${nextSection.title}"`
          : 'Course complete! You have finished all sections.',
      });
    }

    // ── INCORRECT ─────────────────────────────────────────────────────────────
    let { rootCause, path } = traceRootCause(conceptTag);
    let aiExplanation = null;
    let detailedExplanation = null;
    let recommendations = [];

    // Call LLM for real-time root cause analysis (Haiku is fast & smart enough here)
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

        // Map recommended IDs to full course objects with enrollment status
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

    // Find the earliest section in this course that covers the root concept
    const allSectionIds = course.syllabus.map((s) => s.id);
    let restartFromSectionId = findSectionForConcept(course, rootCause);

    // If no section covers the root concept exactly, restart from the beginning
    if (!restartFromSectionId) {
      restartFromSectionId = allSectionIds[0];
    }

    // Reset progress to the restart point
    await resetProgressFromSection(uid, courseId, restartFromSectionId, allSectionIds);

    // ─── Increment wrong answer count for this topic ───────────────────────
    try {
      const topicName = conceptTag;
      const topicKey = topicName.replace(/\s+/g, '_').toLowerCase();

      // Use a default teacher ID since course data has no teacherId field
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
    // ─── End of topic wrong count block ────────────────────────────────────

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
      message: aiExplanation 
        ? `We've diagnosed a gap in your "${rootCause}" knowledge.`
        : `You need to restart from "${rootCause}". Your progress has been reset to that section.`,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /mcq/mock
 *
 * Returns up to 50 randomized MCQs from all courses for the practice area.
 * Includes the correctIndex so the frontend can grade itself immediately.
 */
function getMockTest(req, res, next) {
  try {
    const allCourses = getAllCourses(); // We can fetch from data directly or service
    let pool = [];

    // Note: getAllCourses() strips syllabus currently. We need getCourseRaw over all.
    // Instead of importing the raw array, we'll just require it directly here or use a service helper.
    const courses = require('../data/courses.js');
    
    for (const c of courses) {
      for (const section of c.syllabus) {
        if (section.mcqs) {
          pool.push(...section.mcqs);
        }
      }
    }

    // Map correctAnswer to correctIndex
    pool = pool.map(({ correctAnswer, ...q }) => ({
      ...q,
      correctIndex: correctAnswer
    }));

    // Shuffle and pick 30
    const shuffled = pool.sort(() => Math.random() - 0.5).slice(0, 30);
    res.json({ questions: shuffled });
  } catch (err) {
    next(err);
  }
}

module.exports = { submitMCQ, getMockTest };
