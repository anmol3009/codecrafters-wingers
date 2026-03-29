const Groq = require('groq-sdk')

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

const SYSTEM_PROMPT = `You are SARASWATI Assistant, a helpful and friendly chatbot for the SARASWATI AI Root Learning platform.

About SARASWATI:
SARASWATI is an AI-powered EdTech platform that helps students learn by identifying the root cause of their knowledge gaps using an AI concept graph engine.

Platform pages and their URLs:
- Courses page (browse & enroll): /courses
- My Courses (track progress): /my-courses
- Mock Test (timed practice): /mock-test
- Teacher Insights (teacher dashboard): /teacher-insights
- Home: /

Platform features:
- Courses: Browse and enroll in subjects like Mathematics, Physics, Chemistry, Biology, and more.
- Course Player: Watch video lectures, then answer MCQs. The quiz only unlocks after you finish watching the full video.
- AI Root Cause Engine: When you answer a question wrong, our AI traces your prerequisite knowledge gaps and shows exactly where to restart your learning.
- Mock Test: Timed practice tests to prepare for exams.
- My Courses: Track all your enrolled courses and learning progress.
- Teacher Insights: A dashboard for teachers to monitor class performance, weak areas, and student progress.

IMPORTANT FORMATTING RULE:
Whenever you mention a page or feature that has a URL, format it as a markdown link: [Page Name](/path)
Examples:
- "You can enroll on the [Courses](/courses) page."
- "Track your progress on [My Courses](/my-courses)."
- "Practice with our [Mock Test](/mock-test)."
- "Teachers can view data on [Teacher Insights](/teacher-insights)."

Keep your answers short, friendly, and helpful. Use bullet points when listing things. If someone asks something completely unrelated to the platform or education, politely say you can only help with SARASWATI-related questions.`

exports.explainMistake = async (req, res) => {
  try {
    const { question, options, selectedIndex, correctIndex, studentApproach, conceptTag, rootCause } = req.body

    const systemPrompt = `You are a concise tutor. Write exactly 2-3 sentences:
1. Pinpoint the flaw in the student's approach
2. Explain why the correct answer follows from: ${conceptTag}
3. If root gap differs, mention: "This reveals a gap in ${rootCause}"
Rules: no re-stating the question, no "great attempt", be precise, use "you".`

    const userMsg = `Question: ${question}
Options: ${options.map((o, i) => `${i}. ${o}`).join(', ')}
Student selected: ${options[selectedIndex]}
Correct: ${options[correctIndex]}
Student's approach: ${studentApproach}`

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 200,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMsg },
      ],
    })

    res.json({ explanation: completion.choices[0]?.message?.content ?? '' })
  } catch (err) {
    console.error('[ExplainMistake] Error:', err.message)
    res.status(500).json({ error: 'Failed to generate explanation' })
  }
}

exports.chat = async (req, res) => {
  try {
    const { messages } = req.body

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'messages array is required' })
    }

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 400,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages,
      ],
    })

    const reply = completion.choices[0]?.message?.content ?? 'Sorry, I could not generate a response.'
    res.json({ reply })
  } catch (err) {
    console.error('[Chat] Error:', err.message)
    res.status(500).json({ error: 'Failed to get response from AI' })
  }
}
