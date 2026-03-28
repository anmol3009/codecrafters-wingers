const Groq = require('groq-sdk');

const groq = process.env.GROQ_API_KEY
  ? new Groq({ apiKey: process.env.GROQ_API_KEY })
  : null;

/**
 * Generates a high-quality MCQ based on video metadata.
 */
async function generateDynamicMCQ({
  courseTitle,
  sectionTitle,
  conceptTag,
}) {
  if (!groq) {
    console.warn('[Generator] No GROQ_API_KEY. AI generation disabled.');
    return null;
  }

  const prompt = `
    You are an expert AI professor. Your goal is to generate a challenging, high-fidelity Multiple Choice Question (MCQ) for a student who just finished watching a educational video.

    VIDEO CONTEXT:
    - Course: "${courseTitle}"
    - Lesson: "${sectionTitle}"
    - Concept Tag: "${conceptTag}"

    INSTRUCTIONS:
    1. The question should specifically test a key insight or technical concept from the lesson.
    2. Provide 4 options (A-D).
    3. Ensure only one option is clearly correct.
    4. Provide a detailed pedagogical explanation of the correct answer.
    5. Return your response as a valid JSON object ONLY, with these fields:
       {
         "question": "The question text",
         "options": ["Option A", "Option B", "Option C", "Option D"],
         "correctAnswer": 0, // 0-based index of the correct option
         "explanation": "Detailed explanation of why this answer is correct",
         "conceptTag": "${conceptTag}"
       }

    CRITICAL: Maintain a highly professional, academic tone. Avoid generic questions.
  `;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: 'llama-3.3-70b-versatile', // Groq's best model for logic
      response_format: { type: 'json_object' },
    });

    const content = chatCompletion.choices[0]?.message?.content;
    if (!content) return null;

    const result = JSON.parse(content);
    return result;
  } catch (err) {
    console.error('[Generator] AI generation failed:', err.message);
    return null;
  }
}

module.exports = { generateDynamicMCQ };
