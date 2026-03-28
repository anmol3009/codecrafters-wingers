import { lazy, Suspense } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '../ui/Button'

const ParticleField = lazy(() => import('./ParticleField'))

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] },
})

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-white">
      <Suspense fallback={null}>
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <ParticleField />
        </div>
      </Suspense>

      {/* Peach blob top-right */}
      <div
        className="absolute top-0 right-0 w-[520px] h-[520px] pointer-events-none"
        style={{ background: '#FFCBA4', clipPath: 'polygon(100% 0, 100% 100%, 30% 0)', zIndex: 0 }}
      />
      {/* Peach blob bottom-left */}
      <div
        className="absolute bottom-0 left-0 w-[320px] h-[320px] pointer-events-none"
        style={{ background: '#FFE8D0', clipPath: 'polygon(0 100%, 100% 100%, 0 20%)', zIndex: 0 }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6 pt-32 pb-20 text-center">
        <motion.div
          {...fadeUp(0.05)}
          className="inline-flex items-center gap-2 bg-[#FFCBA4] border-2 border-[#111] px-4 py-1.5 mb-8"
          style={{ boxShadow: '3px 3px 0 #111' }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-[#111] animate-pulse" />
          <span className="font-body text-[#111] text-xs font-bold tracking-widest uppercase">
            AI Root-Cause Learning
          </span>
        </motion.div>

        <motion.h1
          {...fadeUp(0.15)}
          className="font-display text-[#111] leading-[1.02] mb-6 mx-auto"
          style={{ fontSize: 'clamp(3rem, 7vw, 6.5rem)', fontWeight: 700, maxWidth: '900px' }}
        >
          The platform that tells you{' '}
          <span className="relative inline-block">
            <span className="relative z-10 italic">why</span>
            <span
              className="absolute bottom-1 h-5 bg-[#FFCBA4]"
              style={{ left: '-4px', right: '-4px', zIndex: 0 }}
            />
          </span>{' '}
          you got it wrong
        </motion.h1>

        <motion.p
          {...fadeUp(0.25)}
          className="font-body text-[#555] text-xl leading-relaxed mb-10 mx-auto"
          style={{ maxWidth: '600px' }}
        >
          ConceptIQ detects missing prerequisites, maps your concept graph, and
          rebuilds your learning path in real time. Every wrong answer becomes
          a stronger foundation.
        </motion.p>

        <motion.div {...fadeUp(0.35)} className="flex flex-wrap justify-center gap-4 mb-16">
          <Link to="/courses">
            <Button variant="primary" size="lg">Explore Courses →</Button>
          </Link>
          <Link to="/mock-test">
            <Button variant="ghost" size="lg">Take a Mock Test</Button>
          </Link>
        </motion.div>

        {/* Metrics row */}
        <motion.div {...fadeUp(0.45)} className="flex flex-wrap justify-center gap-6">
          {[
            { value: '92%', label: 'Root gap accuracy' },
            { value: '4.8★', label: 'Student rating' },
            { value: '26k+', label: 'Paths rebuilt' },
            { value: '12+', label: 'Subjects covered' },
          ].map(m => (
            <div
              key={m.label}
              className="bg-[#FFCBA4] border-2 border-[#111] px-6 py-4 min-w-[120px]"
              style={{ boxShadow: '4px 4px 0 #111' }}
            >
              <p className="font-display text-[#111] text-3xl font-bold">{m.value}</p>
              <p className="font-body text-[#555] text-xs mt-1">{m.label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none" />
    </section>
  )
}
