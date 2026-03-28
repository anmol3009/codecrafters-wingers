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
    You are an expert AI tutor. A student just answered a multiple-choice question incorrectly.
    Your task is to identify the most likely "Root Cause" of their mistake.

    CONTEXT:
    - Question node in curriculum: ${conceptTag}
    - Prerequisite Graph: ${JSON.stringify(conceptGraph, null, 2)}
    - The Question: "${question.question}"
    - Correct Answer: "${question.options[correctAnswer]}"
    - Student's Answer: "${question.options[selectedAnswer]}"
    - Student's Approach: "${approachText || 'No approach provided'}"
    - Available Course Catalog:
${courseCatalog}

    INSTRUCTIONS:
    1. Identify which PREREQUISITE concept from the graph given above is most likely broken or missing, causing this specific mistake.
    2. Provide a 1-sentence diagnostic explanation (explanation).
    3. Provide a more detailed 2-3 sentence logic deep-dive (detailedExplanation).
    4. Select 1-2 most relevant Course IDs from the "Available Course Catalog" that would help fix this error (recommendedCourseIds).
    5. Return your response as a valid JSON object ONLY, with these fields:
       {
         "rootCause": "Name of the concept from the graph",
         "explanation": "Short diagnostic summary",
         "detailedExplanation": "In-depth logic analysis",
         "recommendedCourseIds": ["course-id-1"],
         "suggestedRevisePath": ["Concept A", "Concept B"]
       }

    CRITICAL: The "rootCause" MUST be one of the keys in the Prerequisite Graph provided above.
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
