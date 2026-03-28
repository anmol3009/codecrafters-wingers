import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '../components/ui/Button'
import { DifficultyBadge } from '../components/ui/Badge'
import MCQEngine from '../components/player/MCQEngine'
import { useUserProgress } from '../lib/useUserProgress'
import coursesData from '../data/courses.json'

type Course = (typeof coursesData)[0]

export default function CoursePlayer() {
  const { id } = useParams<{ id: string }>()
  const course = (coursesData.find(c => c.id === id) ?? null) as Course | null
  const { enrolledCourses, enrollCourse, completedSections, completeSection, setCurrentSection } = useUserProgress()

  const [activeSectionIndex, setActiveSectionIndex] = useState(0)
  const [showMCQ, setShowMCQ] = useState(false)
  const [mcqTimer, setMcqTimer] = useState(30) // seconds until MCQ appears

  useEffect(() => {
    if (course && !enrolledCourses.includes(c.id)) {
      enrollCourse(c.id)
    }
  }, [course, enrolledCourses, enrollCourse])

  useEffect(() => {
    if (!showMCQ) {
      setMcqTimer(30)
      const interval = setInterval(() => {
        setMcqTimer(t => {
          if (t <= 1) {
            clearInterval(interval)
            setShowMCQ(true)
            return 0
          }
          return t - 1
        })
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [activeSectionIndex, showMCQ])

  if (course === null) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center pt-20">
        <div className="text-center">
          <p className="font-display text-ink-muted text-2xl mb-4">Course not found</p>
          <Link to="/courses"><Button variant="primary">Browse Courses</Button></Link>
        </div>
      </div>
    )
  }

  // course is non-null after this point
  const c = course!
  const activeSection = c.syllabus[activeSectionIndex]
  const completedIds = completedSections[c.id] ?? []

  function isUnlocked(idx: number): boolean {
    if (idx === 0) return true
    const prevSection = c.syllabus[idx - 1]
    return completedIds.includes(prevSection.id)
  }

  function handleSectionClick(idx: number) {
    if (!isUnlocked(idx)) return
    setActiveSectionIndex(idx)
    setShowMCQ(false)
    setCurrentSection(c.id, c.syllabus[idx].id)
  }

  function handleMCQComplete() {
    completeSection(c.id, activeSection.id)
    setShowMCQ(false)
    // Auto-advance to next section if exists
    if (activeSectionIndex < c.syllabus.length - 1) {
      setTimeout(() => {
        setActiveSectionIndex(activeSectionIndex + 1)
      }, 800)
    }
  }

  const progressPercent = Math.round((completedIds.length / c.syllabus.length) * 100)

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-3 text-sm font-body">
        <Link to="/courses" className="text-ink-muted hover:text-ink transition-colors">Courses</Link>
        <span className="text-ink-muted">/</span>
        <span className="text-ink-soft">{c.title}</span>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-20">
        {/* Course header */}
        <div className="flex items-start justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <DifficultyBadge difficulty={c.difficulty} />
              <span className="font-body text-ink-muted text-sm">{c.subject}</span>
            </div>
            <h1 className="font-display text-ink text-3xl font-light">{c.title}</h1>
          </div>
          <div className="text-right">
            <p className="font-body text-ink-muted text-sm mb-1">Progress</p>
            <p className="font-display text-gold text-2xl">{progressPercent}%</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-ink/5 rounded-full mb-8">
          <motion.div
            className="h-full bg-gold rounded-full"
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        <div className="grid lg:grid-cols-[1fr_340px] gap-8">
          {/* Left: Video + MCQ */}
          <div className="space-y-6">
            {/* Video Player */}
            <div className="glass-navy rounded-2xl overflow-hidden">
              <div className="aspect-video bg-black relative">
                <iframe
                  key={activeSection.videoId}
                  src={`https://www.youtube.com/embed/${activeSection.videoId}?autoplay=0&rel=0&modestbranding=1`}
                  title={activeSection.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              </div>
              <div className="p-5 flex items-center justify-between">
                <div>
                  <p className="font-display text-ink text-lg">{activeSection.title}</p>
                  <p className="font-body text-ink-muted text-sm mt-1">⏱ {activeSection.duration}</p>
                </div>
                {!showMCQ && (
                  <div className="text-right">
                    <p className="font-body text-ink-muted text-xs">Quiz in</p>
                    <p className="font-display text-gold text-2xl">{mcqTimer}s</p>
                  </div>
                )}
              </div>
            </div>

            {/* MCQ */}
            <AnimatePresence>
              {showMCQ && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                >
                  <MCQEngine
                    questionIds={activeSection.mcqIds}
                    onComplete={handleMCQComplete}
                    sectionTitle={activeSection.title}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {!showMCQ && completedIds.includes(activeSection.id) && (
              <div className="glass-navy rounded-2xl p-6 text-center border border-emerald-500/20">
                <div className="text-3xl mb-2">✅</div>
                <p className="font-display text-emerald-400 text-lg">Section Complete</p>
                <p className="font-body text-ink-muted text-sm mt-1">Move to the next section in the syllabus</p>
              </div>
            )}
          </div>

          {/* Right: Syllabus */}
          <div className="glass-navy rounded-2xl p-6 h-fit sticky top-28">
            <h3 className="font-display text-ink text-xl mb-5">Syllabus</h3>
            <div className="space-y-2">
              {c.syllabus.map((section, idx) => {
                const unlocked = isUnlocked(idx)
                const completed = completedIds.includes(section.id)
                const active = idx === activeSectionIndex

                return (
                  <button
                    key={section.id}
                    onClick={() => handleSectionClick(idx)}
                    disabled={!unlocked}
                    className={`w-full text-left px-4 py-3.5 rounded-xl border transition-all duration-200 ${
                      active
                        ? 'border-gold/40 bg-gold/10'
                        : completed
                        ? 'border-emerald-500/20 bg-emerald-500/5 hover:border-emerald-500/40'
                        : unlocked
                        ? 'border-ink/8 hover:border-ink/15 bg-ink/3'
                        : 'border-ink/5 opacity-40 cursor-not-allowed bg-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${
                          completed
                            ? 'bg-emerald-500/30 text-emerald-400'
                            : active
                            ? 'bg-gold/30 text-gold'
                            : !unlocked
                            ? 'bg-ink/5 text-ink-muted'
                            : 'bg-ink/8 text-ink-muted'
                        }`}
                      >
                        {completed ? '✓' : !unlocked ? '🔒' : idx + 1}
                      </div>
                      <div className="min-w-0">
                        <p className={`font-body text-sm truncate ${
                          active ? 'text-ink' : completed ? 'text-ink-soft' : unlocked ? 'text-ink-soft' : 'text-ink-muted'
                        }`}>
                          {section.title}
                        </p>
                        <p className="font-body text-xs text-ink-muted">{section.duration}</p>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>

            <div className="mt-6 pt-5 border-t border-ink/8">
              <p className="font-body text-ink-muted text-xs text-center">
                Complete each section to unlock the next
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
