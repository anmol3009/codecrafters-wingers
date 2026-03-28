import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '../components/ui/Button'
import ConceptGraph from '../components/player/ConceptGraph'
import { annotateChain, findRootCause } from '../lib/conceptEngine'
import { useUserProgress } from '../lib/useUserProgress'
import mcqBank from '../data/mcq-bank.json'

interface MCQQuestion {
  id: string
  concept: string
  question: string
  options: string[]
  correctIndex: number
  explanation: string
  difficulty: string
  variant: number
}

const ALL_QUESTIONS = mcqBank as MCQQuestion[]
const TEST_DURATION = 300 // 5 minutes in seconds

type TestState = 'setup' | 'running' | 'finished'

interface Answer {
  questionId: string
  concept: string
  selectedIndex: number
  correct: boolean
}

export default function MockTest() {
  const [testState, setTestState] = useState<TestState>('setup')
  const [selectedSubject, setSelectedSubject] = useState('All')
  const [questions, setQuestions] = useState<MCQQuestion[]>([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [timeLeft, setTimeLeft] = useState(TEST_DURATION)
  const { markWeakConcept, updateConfidence } = useUserProgress()

  const subjects = ['All', 'Mathematics', 'Physics', 'Chemistry', 'Computer Science']
  const QUESTION_COUNT = 10

  function startTest() {
    let pool = selectedSubject === 'All'
      ? ALL_QUESTIONS
      : ALL_QUESTIONS.filter(q => {
          const mathConcepts = ['Algebra', 'Linear', 'Quadratic', 'Arithmetic']
          const physicsConcepts = ["Newton's Laws", 'Kinematics']
          if (selectedSubject === 'Mathematics') return mathConcepts.some(c => q.concept.includes(c))
          if (selectedSubject === 'Physics') return physicsConcepts.some(c => q.concept.includes(c))
          return true
        })

    const shuffled = [...pool].sort(() => Math.random() - 0.5)
    setQuestions(shuffled.slice(0, Math.min(QUESTION_COUNT, shuffled.length)))
    setCurrentIdx(0)
    setAnswers([])
    setSelectedOption(null)
    setTimeLeft(TEST_DURATION)
    setTestState('running')
  }

  // Timer
  useEffect(() => {
    if (testState !== 'running') return
    if (timeLeft <= 0) {
      finishTest()
      return
    }
    const id = setInterval(() => setTimeLeft(t => t - 1), 1000)
    return () => clearInterval(id)
  }, [testState, timeLeft])

  function handleOptionSelect(idx: number) {
    if (selectedOption !== null) return
    setSelectedOption(idx)
  }

  function handleNext() {
    if (selectedOption === null) return
    const q = questions[currentIdx]
    const isCorrect = selectedOption === q.correctIndex

    const newAnswer: Answer = {
      questionId: q.id,
      concept: q.concept,
      selectedIndex: selectedOption,
      correct: isCorrect,
    }
    const newAnswers = [...answers, newAnswer]
    setAnswers(newAnswers)

    if (isCorrect) {
      updateConfidence(q.concept, 8)
    } else {
      markWeakConcept(q.concept)
    }

    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1)
      setSelectedOption(null)
    } else {
      setTestState('finished')
    }
  }

  function finishTest() {
    setTestState('finished')
  }

  const minutes = Math.floor(timeLeft / 60)
  const secs = timeLeft % 60
  const timeDisplay = `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  const timerUrgent = timeLeft < 60

  // Scorecard data
  const correct = answers.filter(a => a.correct).length
  const total = answers.length
  const score = total > 0 ? Math.round((correct / total) * 100) : 0
  const accuracy = score
  const wrongAnswers = answers.filter(a => !a.correct)
  const weakConceptsFound = [...new Set(wrongAnswers.map(a => a.concept))]
  const rootCause = weakConceptsFound.length > 0 ? findRootCause(weakConceptsFound) : null
  const chainNodes = rootCause ? annotateChain(rootCause, weakConceptsFound) : []

  return (
    <div className="min-h-screen bg-white pt-28 pb-20">
      <div className="max-w-3xl mx-auto px-6">
        <AnimatePresence mode="wait">

          {/* SETUP */}
          {testState === 'setup' && (
            <motion.div
              key="setup"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <p className="font-body text-gold text-sm tracking-widest uppercase mb-3">Mock Test</p>
              <h1 className="font-display text-ink text-4xl font-light mb-4">
                Timed Practice with AI Diagnosis
              </h1>
              <p className="font-body text-ink-soft mb-10 leading-relaxed">
                {QUESTION_COUNT} questions · {TEST_DURATION / 60} minutes · After submission, get a full
                concept gap analysis for every wrong answer.
              </p>

              <div className="glass-navy rounded-2xl p-8 mb-8">
                <h3 className="font-display text-ink text-xl mb-5">Select Subject</h3>
                <div className="flex flex-wrap gap-3">
                  {subjects.map(s => (
                    <button
                      key={s}
                      onClick={() => setSelectedSubject(s)}
                      className={`px-5 py-2 rounded-full font-body text-sm transition-all ${
                        selectedSubject === s
                          ? 'bg-gold text-navy-dark'
                          : 'border border-white/15 text-ink-soft hover:border-gold/40 hover:text-ink'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-10">
                {[
                  { icon: '❓', label: `${QUESTION_COUNT} Questions` },
                  { icon: '⏱', label: `${TEST_DURATION / 60} Minutes` },
                  { icon: '🧠', label: 'AI Root Analysis' },
                ].map(f => (
                  <div key={f.label} className="glass-card rounded-xl p-4 text-center">
                    <div className="text-2xl mb-2">{f.icon}</div>
                    <p className="font-body text-ink-soft text-sm">{f.label}</p>
                  </div>
                ))}
              </div>

              <Button variant="gold" size="lg" className="w-full" onClick={startTest}>
                Start Mock Test
              </Button>
            </motion.div>
          )}

          {/* RUNNING */}
          {testState === 'running' && questions.length > 0 && (
            <motion.div
              key="running"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Timer + progress */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="glass-card rounded-xl px-4 py-2">
                    <p className="font-body text-ink-muted text-xs">Question</p>
                    <p className="font-display text-ink text-lg">{currentIdx + 1} / {questions.length}</p>
                  </div>
                </div>
                <div
                  className={`glass-card rounded-xl px-5 py-2 ${timerUrgent ? 'border-red-500/50' : ''}`}
                >
                  <p className="font-body text-ink-muted text-xs">Time left</p>
                  <p className={`font-display text-xl ${timerUrgent ? 'text-red-400' : 'text-gold'}`}>
                    {timeDisplay}
                  </p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-1 bg-ink/5 rounded-full mb-8">
                <div
                  className="h-full bg-gold rounded-full transition-all duration-300"
                  style={{ width: `${((currentIdx) / questions.length) * 100}%` }}
                />
              </div>

              {/* Question */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIdx}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="glass-navy rounded-2xl p-8 mb-6">
                    <p className="font-body text-gold/60 text-xs uppercase tracking-wider mb-3">
                      {questions[currentIdx].concept}
                    </p>
                    <p className="font-display text-ink text-xl font-light leading-relaxed">
                      {questions[currentIdx].question}
                    </p>
                  </div>

                  <div className="space-y-3 mb-8">
                    {questions[currentIdx].options.map((option, i) => (
                      <button
                        key={i}
                        onClick={() => handleOptionSelect(i)}
                        className={`w-full text-left px-5 py-4 rounded-xl border font-body text-sm transition-all duration-200 ${
                          selectedOption === null
                            ? 'border-ink/10 hover:border-gold/40 hover:bg-ink/5 text-ink-soft'
                            : selectedOption === i
                            ? 'border-gold bg-gold/15 text-ink'
                            : 'border-ink/5 text-ink-muted'
                        }`}
                      >
                        <span className="text-ink-muted mr-3">{String.fromCharCode(65 + i)}.</span>
                        {option}
                      </button>
                    ))}
                  </div>

                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full"
                    disabled={selectedOption === null}
                    onClick={handleNext}
                  >
                    {currentIdx < questions.length - 1 ? 'Next Question →' : 'Submit Test'}
                  </Button>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )}

          {/* SCORECARD */}
          {testState === 'finished' && (
            <motion.div
              key="finished"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <div className="text-center mb-10">
                <div className="text-5xl mb-4">{score >= 80 ? '🏆' : score >= 60 ? '📈' : '📚'}</div>
                <h1 className="font-display text-ink text-4xl font-light mb-2">Test Complete</h1>
                <p className="font-body text-ink-muted">Here's your concept gap analysis</p>
              </div>

              {/* Score cards */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                {[
                  { value: `${score}`, suffix: '/100', label: 'Overall Score' },
                  { value: `${accuracy}`, suffix: '%', label: 'Accuracy' },
                  { value: `${correct}`, suffix: `/${total}`, label: 'Correct' },
                ].map(s => (
                  <div key={s.label} className="glass-navy rounded-2xl p-5 text-center">
                    <p className="font-display text-gold text-3xl">
                      {s.value}<span className="text-xl text-gold/50">{s.suffix}</span>
                    </p>
                    <p className="font-body text-ink-muted text-sm mt-1">{s.label}</p>
                  </div>
                ))}
              </div>

              {weakConceptsFound.length > 0 ? (
                <>
                  {/* Root cause */}
                  <div className="bg-red-500/10 border border-red-500/25 rounded-2xl p-6 mb-6">
                    <p className="font-body text-red-400 text-xs uppercase tracking-wider mb-2">Root Cause Identified</p>
                    <p className="font-display text-ink text-2xl font-light">{rootCause}</p>
                    <p className="font-body text-ink-muted text-sm mt-2">
                      This is the foundational concept you need to strengthen most.
                    </p>
                  </div>

                  {/* Concept chain */}
                  {chainNodes.length > 0 && (
                    <div className="glass-navy rounded-2xl p-6 mb-6">
                      <p className="font-body text-ink-muted text-xs uppercase tracking-wider mb-4">
                        Concept Dependency Chain
                      </p>
                      <ConceptGraph nodes={chainNodes} />
                    </div>
                  )}

                  {/* Weak areas */}
                  <div className="glass-navy rounded-2xl p-6 mb-8">
                    <p className="font-display text-ink text-lg mb-4">Weak Areas</p>
                    <div className="flex flex-wrap gap-2">
                      {weakConceptsFound.map(c => (
                        <span key={c} className="font-body text-sm text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-1 rounded-full">
                          ⚠ {c}
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="glass-navy rounded-2xl p-8 text-center mb-8">
                  <div className="text-4xl mb-3">🎉</div>
                  <p className="font-display text-emerald-400 text-2xl mb-2">Perfect Score!</p>
                  <p className="font-body text-ink-muted">No weak concepts detected. Outstanding performance!</p>
                </div>
              )}

              <div className="flex gap-4">
                <Button variant="primary" size="lg" className="flex-1" onClick={() => setTestState('setup')}>
                  Take Another Test
                </Button>
                <Button variant="ghost" size="lg" className="flex-1" onClick={() => window.history.back()}>
                  Back to Courses
                </Button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  )
}
