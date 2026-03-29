import { useState, useEffect, useRef } from 'react'
import { useParams, useSearchParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '../components/ui/Button'
import { DifficultyBadge } from '../components/ui/Badge'
import MCQEngine from '../components/player/MCQEngine'
import { useUserProgress } from '../lib/useUserProgress'
import { api } from '../lib/api'
import { initConceptGraph } from '../lib/conceptEngine'

// Global declaration so TypeScript knows window.YT exists
declare global {
  interface Window {
    YT: any
    onYouTubeIframeAPIReady: () => void
  }
}

interface Course {
  id: string
  title: string
  subject: string
  difficulty: string
  syllabus: any[]
}

export default function CoursePlayer() {
  const { id } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  const { enrolledCourses, enrollCourse, completedSections, completeSection, setCurrentSection, authToken } = useUserProgress()

  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [activeSectionIndex, setActiveSectionIndex] = useState(0)
  const [showMCQ, setShowMCQ] = useState(false)

  const [videoEnded, setVideoEnded] = useState(false)
  const [quizStarted, setQuizStarted] = useState(false)

  const playerRef = useRef<any>(null)
  const playerContainerRef = useRef<HTMLDivElement>(null)

  // Load concept graph for MCQ diagnosis
  useEffect(() => { initConceptGraph() }, [])

  // Fetch course from API
  useEffect(() => {
    if (!id) return
    setLoading(true)
    api.courses.get(id)
      .then(res => {
        setCourse(res.course)
        if (res.course && !enrolledCourses.includes(res.course.id)) {
          enrollCourse(res.course.id)
        }
      })
      .catch(err => {
        console.error(err)
        setError(true)
      })
      .finally(() => setLoading(false))
  }, [id, enrolledCourses, enrollCourse])

  // Deep-link: /courses/:id?section=sectionId jumps to that section
  useEffect(() => {
    if (!course) return
    const sectionId = searchParams.get('section')
    if (!sectionId) return
    const idx = course.syllabus.findIndex((s: any) => s.id === sectionId)
    if (idx !== -1) {
      setActiveSectionIndex(idx)
      setShowMCQ(false)
      setVideoEnded(false)
      setQuizStarted(false)
    }
  }, [course, searchParams])

  // Load YouTube IFrame API script once on mount
  useEffect(() => {
    if (!document.getElementById('yt-api-script')) {
      const tag = document.createElement('script')
      tag.id = 'yt-api-script'
      tag.src = 'https://www.youtube.com/iframe_api'
      document.body.appendChild(tag)
    }
  }, [])

  // Initialize (or re-initialize) the YouTube player on each section change
  useEffect(() => {
    if (!course) return
    const videoId = course.syllabus[activeSectionIndex]?.videoId
    if (!videoId) return

    const initPlayer = () => {
      if (playerRef.current) {
        playerRef.current.destroy()
        playerRef.current = null
      }
      if (playerContainerRef.current) {
        playerContainerRef.current.innerHTML = ''
        const div = document.createElement('div')
        div.id = 'yt-player'
        playerContainerRef.current.appendChild(div)
      }
      playerRef.current = new window.YT.Player('yt-player', {
        videoId,
        playerVars: { rel: 0, modestbranding: 1 },
        width: '100%',
        height: '100%',
        events: {
          onStateChange: (event: any) => {
            if (event.data === window.YT.PlayerState.ENDED) {
              setVideoEnded(true)
              // Notify backend that video was watched
              if (authToken && course) {
                const sectionId = course.syllabus[activeSectionIndex]?.id
                if (sectionId) {
                  api.progress.videoComplete(course.id, sectionId, authToken).catch(console.warn)
                }
              }
            }
          },
        },
      })
    }

    if (window.YT && window.YT.Player) {
      initPlayer()
    } else {
      window.onYouTubeIframeAPIReady = initPlayer
    }

    setVideoEnded(false)
    setQuizStarted(false)
    setShowMCQ(false)
  }, [activeSectionIndex, course])

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center pt-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
      </div>
    )
  }

  if (error || !course) {
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

  function handleSectionClick(idx: number) {
    if (!isUnlocked(idx)) return
    setActiveSectionIndex(idx)
    setShowMCQ(false)
    setVideoEnded(false)
    setQuizStarted(false)
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

  function handleRestartFromSection(sectionId: string) {
    const idx = c.syllabus.findIndex(s => s.id === sectionId)
    if (idx !== -1) {
      setActiveSectionIndex(idx)
      setShowMCQ(false)
      setVideoEnded(false)
      setQuizStarted(false)
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
              <div className="aspect-video bg-black relative">
                <div ref={playerContainerRef} className="absolute inset-0 w-full h-full">
                  <div id="yt-player" className="w-full h-full" />
                </div>
              </div>

              <div className="p-5 flex items-center justify-between">
                <div>
                  <p className="font-display text-ink text-lg">{activeSection.title}</p>
                  <p className="font-body text-ink-muted text-sm mt-1">⏱ {activeSection.duration}</p>
                </div>

                {!completedIds.includes(activeSection.id) && !quizStarted && (
                  <div className="text-right">
                    {!videoEnded ? (
                      <div className="flex items-center gap-2 text-ink-muted">
                        <span className="text-xl">🔒</span>
                        <div>
                          <p className="font-body text-xs font-semibold">Quiz Locked</p>
                          <p className="font-body text-xs opacity-60">Finish video to unlock</p>
                        </div>
                      </div>
                    ) : (
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

            <AnimatePresence>
              {showMCQ && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                >
                  <MCQEngine
                    questions={activeSection.mcqs || []}
                    onComplete={handleMCQComplete}
                    onRestartFromSection={handleRestartFromSection}
                    sectionTitle={activeSection.title}
                    courseId={c.id}
                    sectionId={activeSection.id}
                    syllabusMap={Object.fromEntries(c.syllabus.map((s: any) => [s.id, { title: s.title }]))}
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
