import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '../components/ui/Button'
import { CircularProgress } from '../components/ui/CircularProgress'
import { DifficultyBadge } from '../components/ui/Badge'
import { useUserProgress } from '../lib/useUserProgress'
import { getSuggestedRevisionPath, initConceptGraph } from '../lib/conceptEngine'
import { api } from '../lib/api'

export default function MyCourses() {
  const { enrolledCourses, completedSections, weakConcepts, confidenceScores, authToken } = useUserProgress()
  const [enrolled, setEnrolled] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [revisionPath, setRevisionPath] = useState<string[]>([])

  useEffect(() => {
    async function loadData() {
      if (!authToken) {
        setLoading(false)
        return
      }
      try {
        await initConceptGraph()
        const [coursesRes] = await Promise.all([
          api.enrollment.myCourses(authToken)
        ])
        setEnrolled(coursesRes.courses)
        
        if (weakConcepts.length > 0) {
          setRevisionPath(getSuggestedRevisionPath(weakConcepts))
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [authToken, weakConcepts])

  return (
    <div className="min-h-screen bg-white pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-12">
          <p className="font-body text-gold text-sm tracking-widest uppercase mb-3">My Learning</p>
          <h1
            className="font-display text-ink mb-4"
            style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 300 }}
          >
            Your courses &amp; progress
          </h1>
        </div>

        {loading ? (
          <div className="flex justify-center py-24">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
          </div>
        ) : enrolled.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-6xl mb-6">📚</div>
            <h2 className="font-display text-ink-soft text-2xl mb-4">No courses yet</h2>
            <p className="font-body text-ink-muted mb-8">Enroll in a course to start building your concept graph</p>
            <Link to="/courses"><Button variant="primary" size="lg">Browse Courses</Button></Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Courses (2/3 width) */}
            <div className="lg:col-span-2 space-y-5">
              {enrolled.map((course, i) => {
                const completed = completedSections[course.id] ?? []
                const total = course.syllabus.length
                const progress = Math.round((completed.length / total) * 100)
                const lastSection = completed.length > 0
                  ? course.syllabus.find((s: any) => s.id === completed[completed.length - 1])?.title ?? '—'
                  : 'Not started'

                const courseWeakConcepts = weakConcepts.filter(w =>
                  course.prerequisites.some((p: string) => p.toLowerCase().includes(w.toLowerCase())) ||
                  w.toLowerCase().includes(course.subject.toLowerCase().split(' ')[0])
                )

                return (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="glass-navy rounded-2xl p-6"
                  >
                    <div className="flex items-start gap-5">
                      {/* Progress ring */}
                      <CircularProgress value={progress} size={72} />

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-display text-ink text-xl font-light">{course.title}</h3>
                          <DifficultyBadge difficulty={course.difficulty} />
                        </div>
                        <p className="font-body text-ink-muted text-sm mb-3">
                          Last: <span className="text-ink-soft">{lastSection}</span>
                        </p>

                        {/* Progress bar */}
                        <div className="h-1.5 bg-ink/5 rounded-full mb-3">
                          <motion.div
                            className="h-full bg-gold rounded-full"
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                          />
                        </div>

                        <p className="font-body text-ink-muted text-xs mb-4">
                          {completed.length} / {total} sections complete
                        </p>

                        {/* Weak areas */}
                        {courseWeakConcepts.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {courseWeakConcepts.map(c => (
                              <span
                                key={c}
                                className="font-body text-xs text-red-400 bg-red-500/10 border border-red-500/20 px-2.5 py-0.5 rounded-full"
                              >
                                ⚠ {c}
                              </span>
                            ))}
                          </div>
                        )}

                        <Link to={`/courses/${course.id}`}>
                          <Button variant="primary" size="sm">
                            {progress === 0 ? 'Start Course' : progress === 100 ? 'Review Course' : 'Resume →'}
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* Sidebar (1/3) */}
            <div className="space-y-5">
              {/* Weak concepts */}
              {weakConcepts.length > 0 && (
                <div className="glass-navy rounded-2xl p-6">
                  <h3 className="font-display text-ink text-lg mb-4">Weak Concepts</h3>
                  <div className="space-y-3">
                    {weakConcepts.slice(0, 5).map(concept => {
                      const confidence = confidenceScores[concept] ?? 45
                      return (
                        <div key={concept}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-body text-ink-soft text-sm">{concept}</span>
                            <span className={`font-body text-xs ${confidence < 50 ? 'text-red-400' : 'text-amber-400'}`}>
                              {confidence}%
                            </span>
                          </div>
                          <div className="h-1 bg-ink/5 rounded-full">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                confidence < 50 ? 'bg-red-500' : 'bg-amber-500'
                              }`}
                              style={{ width: `${confidence}%` }}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Revision path */}
              {revisionPath.length > 0 && (
                <div className="glass-navy rounded-2xl p-6">
                  <h3 className="font-display text-ink text-lg mb-4">Suggested Revision Path</h3>
                  <div className="space-y-2">
                    {revisionPath.map((concept, i) => (
                      <div key={concept} className="flex items-center gap-3">
                        {i > 0 && <div className="w-px h-3 bg-gold/20 ml-3" />}
                        <div className="flex items-center gap-2 bg-gold/10 border border-gold/20 rounded-lg px-3 py-2 text-sm font-body text-gold/80 w-full">
                          <span className="text-gold/40 text-xs">{i + 1}.</span>
                          {concept}
                        </div>
                      </div>
                    ))}
                  </div>
                  <Link to="/mock-test" className="block mt-5">
                    <Button variant="ghost" size="sm" className="w-full">
                      Practice with Mock Test
                    </Button>
                  </Link>
                </div>
              )}

              {/* Quick links */}
              <div className="glass-navy rounded-2xl p-6">
                <h3 className="font-display text-ink text-lg mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <Link to="/courses">
                    <Button variant="ghost" size="sm" className="w-full justify-start">
                      + Enroll in new course
                    </Button>
                  </Link>
                  <Link to="/mock-test">
                    <Button variant="ghost" size="sm" className="w-full justify-start">
                      📝 Take a mock test
                    </Button>
                  </Link>
                  <Link to="/teacher-insights">
                    <Button variant="ghost" size="sm" className="w-full justify-start">
                      📊 View class insights
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
