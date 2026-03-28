const Groq = require('groq-sdk');
const conceptGraph = require('../data/conceptGraph');

const groq = process.env.GROQ_API_KEY
  ? new Groq({ apiKey: process.env.GROQ_API_KEY })
  : null;

/**
 * Uses LLM (Groq) to diagnose the root cause of an MCQ mistake.
 * Fallback to static graph tracing if API key is missing.
 */
async function diagnoseError({
  question,
  correctAnswer,
  selectedAnswer,
  approachText,
  conceptTag,
  availableCourses = []
}) {
  if (!groq) {
    console.warn('[Diagnosis] No GROQ_API_KEY. Using static graph fallback.');
    return null;
  }

  const courseCatalog = availableCourses.map(c => `ID: ${c.id}, Title: ${c.title}`).join('\n');

  const prompt = `
    You are an expert pedagogical diagnostic system. A student just answered an MCQ incorrectly.
    Your task is to perform a Deep Cognitive Audit to find the "Root Cause" of their misunderstanding.

    CONTEXT:
    - Current Lesson Concept: ${conceptTag}
    - Prerequisite Tree: ${JSON.stringify(conceptGraph, null, 2)}
    - Question: "${question.question}"
    - Student's Wrong Answer: "${question.options[selectedAnswer]}"
    - Student's Thinking/Approach: "${approachText || 'No approach provided'}"
    - Available Remediation Courses:
${courseCatalog}

    DIAGNOSTIC ALGORITHM:
    1. Analyze the Student's Thinking: If they mentioned a specific term ("distributive property", "unit circle"), find where that sits in the Prerequisite Tree.
    2. Trace Backwards: If they got a Quadratic equation wrong because they didn't know how to factor, the root cause is "Algebra Basics" (a level deeper), not just "Quadratic Equations".
    3. Identify the Gap: Find the EARLIEST concept in the prerequisite chain that the student likely failed to grasp based on their explanation.
    
    RESPONSE FORMAT (JSON):
    {
      "rootCause": "The concept name (MUST BE A KEY IN THE TREE)",
      "explanation": "Short diagnostic summary for student",
      "detailedExplanation": "Deep-dive into why their thinking was flawed and how it connects to the root gap",
      "recommendedCourseIds": ["course-id-1"],
      "suggestedRevisePath": ["Prerequisite 1", "Prerequisite 2"]
    }
    CRITICAL: "recommendedCourseIds" MUST ONLY contain IDs present in the Available Course Catalog.
  `;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: 'llama-3.3-70b-versatile',
      response_format: { type: 'json_object' },
    });

    const content = chatCompletion.choices[0]?.message?.content;
    if (!content) return null;

    const result = JSON.parse(content);
    return result;
  } catch (err) {
    console.error('[Diagnosis] AI call (Groq) failed:', err.message);
    return null;
  }
}

module.exports = { diagnoseError };
