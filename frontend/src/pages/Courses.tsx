import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import { DifficultyBadge, Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { useUserProgress } from '../lib/useUserProgress'
import AuthModal from '../components/ui/AuthModal'
import coursesData from '../data/courses.json'

type Course = (typeof coursesData)[0]

interface CourseCardProps {
  course: Course
}

function CourseCard({ course }: CourseCardProps) {
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rotateX = useTransform(my, [-0.5, 0.5], [6, -6])
  const rotateY = useTransform(mx, [-0.5, 0.5], [-6, 6])

  const { isLoggedIn, enrolledCourses, enrollCourse } = useUserProgress()
  const [authOpen, setAuthOpen] = useState(false)
  const isEnrolled = enrolledCourses.includes(course.id)

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    mx.set((e.clientX - rect.left) / rect.width - 0.5)
    my.set((e.clientY - rect.top) / rect.height - 0.5)
  }
  function onMouseLeave() { mx.set(0); my.set(0) }

  function handleEnroll(e: React.MouseEvent) {
    e.preventDefault()
    if (!isLoggedIn) {
      setAuthOpen(true)
      return
    }
    enrollCourse(course.id)
  }

  return (
    <>
      <motion.div
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d', perspective: 800 }}
        whileHover={{ scale: 1.02, y: -4 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="relative group"
      >
        <Link to={`/courses/${course.id}`}>
          <div className="bg-white border-2 border-[#111] overflow-hidden transition-all duration-100 hover:-translate-x-0.5 hover:-translate-y-0.5">
            {/* Cover */}
            <div
              className={`h-40 bg-gradient-to-br ${course.coverGradient} relative overflow-hidden`}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-display text-ink/10 text-8xl font-bold select-none">
                  {course.subject.charAt(0)}
                </span>
              </div>
              <div className="absolute top-3 left-3 flex gap-2">
                <DifficultyBadge difficulty={course.difficulty} />
                {course.mockIncluded && (
                  <Badge variant="gold">Mock ✓</Badge>
                )}
              </div>
              <div className="absolute top-3 right-3">
                <span className="font-display text-ink/90 text-xl font-light">
                  {course.subject.charAt(0)}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <h3 className="font-display text-ink text-xl font-light mb-2 group-hover:text-gold transition-colors">
                {course.title}
              </h3>
              <p className="font-body text-ink-soft text-sm mb-4 leading-relaxed">
                {course.description}
              </p>

              {/* What you'll learn */}
              <div className="mb-4">
                <p className="font-body text-ink-muted text-xs uppercase tracking-wider mb-2">
                  What you'll learn
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {course.outcomes.map(o => (
                    <span
                      key={o}
                      className="font-body text-xs text-ink-soft bg-ink/5 px-2 py-0.5 rounded"
                    >
                      {o}
                    </span>
                  ))}
                </div>
              </div>

              {/* Prerequisites */}
              <div className="mb-5">
                <p className="font-body text-ink-muted text-xs uppercase tracking-wider mb-2">
                  Prerequisites
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {course.prerequisites.map(p => (
                    <span
                      key={p}
                      className="font-body text-xs text-gold/70 bg-gold/10 border border-gold/20 px-2 py-0.5 rounded"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              {/* Meta */}
              <div className="flex items-center gap-4 mb-5 text-ink-muted text-xs font-body">
                <span>⏱ {course.duration}</span>
                <span>📅 {course.validity}</span>
                <span>⭐ {course.rating}</span>
                <span>👥 {course.students.toLocaleString()}</span>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-ink/8">
                <span className="font-display text-ink text-xl">{course.price}</span>
                <Button
                  variant={isEnrolled ? 'ghost' : 'primary'}
                  size="sm"
                  onClick={handleEnroll}
                >
                  {isEnrolled ? 'Continue →' : 'Enroll Now'}
                </Button>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>

      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        onSuccess={() => enrollCourse(course.id)}
      />
    </>
  )
}

const SUBJECTS = ['All', 'Mathematics', 'Physics', 'Chemistry', 'Computer Science']
const DIFFICULTIES = ['All', 'Beginner', 'Intermediate', 'Advanced']

export default function Courses() {
  const [searchParams] = useSearchParams()
  const [subject, setSubject] = useState(searchParams.get('subject') ?? 'All')
  const [difficulty, setDifficulty] = useState('All')
  const [query] = useState(searchParams.get('q') ?? '')

  const filtered = coursesData.filter(c => {
    const matchSubject = subject === 'All' || c.subject === subject
    const matchDifficulty = difficulty === 'All' || c.difficulty === difficulty
    const matchQuery = !query || c.title.toLowerCase().includes(query.toLowerCase())
    return matchSubject && matchDifficulty && matchQuery
  })

  return (
    <div className="min-h-screen bg-white pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-12">
          <p className="font-body text-gold text-sm tracking-widest uppercase mb-3">
            All Courses
          </p>
          <h1
            className="font-display text-ink mb-4"
            style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 300 }}
          >
            Learn with prerequisite awareness
          </h1>
          <p className="font-body text-ink-soft max-w-xl">
            Every course shows its prerequisite concepts so you always know where
            you stand before enrolling.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-6 mb-10">
          <div className="flex gap-2 flex-wrap">
            <p className="font-body text-ink-muted text-sm self-center mr-2">Subject:</p>
            {SUBJECTS.map(s => (
              <button
                key={s}
                onClick={() => setSubject(s)}
                className={`px-4 py-1.5 rounded-full font-body text-sm transition-all ${
                  subject === s
                    ? 'bg-[#FFCBA4] text-[#111] border-2 border-[#111] font-bold'
                    : 'border border-ink/20 text-ink-soft hover:border-gold hover:text-gold bg-white'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="flex gap-2 flex-wrap">
            <p className="font-body text-ink-muted text-sm self-center mr-2">Level:</p>
            {DIFFICULTIES.map(d => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={`px-4 py-1.5 rounded-full font-body text-sm transition-all ${
                  difficulty === d
                    ? 'bg-[#FFCBA4] text-[#111] border-2 border-[#111] font-bold'
                    : 'border border-ink/20 text-ink-soft hover:border-gold hover:text-gold bg-white'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          {filtered.map((course, i) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, duration: 0.4 }}
            >
              <CourseCard course={course} />
            </motion.div>
          ))}
        </motion.div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="font-display text-ink-muted text-2xl">No courses found</p>
            <p className="font-body text-ink-muted mt-2">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </div>
  )
}
