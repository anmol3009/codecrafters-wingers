import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '../components/ui/Button'
import { DifficultyBadge } from '../components/ui/Badge'
import MCQEngine from '../components/player/MCQEngine'
import { useUserProgress } from '../lib/useUserProgress'
import coursesData from '../data/courses.json'

// ✅ CHANGE 1: Add this global declaration after imports so TypeScript knows window.YT exists
declare global {
  interface Window {
    YT: any
    onYouTubeIframeAPIReady: () => void
  }
}

type Course = (typeof coursesData)[0]

export default function CoursePlayer() {
  const { id } = useParams<{ id: string }>()
  const course = (coursesData.find(c => c.id === id) ?? null) as Course | null
  const { enrolledCourses, enrollCourse, completedSections, completeSection, setCurrentSection } = useUserProgress()

  const [activeSectionIndex, setActiveSectionIndex] = useState(0)
  const [showMCQ, setShowMCQ] = useState(false)

  // ✅ CHANGE 2: Remove mcqTimer state. Add these two instead:
  const [videoEnded, setVideoEnded] = useState(false)    // becomes true when YouTube fires ENDED event
  const [quizStarted, setQuizStarted] = useState(false)  // becomes true when user clicks "Start Quiz"

  // ✅ CHANGE 3: Add these two refs
  const playerRef = useRef<any>(null)                          // holds the YT.Player instance
  const playerContainerRef = useRef<HTMLDivElement>(null)      // the div YouTube renders into

  useEffect(() => {
    if (course && !enrolledCourses.includes((course as any).id)) {
      enrollCourse((course as any).id)
    }
  }, [course, enrolledCourses, enrollCourse])

  // ✅ CHANGE 4: Delete the entire old 30-second countdown useEffect and replace with these two:

  // Loads the YouTube IFrame API script once on mount
  useEffect(() => {
    if (!document.getElementById('yt-api-script')) {
      const tag = document.createElement('script')
      tag.id = 'yt-api-script'
      tag.src = 'https://www.youtube.com/iframe_api'
      document.body.appendChild(tag)
    }
  }, [])

  // Initializes (or re-initializes) the YouTube player every time the active section changes
  useEffect(() => {
    if (!course) return
    const c = course as Course
    const videoId = c.syllabus[activeSectionIndex].videoId

    const initPlayer = () => {
      // Destroy the previous player instance so they don't stack up
      if (playerRef.current) {
        playerRef.current.destroy()
        playerRef.current = null
      }
      // Recreate the inner div because YT.destroy() removes it from the DOM
      if (playerContainerRef.current) {
        playerContainerRef.current.innerHTML = ''
        const div = document.createElement('div')
        div.id = 'yt-player'
        playerContainerRef.current.appendChild(div)
      }
      // Create the YouTube player — this is how you detect video end
      playerRef.current = new window.YT.Player('yt-player', {
        videoId,
        playerVars: { rel: 0, modestbranding: 1 },
        width: '100%',
        height: '100%',
        events: {
          onStateChange: (event: any) => {
            // YT.PlayerState.ENDED === 0 — fires when video reaches the end
            if (event.data === window.YT.PlayerState.ENDED) {
              setVideoEnded(true)
            }
          },
        },
      })
    }

    // If the API script is already loaded and ready, init immediately
    // Otherwise register the global callback that YouTube calls when it loads
    if (window.YT && window.YT.Player) {
      initPlayer()
    } else {
      window.onYouTubeIframeAPIReady = initPlayer
    }

    // Reset all quiz states whenever the section changes
    setVideoEnded(false)
    setQuizStarted(false)
    setShowMCQ(false)
  }, [activeSectionIndex, course])

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

  const c = course!
  const activeSection = c.syllabus[activeSectionIndex]
  const completedIds = completedSections[c.id] ?? []

  function isUnlocked(idx: number): boolean {
    if (idx === 0) return true
    const prevSection = c.syllabus[idx - 1]
    return completedIds.includes(prevSection.id)
  }

  // ✅ CHANGE 5: Add videoEnded and quizStarted resets here
  function handleSectionClick(idx: number) {
    if (!isUnlocked(idx)) return
    setActiveSectionIndex(idx)
    setShowMCQ(false)
    setVideoEnded(false)    // ← add this
    setQuizStarted(false)   // ← add this
    setCurrentSection(c.id, c.syllabus[idx].id)
  }

  function handleMCQComplete() {
    completeSection(c.id, activeSection.id)
    setShowMCQ(false)
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
            <div className="glass-navy rounded-2xl overflow-hidden">

              {/* ✅ CHANGE 6: Replace <iframe> with a ref'd div so YouTube API can control it */}
              <div className="aspect-video bg-black relative">
                <div ref={playerContainerRef} className="absolute inset-0 w-full h-full">
                  <div id="yt-player" className="w-full h-full" />
                </div>
              </div>

              {/* ✅ CHANGE 7: Replace "Quiz in Xs" with locked/unlocked quiz UI */}
              <div className="p-5 flex items-center justify-between">
                <div>
                  <p className="font-display text-ink text-lg">{activeSection.title}</p>
                  <p className="font-body text-ink-muted text-sm mt-1">⏱ {activeSection.duration}</p>
                </div>

                {/* Only show this block if section isn't already completed */}
                {!completedIds.includes(activeSection.id) && !quizStarted && (
                  <div className="text-right">
                    {!videoEnded ? (
                      // Video still playing — show locked state
                      <div className="flex items-center gap-2 text-ink-muted">
                        <span className="text-xl">🔒</span>
                        <div>
                          <p className="font-body text-xs font-semibold">Quiz Locked</p>
                          <p className="font-body text-xs opacity-60">Finish video to unlock</p>
                        </div>
                      </div>
                    ) : (
                      // Video finished — show the Start Quiz button with a pop-in animation
                      <motion.button
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                        onClick={() => { setQuizStarted(true); setShowMCQ(true) }}
                        className="bg-gold text-white font-body font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-gold/90 active:scale-95 transition-all shadow-lg shadow-gold/25"
                      >
                        🎯 Start Quiz
                      </motion.button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* MCQ — appears only after clicking Start Quiz */}
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
                    courseId={c.id}
                    sectionId={activeSection.id}
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

          {/* Right: Syllabus — unchanged */}
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