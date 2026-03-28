const Anthropic = require('@anthropic-ai/sdk');
const conceptGraph = require('../data/conceptGraph');

const anthropic = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;

/**
 * Uses LLM (Claude) to diagnose the root cause of an MCQ mistake.
 * Fallback to static graph tracing if API key is missing.
 */
async function diagnoseError({
  question,
  correctAnswer,
  selectedAnswer,
  approachText,
  conceptTag,
}) {
  if (!anthropic) {
    console.warn('[Diagnosis] No ANTHROPIC_API_KEY. Using static graph fallback.');
    return null; // Signals controller to use static trace
  }

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

    INSTRUCTIONS:
    1. Identify which PREREQUISITE concept from the graph given above is most likely broken or missing, causing this specific mistake.
    2. Provide a 1-sentence diagnostic explanation of why this gap led to the wrong answer.
    3. Return your response as a valid JSON object ONLY, with these fields:
       {
         "rootCause": "Name of the concept from the graph",
         "explanation": "Diagnostic text",
         "suggestedRevisePath": ["Concept A", "Concept B"]
       }

    CRITICAL: The "rootCause" MUST be one of the keys in the Prerequisite Graph provided above.
  `;

  try {
    const msg = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 500,
      messages: [{ role: 'user', content: prompt }],
    });

    const content = msg.content[0].text;
    const result = JSON.parse(content);
    return result;
  } catch (err) {
    console.error('[Diagnosis] AI call failed:', err.message);
    return null;
  }
}

module.exports = { diagnoseError };
