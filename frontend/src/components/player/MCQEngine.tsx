import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '../ui/Button'
import ConceptGraph from './ConceptGraph'
import { annotateChain, findRootCause } from '../../lib/conceptEngine'
import { useUserProgress } from '../../lib/useUserProgress'
import mcqBank from '../../data/mcq-bank.json'

type MCQState = 'answering' | 'correct' | 'wrong' | 'approach_input' | 'analysis' | 'restarting'

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

interface MCQEngineProps {
  questionIds: string[]
  onComplete: () => void
  sectionTitle: string
}

function getQuestions(ids: string[]): MCQQuestion[] {
  return (mcqBank as MCQQuestion[]).filter(q => ids.includes(q.id))
}

function pickQuestion(questions: MCQQuestion[], usedIds: string[]): MCQQuestion {
  const unused = questions.filter(q => !usedIds.includes(q.id))
  const pool = unused.length > 0 ? unused : questions
  return pool[Math.floor(Math.random() * pool.length)]
}

export default function MCQEngine({ questionIds, onComplete, sectionTitle }: MCQEngineProps) {
  const allQuestions = getQuestions(questionIds)
  const [usedIds, setUsedIds] = useState<string[]>([])
  const [currentQ, setCurrentQ] = useState<MCQQuestion>(() => pickQuestion(allQuestions, []))
  const [mcqState, setMcqState] = useState<MCQState>('answering')
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [approach, setApproach] = useState('')
  const { markWeakConcept, updateConfidence, recordMCQAttempt } = useUserProgress()

  const loadNewQuestion = useCallback(() => {
    const next = pickQuestion(allQuestions, usedIds)
    setCurrentQ(next)
    setSelectedIndex(null)
    setApproach('')
    setMcqState('answering')
  }, [allQuestions, usedIds])

  function handleSelect(index: number) {
    if (mcqState !== 'answering') return
    setSelectedIndex(index)
    const isCorrect = index === currentQ.correctIndex

    recordMCQAttempt({
      questionId: currentQ.id,
      concept: currentQ.concept,
      courseId: '',
      sectionId: '',
      correct: isCorrect,
      timestamp: Date.now(),
    })

    if (isCorrect) {
      setMcqState('correct')
      updateConfidence(currentQ.concept, 10)
      setTimeout(() => {
        onComplete()
      }, 2500)
    } else {
      setMcqState('wrong')
      markWeakConcept(currentQ.concept)
    }
  }

  function handleSubmitApproach() {
    setUsedIds(prev => [...prev, currentQ.id])
    setMcqState('analysis')
  }

  function handleRestart() {
    setMcqState('restarting')
    setTimeout(() => {
      loadNewQuestion()
    }, 500)
  }

  // AI analysis data
  const weakConcepts = [currentQ.concept]
  const rootCause = findRootCause(weakConcepts)
  const chainNodes = annotateChain(currentQ.concept, weakConcepts)

  const optionStyles = (i: number) => {
    if (mcqState === 'answering' || mcqState === 'restarting') {
      return selectedIndex === i
        ? 'border-gold bg-gold/15 text-ink'
        : 'border-ink/10 hover:border-gold/40 hover:bg-ink/5 text-ink-soft hover:text-ink cursor-pointer'
    }
    if (mcqState === 'correct') {
      if (i === currentQ.correctIndex) return 'border-emerald-500 bg-emerald-500/20 text-emerald-400'
      return 'border-ink/5 text-ink-muted'
    }
    if (mcqState === 'wrong' || mcqState === 'approach_input' || mcqState === 'analysis') {
      if (i === selectedIndex) return 'border-red-500 bg-red-500/20 text-red-400'
      if (i === currentQ.correctIndex) return 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400/60'
      return 'border-ink/5 text-ink-muted'
    }
    return 'border-ink/10 text-ink-soft'
  }

  return (
    <div className="rounded-2xl overflow-hidden border border-gold/20 bg-navy/60 backdrop-blur-md">
      {/* Header */}
      <div className="px-6 py-4 border-b border-ink/8 flex items-center justify-between">
        <p className="font-body text-gold text-xs tracking-widest uppercase">
          Section Quiz — {sectionTitle}
        </p>
        <div
          className={`w-2 h-2 rounded-full ${
            mcqState === 'correct' ? 'bg-emerald-400' : mcqState === 'analysis' ? 'bg-red-400' : 'bg-gold animate-pulse'
          }`}
        />
      </div>

      <div className="p-6">
        <AnimatePresence mode="wait">

          {/* ANSWERING STATE */}
          {(mcqState === 'answering' || mcqState === 'wrong') && (
            <motion.div
              key="question"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              <p className="font-body text-ink-muted text-xs uppercase tracking-wider mb-3">
                Concept: {currentQ.concept}
              </p>
              <p className="font-display text-ink text-lg font-light mb-6 leading-relaxed">
                {currentQ.question}
              </p>
              <div className="space-y-3">
                {currentQ.options.map((option, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelect(i)}
                    disabled={mcqState !== 'answering'}
                    className={`w-full text-left px-4 py-3.5 rounded-xl border font-body text-sm transition-all duration-200 ${optionStyles(i)}`}
                  >
                    <span className="text-ink-muted mr-3">{String.fromCharCode(65 + i)}.</span>
                    {option}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* CORRECT STATE */}
          {mcqState === 'correct' && (
            <motion.div
              key="correct"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="text-center py-4"
            >
              <div className="text-5xl mb-4">✅</div>
              <h3 className="font-display text-emerald-400 text-2xl mb-3">Correct!</h3>
              <div className="glass-card rounded-xl p-4 text-left mb-4">
                <p className="font-body text-ink-muted text-xs uppercase mb-2">Explanation</p>
                <p className="font-body text-ink text-sm leading-relaxed">{currentQ.explanation}</p>
              </div>
              <p className="font-body text-ink-muted text-sm">Unlocking next section...</p>

              {/* Options review */}
              <div className="space-y-2 mt-4">
                {currentQ.options.map((option, i) => (
                  <div
                    key={i}
                    className={`text-left px-4 py-2.5 rounded-xl border font-body text-sm ${optionStyles(i)}`}
                  >
                    <span className="text-ink-muted mr-3">{String.fromCharCode(65 + i)}.</span>
                    {option}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* APPROACH INPUT */}
          {mcqState === 'approach_input' && (
            <motion.div
              key="approach"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="text-3xl">❌</div>
                <div>
                  <h3 className="font-display text-red-400 text-xl">Incorrect</h3>
                  <p className="font-body text-ink-muted text-sm">
                    The correct answer was: <span className="text-emerald-400">{currentQ.options[currentQ.correctIndex]}</span>
                  </p>
                </div>
              </div>

              <div className="glass-card rounded-xl p-4 mb-5">
                <p className="font-body text-ink-soft text-sm mb-3">
                  What was your approach? <span className="text-ink-muted">(helps our AI diagnose your gap)</span>
                </p>
                <textarea
                  value={approach}
                  onChange={e => setApproach(e.target.value)}
                  placeholder="e.g. I tried dividing first, then moved the constants..."
                  className="w-full bg-ink/5 border border-ink/10 rounded-lg p-3 text-ink font-body text-sm resize-none outline-none focus:border-gold/40 placeholder:text-ink-muted min-h-[80px]"
                />
              </div>

              <Button variant="primary" className="w-full" onClick={handleSubmitApproach}>
                Analyze My Mistake
              </Button>
            </motion.div>
          )}

          {/* ANALYSIS */}
          {mcqState === 'analysis' && (
            <motion.div
              key="analysis"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 22 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="text-3xl">🧠</div>
                <div>
                  <h3 className="font-display text-gold text-xl">AI Diagnosis</h3>
                  <p className="font-body text-ink-muted text-sm">Root cause identified</p>
                </div>
              </div>

              {/* Root cause card */}
              <div className="bg-red-500/10 border border-red-500/25 rounded-xl p-4 mb-5">
                <p className="font-body text-red-400 text-xs uppercase tracking-wider mb-2">
                  Root Concept Gap
                </p>
                <p className="font-display text-ink text-lg font-light">
                  {rootCause}
                </p>
                <p className="font-body text-ink-muted text-sm mt-1">
                  This is the prerequisite you need to strengthen first.
                </p>
              </div>

              {/* Concept chain */}
              <div className="mb-5">
                <p className="font-body text-ink-muted text-xs uppercase tracking-wider mb-3">
                  Concept dependency chain
                </p>
                <ConceptGraph nodes={chainNodes} />
              </div>

              {/* Approach echo */}
              {approach && (
                <div className="glass-card rounded-xl p-3 mb-5">
                  <p className="font-body text-ink-muted text-xs mb-1">Your approach</p>
                  <p className="font-body text-ink-soft text-sm italic">"{approach}"</p>
                  <p className="font-body text-gold/70 text-xs mt-2">
                    → Suggests confusion with variable isolation in {currentQ.concept}
                  </p>
                </div>
              )}

              <div className="bg-gold/10 border border-gold/20 rounded-xl p-4 mb-6">
                <p className="font-body text-gold text-sm">
                  📚 Revise <strong>{rootCause}</strong> first, then retry this question.
                </p>
              </div>

              <Button variant="primary" className="w-full" onClick={handleRestart}>
                Try a New Question
              </Button>
            </motion.div>
          )}

          {/* WRONG — show approach prompt */}
          {mcqState === 'wrong' && selectedIndex !== null && (
            <motion.div
              key="wrong-action"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-5"
            >
              <Button
                variant="danger"
                className="w-full"
                onClick={() => setMcqState('approach_input')}
              >
                I got it wrong — analyze my mistake
              </Button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  )
}
