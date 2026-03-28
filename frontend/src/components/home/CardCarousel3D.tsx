import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'

const COURSES = [
  {
    id: 'algebra',
    icon: '∑',
    category: 'Mathematics',
    title: 'Algebra Foundations',
    description: 'Master variables, equations, and functions — the backbone of all higher mathematics.',
    students: '4,200+',
    rating: '4.9',
    level: 'Beginner',
    href: '/courses',
    color: '#FFE8D0',
  },
  {
    id: 'calculus',
    icon: '∫',
    category: 'Mathematics',
    title: 'Calculus Mastery',
    description: 'Derivatives, integrals, and limits explained from first principles with real applications.',
    students: '3,100+',
    rating: '4.8',
    level: 'Intermediate',
    href: '/courses',
    color: '#D0EAD0',
  },
  {
    id: 'physics',
    icon: '⚛',
    category: 'Physics',
    title: "Newton's Laws & Mechanics",
    description: 'Understand force, motion, and energy through structured problem-solving frameworks.',
    students: '2,800+',
    rating: '4.7',
    level: 'Beginner',
    href: '/courses',
    color: '#D0E4FF',
  },
  {
    id: 'chemistry',
    icon: '🧪',
    category: 'Chemistry',
    title: 'Atomic Theory & Bonding',
    description: 'From subatomic particles to molecular bonds — learn why matter behaves the way it does.',
    students: '2,400+',
    rating: '4.8',
    level: 'Intermediate',
    href: '/courses',
    color: '#FFD0EA',
  },
  {
    id: 'ml',
    icon: '🤖',
    category: 'Computer Science',
    title: 'Machine Learning Basics',
    description: 'Supervised learning, neural nets, and model evaluation — with hands-on Python examples.',
    students: '5,600+',
    rating: '4.9',
    level: 'Intermediate',
    href: '/courses',
    color: '#E8D0FF',
  },
  {
    id: 'bio',
    icon: '🧬',
    category: 'Biology',
    title: 'Cell Biology & Genetics',
    description: 'Explore cell structure, DNA replication, and heredity through interactive concept maps.',
    students: '1,900+',
    rating: '4.6',
    level: 'Beginner',
    href: '/courses',
    color: '#D0FFE8',
  },
]

export default function CardCarousel3D() {
  const [current, setCurrent] = useState(0)
  const [dir, setDir] = useState(1)
  const [paused, setPaused] = useState(false)

  const goTo = useCallback((index: number) => {
    setDir(index > current ? 1 : -1)
    setCurrent(index)
  }, [current])

  const next = useCallback(() => {
    setDir(1)
    setCurrent(c => (c + 1) % COURSES.length)
  }, [])

  const prev = useCallback(() => {
    setDir(-1)
    setCurrent(c => (c - 1 + COURSES.length) % COURSES.length)
  }, [])

  useEffect(() => {
    if (paused) return
    const id = setInterval(next, 10000)
    return () => clearInterval(id)
  }, [paused, next])

  const course = COURSES[current]

  return (
    <div
      className="max-w-5xl mx-auto px-6"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Main card */}
      <div
        className="relative border-2 border-[#111] overflow-hidden"
        style={{ boxShadow: '6px 6px 0 #111', minHeight: 340 }}
      >
        {/* Animated background accent */}
        <AnimatePresence mode="wait">
          <motion.div
            key={course.id + '-bg'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 pointer-events-none"
            style={{ background: course.color }}
          />
        </AnimatePresence>

        {/* Card content */}
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={course.id}
            custom={dir}
            initial={{ x: dir > 0 ? 120 : -120, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: dir > 0 ? -120 : 120, opacity: 0 }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 flex flex-col md:flex-row items-center gap-10 p-10 md:p-14"
          >
            {/* Left: icon + meta */}
            <div className="flex-shrink-0 flex flex-col items-center md:items-start gap-4">
              <div
                className="w-24 h-24 border-2 border-[#111] flex items-center justify-center text-5xl"
                style={{ background: '#fff', boxShadow: '4px 4px 0 #111' }}
              >
                {course.icon}
              </div>
              <span
                className="font-body text-xs font-bold px-3 py-1 border-2 border-[#111] uppercase tracking-widest"
                style={{ background: '#fff', boxShadow: '2px 2px 0 #111' }}
              >
                {course.level}
              </span>
            </div>

            {/* Right: text */}
            <div className="flex-1 text-center md:text-left">
              <p className="font-body text-[#555] text-xs font-bold uppercase tracking-widest mb-2">
                {course.category}
              </p>
              <h3
                className="font-display text-[#111] font-bold mb-4 leading-tight"
                style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)' }}
              >
                {course.title}
              </h3>
              <p className="font-body text-[#444] text-base leading-relaxed mb-6 max-w-lg">
                {course.description}
              </p>
              <div className="flex flex-wrap items-center gap-6 justify-center md:justify-start">
                <span className="font-body text-sm font-bold text-[#111]">⭐ {course.rating}</span>
                <span className="font-body text-sm text-[#555]">{course.students} students</span>
                <Link to={course.href}>
                  <button
                    className="font-body font-bold text-sm px-6 py-2.5 border-2 border-[#111] bg-[#111] text-white transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5"
                    style={{ boxShadow: '3px 3px 0 #555' }}
                  >
                    Explore Course →
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Arrow buttons */}
        <button
          onClick={prev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 border-2 border-[#111] bg-white flex items-center justify-center font-bold text-lg transition-all hover:bg-[#FFCBA4]"
          style={{ boxShadow: '2px 2px 0 #111' }}
        >
          ←
        </button>
        <button
          onClick={next}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 border-2 border-[#111] bg-white flex items-center justify-center font-bold text-lg transition-all hover:bg-[#FFCBA4]"
          style={{ boxShadow: '2px 2px 0 #111' }}
        >
          →
        </button>

        {/* Auto-progress bar */}
        {!paused && (
          <motion.div
            key={course.id + '-bar'}
            className="absolute bottom-0 left-0 h-1 bg-[#111]"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 10, ease: 'linear' }}
          />
        )}
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-2 mt-5">
        {COURSES.map((c, i) => (
          <button
            key={c.id}
            onClick={() => goTo(i)}
            className="border-2 border-[#111] transition-all duration-200"
            style={{
              width: i === current ? 28 : 10,
              height: 10,
              background: i === current ? '#FFCBA4' : '#fff',
              boxShadow: '2px 2px 0 #111',
            }}
          />
        ))}
      </div>
    </div>
  )
}
