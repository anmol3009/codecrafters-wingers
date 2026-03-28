import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import { DifficultyBadge, Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { useUserProgress } from '../lib/useUserProgress'
import AuthModal from '../components/ui/AuthModal'
import PaymentModal from '../components/ui/PaymentModal'
import { api } from '../lib/api'

type Course = {
  id: string
  title: string
  subject: string
  level: string
  description: string
  price: string
  duration: string
  validity: string
  rating: number
  students: number
  thumbnail: string
  prerequisites: string[]
}

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
  const [paymentOpen, setPaymentOpen] = useState(false)
  const isEnrolled = enrolledCourses.includes(course.id)

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    mx.set((e.clientX - rect.left) / rect.width - 0.5)
    my.set((e.clientY - rect.top) / rect.height - 0.5)
  }
  function onMouseLeave() { mx.set(0); my.set(0) }

  function handleEnroll(e: React.MouseEvent) {
    e.preventDefault()
    if (isEnrolled) return
    if (!isLoggedIn) {
      setAuthOpen(true)
      return
    }
    setPaymentOpen(true)
  }

  const handlePaymentSuccess = () => {
    enrollCourse(course.id)
    setPaymentOpen(false)
  }

  return (
    <>
      <motion.div
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d', perspective: 800 }}
        whileHover={{ scale: 1.02, y: -4 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="relative group h-full"
      >
        <Link to={`/courses/${course.id}`} className="block h-full">
          <div className="bg-white border-2 border-[#111] flex flex-col h-full min-h-[540px] max-w-xl mx-auto overflow-hidden transition-all duration-100 hover:-translate-x-0.5 hover:-translate-y-0.5">
            {/* Cover */}
            <div className="h-40 relative overflow-hidden bg-white group">
              {course.thumbnail ? (
                <img 
                  src={course.thumbnail} 
                  alt={course.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-50 group-hover:bg-gray-100 transition-colors">
                  <span className="font-display text-ink/10 text-8xl font-bold select-none">
                    {course.subject.charAt(0)}
                  </span>
                </div>
              )}
              {/* Overlay gradient to ensure badges remain legible */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute top-3 left-3 flex gap-2">
                <DifficultyBadge difficulty={course.level} />
              </div>
              <div className="absolute top-3 right-3 font-display text-white text-xl font-light drop-shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                {course.subject.charAt(0)}
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-col flex-1 p-6">
              <h3 className="font-display text-ink text-xl font-light mb-2 group-hover:text-gold transition-colors">
                {course.title}
              </h3>
              <p className="font-body text-ink-soft text-sm mb-4 leading-relaxed">
                {course.description}
              </p>

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

              {/* Footer - always at the bottom */}
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-ink/8">
                <span className="font-display text-ink text-xl">${course.price}</span>
                <Button
                  variant={isEnrolled ? 'ghost' : 'primary'}
                  size="sm"
                  onClick={handleEnroll}
                  className={
                    isEnrolled
                      ? 'border border-black bg-white text-black font-semibold shadow-[2px_2px_0_#111] hover:bg-ink/5'
                      : 'border border-black bg-[#FFCBA4] text-black font-semibold shadow-[2px_2px_0_#111] hover:bg-[#ffb77a]'
                  }
                  style={{ minWidth: 140 }}
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
        onSuccess={() => setPaymentOpen(true)}
      />

      <PaymentModal
        open={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        onSuccess={handlePaymentSuccess}
        courseTitle={course.title}
        price={course.price}
        courseId={course.id}
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
  
  // New: Fetch from backend API
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    api.courses.list()
      .then(data => {
        setCourses(data.courses as Course[])
      })
      .catch(err => {
        console.error("Failed to fetch courses:", err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const filtered = courses.filter(c => {
    const matchSubject = subject === 'All' || c.subject === subject
    const matchDifficulty = difficulty === 'All' || c.level === difficulty
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

        {/* Grid Container */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
          </div>
        ) : (
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
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="font-display text-ink-muted text-2xl">No courses found</p>
            <p className="font-body text-ink-muted mt-2">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </div>
  )
}
