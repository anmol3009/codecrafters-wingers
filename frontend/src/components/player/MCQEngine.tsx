import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain } from 'lucide-react'
import { Button } from '../ui/Button'
import DiagnosisGraph from './DiagnosisGraph'
import { annotateChain, findRootCause } from '../../lib/conceptEngine'
import { useUserProgress } from '../../lib/useUserProgress'
import { api, type McqSubmitResponse } from '../../lib/api'

type MCQState = 'generating' | 'answering' | 'correct' | 'wrong' | 'approach_input' | 'analysis' | 'restarting'

export interface MCQQuestion {
  id: string
  concept: string
  question: string
  options: string[]
  correctIndex?: number
  correctAnswer?: number // backend dynamic field
  explanation: string
  difficulty: string
  variant: number
}

interface MCQEngineProps {
  questions: MCQQuestion[]
  onComplete: () => void
  sectionTitle: string
  courseId: string
  sectionId: string
  /** Called when backend says to restart from a given section */
  onRestartFromSection?: (sectionId: string) => void
}

const COMMON_APPROACHES = [
  "I tried to isolate the variable but got confused by the signs",
  "I misapplied the distributive property",
  "I thought I should divide first before adding/subtracting",
  "I miscalculated the arithmetic part",
  "I don't recall this prerequisite concept"
]

function pickQuestion(questions: MCQQuestion[], usedIds: string[]): MCQQuestion {
  const unused = questions.filter(q => !usedIds.includes(q.id))
  // If no unused questions exist, pick randomly from all, or default to first if empty
  const pool = unused.length > 0 ? unused : questions
  return pool.length > 0 ? pool[Math.floor(Math.random() * pool.length)] : {} as MCQQuestion
}

export default function MCQEngine({ questions, onComplete, sectionTitle, onRestartFromSection, ...props }: MCQEngineProps) {
  const [usedIds, setUsedIds] = useState<string[]>([])
  const [currentQ, setCurrentQ] = useState<MCQQuestion | null>(null)
  const [mcqState, setMcqState] = useState<MCQState>('generating')
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [approach, setApproach] = useState('')
  const [backendResult, setBackendResult] = useState<McqSubmitResponse | null>(null)
  const { markWeakConcept, updateConfidence, recordMCQAttempt, authToken, completeSection } = useUserProgress()

  const loadNewQuestion = useCallback(async () => {
    setMcqState('generating')
    setSelectedIndex(null)
    setApproach('')
    setBackendResult(null)

    if (authToken) {
      try {
        const res = await api.mcq.generate(props.courseId, props.sectionId, authToken)
        if (res.mcq) {
          setCurrentQ({ ...res.mcq, id: 'ai-generated' })
          setMcqState('answering')
          return
        }
      } catch (err) {
        console.warn('[MCQ] AI generation failed, falling back to static questions', err)
      }
    }

    const next = pickQuestion(questions, usedIds)
    setCurrentQ(next)
    setMcqState('answering')
  }, [questions, usedIds, props.courseId, props.sectionId, authToken])

  // Initialize on mount
  useState(() => {
    loadNewQuestion()
  })

  async function handleSelect(index: number) {
    if (mcqState !== 'answering' || !currentQ) return
    setSelectedIndex(index)
    
    const correctIdx = currentQ.correctIndex !== undefined ? currentQ.correctIndex : currentQ.correctAnswer
    const isCorrect = index === correctIdx

    recordMCQAttempt({
      questionId: currentQ.id,
      concept: currentQ.concept || (currentQ as any).conceptTag,
      courseId: props.courseId,
      sectionId: props.sectionId,
      correct: isCorrect,
      timestamp: Date.now(),
    })

    if (isCorrect) {
      // Call backend immediately for success
      if (authToken) {
        try {
          const result = await api.mcq.submit({
            courseId: props.courseId,
            sectionId: props.sectionId,
            questionId: currentQ.id,
            dynamicQuestion: currentQ.id === 'ai-generated' ? currentQ : undefined,
            selectedAnswer: index,
            conceptTested: currentQ.concept || (currentQ as any).conceptTag,
          }, authToken)
          setBackendResult(result)
        } catch (e) {
          console.warn('[MCQ] backend submit failed', e)
        }
      }
      setMcqState('correct')
      updateConfidence(currentQ!.concept || (currentQ as any).conceptTag, 10)
      completeSection(props.courseId, props.sectionId)
      setTimeout(() => {
        onComplete()
      }, 2500)
    } else {
      setMcqState('wrong')
      markWeakConcept(currentQ!.concept || (currentQ as any).conceptTag)
    }
  }

  async function handleSubmitApproach() {
    if (!currentQ || !authToken) {
      setMcqState('analysis')
      return
    }

    try {
      const result = await api.mcq.submit({
        courseId: props.courseId,
        sectionId: props.sectionId,
        questionId: currentQ.id,
        dynamicQuestion: currentQ.id === 'ai-generated' ? currentQ : undefined,
        selectedAnswer: selectedIndex!,
        explanationText: approach,
        conceptTested: currentQ.concept || (currentQ as any).conceptTag,
      }, authToken)
      setBackendResult(result)
      
      if (!result.correct && result.restartFromSectionId) {
        onRestartFromSection?.(result.restartFromSectionId)
      }
    } catch (e) {
      console.warn('[MCQ] Deep diagnosis failed', e)
    }
    
    setUsedIds(prev => [...prev, currentQ.id])
    setMcqState('analysis')
  }

  function handleRestart() {
    setMcqState('restarting')
    setTimeout(() => {
      loadNewQuestion()
    }, 500)
  }

  // AI analysis data — prefer backend result if available
  const currentConcept = currentQ?.concept || (currentQ as any)?.conceptTag || 'General'
  const weakConcepts = [currentConcept]
  const rootCause = backendResult?.rootCause ?? findRootCause(weakConcepts)
  const chainNodes = annotateChain(currentConcept, weakConcepts)

  // Use the backend's correctIndex if the frontend model stripped it
  const actualCorrectIndex = backendResult?.correctIndex ?? currentQ?.correctIndex ?? (currentQ as any)?.correctAnswer ?? -1

  const optionStyles = (i: number) => {
    if (mcqState === 'answering' || mcqState === 'restarting') {
      return selectedIndex === i
        ? 'border-gold bg-gold/15 text-ink'
        : 'border-ink/10 hover:border-gold/40 hover:bg-ink/5 text-ink-soft hover:text-ink cursor-pointer'
    }
    if (mcqState === 'correct') {
      if (i === actualCorrectIndex) return 'border-emerald-500 bg-emerald-500/20 text-emerald-400'
      return 'border-ink/5 text-ink-muted'
    }
    if (mcqState === 'wrong' || mcqState === 'approach_input' || mcqState === 'analysis') {
      if (i === selectedIndex) return 'border-red-500 bg-red-500/20 text-red-400'
      if (i === actualCorrectIndex) return 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400/60'
      return 'border-ink/5 text-ink-muted'
    }
    return 'border-ink/10 text-ink-soft'
  }

  if (!currentQ && mcqState !== 'generating') return null

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

          {/* GENERATING STATE */}
          {mcqState === 'generating' && (
            <motion.div
              key="generating"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-12 text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold/10 mb-6 relative">
                 <div className="absolute inset-0 rounded-full border border-gold/40 animate-ping opacity-25" />
                 <Brain className="w-8 h-8 text-gold" />
              </div>
              <p className="font-display text-white text-xl font-light mb-2">AI is crafting your challenge...</p>
              <p className="font-body text-ink-muted text-sm px-10">Synthesizing lesson concepts into a pedagogical assessment.</p>
            </motion.div>
          )}

          {/* ANSWERING STATE */}
          {currentQ && (mcqState === 'answering' || mcqState === 'wrong') && (
            <motion.div
              key="question"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              <p className="font-body text-ink-muted text-xs uppercase tracking-wider mb-3">
                Concept: {currentQ.concept || (currentQ as any).conceptTag}
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
          {currentQ && mcqState === 'correct' && (
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
              <p className="font-body text-ink-muted text-sm">Challenge mastered. Unlocking next lesson.</p>

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
          {currentQ && mcqState === 'approach_input' && (
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
                    The correct answer was: <span className="text-emerald-400">{actualCorrectIndex >= 0 ? currentQ.options[actualCorrectIndex] : '...'}</span>
                  </p>
                </div>
              </div>

              <div className="glass-card rounded-xl p-6 mb-8 border-red-500/30">
                <p className="font-display text-ink text-xl mb-6 text-center">
                  What was your reasoning here?
                </p>
                <div className="grid gap-3">
                  {COMMON_APPROACHES.map((app, i) => (
                    <button
                      key={i}
                      onClick={() => setApproach(app)}
                      className={`w-full text-left px-4 py-3 border-2 font-body text-sm transition-all ${
                        approach === app 
                          ? 'border-[#111] bg-[#FFCBA4] shadow-brutal-sm' 
                          : 'border-ink/10 hover:border-ink/30 hover:bg-ink/5'
                      }`}
                    >
                      {app}
                    </button>
                  ))}
                  <textarea
                    value={!COMMON_APPROACHES.includes(approach) ? approach : ''}
                    onChange={e => setApproach(e.target.value)}
                    placeholder="Describe your thinking process in detail..."
                    className="w-full bg-ink/5 border-2 border-ink/10 rounded-sm p-4 text-ink font-body text-sm resize-none outline-none focus:border-[#111] placeholder:text-ink-muted min-h-[100px]"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <Button variant="ghost" className="flex-1" onClick={() => setMcqState('wrong')}>
                  Back
                </Button>
                <Button variant="primary" className="flex-[2]" onClick={handleSubmitApproach} disabled={!approach}>
                  Diagnose My Thinking →
                </Button>
              </div>
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
                  <h3 className="font-display text-gold text-xl">Cognitive Audit</h3>
                  <p className="font-body text-ink-muted text-sm">Tracing root cause from your thinking...</p>
                </div>
              </div>

              {/* Diagnosis Graph */}
              <div className="mb-8">
                <DiagnosisGraph 
                  chain={chainNodes} 
                  rootCause={rootCause} 
                  detailedExplanation={backendResult?.detailedExplanation}
                  recommendations={backendResult?.recommendations}
                />
              </div>

              {backendResult?.detailedExplanation && (
                <div className="bg-navy-dark/40 border border-gold/10 p-6 mb-8 rounded-xl">
                  <p className="font-body text-ink text-sm leading-relaxed">
                    <span className="text-gold font-bold uppercase text-[10px] tracking-widest block mb-2">Mental Gap Found</span>
                    {backendResult.detailedExplanation}
                  </p>
                </div>
              )}

              <div className="bg-[#FFFAF6] border-2 border-[#111] p-6 mb-8" style={{ boxShadow: '6px 6px 0 #FFCBA4' }}>
                <p className="font-body text-[#111] text-sm leading-relaxed">
                  <span className="font-bold">Adaptive Path:</span> To master this lesson, you should first clarify <strong>{rootCause}</strong>. 
                </p>
              </div>

              <div className="flex gap-4">
                <Button variant="ghost" className="flex-1" onClick={handleRestart}>
                  Retry Challenge
                </Button>
                <Button variant="primary" className="flex-1" onClick={handleRestart}>
                   Bridge Gap: {rootCause}
                </Button>
              </div>
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
                Analyze my reasoning error
              </Button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  )
}

