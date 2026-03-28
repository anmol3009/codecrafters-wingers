import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const FRAMES = [
  {
    word: 'Learn',
    sub: 'begins every great journey',
    bg: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1920&q=80',
  },
  {
    word: 'Leave',
    sub: 'a mark on the minds of tomorrow',
    bg: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1920&q=80',
  },
  {
    word: 'Achieve & Contribute',
    sub: 'and inspire the world',
    bg: 'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=1920&q=80',
  },
]

const textVariants = {
  enter: (dir: number) => ({
    y: dir > 0 ? 90 : -90,
    opacity: 0,
    rotateX: dir > 0 ? 18 : -18,
    filter: 'blur(4px)',
  }),
  center: {
    y: 0,
    opacity: 1,
    rotateX: 0,
    filter: 'blur(0px)',
  },
  exit: (dir: number) => ({
    y: dir > 0 ? -70 : 70,
    opacity: 0,
    rotateX: dir > 0 ? -12 : 12,
    filter: 'blur(2px)',
  }),
}

interface IntroTextProps {
  onComplete: () => void
}

export default function IntroText({ onComplete }: IntroTextProps) {
  const [current, setCurrent] = useState(0)
  const [dir] = useState(1)
  const isLast = current === FRAMES.length - 1

  // Auto-advance every 2 seconds
  useEffect(() => {
    if (isLast) return
    const t = setTimeout(() => {
      setCurrent(c => c + 1)
    }, 2000)
    return () => clearTimeout(t)
  }, [current, isLast])

  // Auto-complete after last frame shows for 2 seconds
  useEffect(() => {
    if (!isLast) return
    const t = setTimeout(onComplete, 2000)
    return () => clearTimeout(t)
  }, [isLast, onComplete])

  const frame = FRAMES[current]

  return (
    <div className="fixed inset-0 overflow-hidden bg-navy-dark">

      {/* Background — crossfades independently */}
      <AnimatePresence>
        <motion.div
          key={frame.bg}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
        >
          <img
            src={frame.bg}
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />
        </motion.div>
      </AnimatePresence>

      {/* 3D text — slides up/down between frames */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
        style={{ perspective: '900px', perspectiveOrigin: '50% 60%' }}
      >
        <AnimatePresence custom={dir} mode="wait">
          <motion.div
            key={current}
            custom={dir}
            variants={textVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
            className="text-center px-8"
          >
            <h1
              className="font-display text-white leading-none"
              style={{
                fontSize: 'clamp(4rem, 14vw, 13rem)',
                fontWeight: 700,
                letterSpacing: '-0.02em',
              }}
            >
              {frame.word}
            </h1>
            <p
              className="font-body text-white/45 tracking-[0.22em] uppercase mt-5"
              style={{ fontSize: 'clamp(0.6rem, 1.2vw, 0.9rem)' }}
            >
              {frame.sub}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Logo */}
      <div className="absolute top-8 left-8 flex items-center gap-3 z-10">
        <img src="/image.png" alt="Saraswati Logo" className="w-10 h-10 object-contain" />
        <p className="font-display text-black font-bold text-lg">SARASWATI</p>
      </div>

      {/* Frame counter */}
      <div className="absolute top-8 right-8 z-10">
        <span className="font-body text-white/30 text-xs tracking-widest">
          {String(current + 1).padStart(2, '0')} / {String(FRAMES.length).padStart(2, '0')}
        </span>
      </div>

      {/* Last-frame cue */}
      {isLast && (
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <span className="font-body text-white/35 text-xs tracking-widest uppercase">
            Entering the world…
          </span>
        </motion.div>
      )}

      {/* Progress dots — right side */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-2.5 z-10">
        {FRAMES.map((_, i) => (
          <motion.div
            key={i}
            className="rounded-full"
            animate={{
              height: i === current ? 20 : 6,
              width: 6,
              backgroundColor: i === current ? '#FFCBA4' : 'rgba(255,255,255,0.22)',
            }}
            transition={{ duration: 0.3 }}
          />
        ))}
      </div>

      {/* Bottom progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/5 z-10">
        <motion.div
          className="h-full bg-gold"
          animate={{ width: `${((current + 1) / FRAMES.length) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  )
}
