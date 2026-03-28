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
      {/* Particle field — very subtle */}
      <Suspense fallback={null}>
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <ParticleField />
        </div>
      </Suspense>

      {/* Yellow blob top-right */}
      <div
        className="absolute top-0 right-0 w-[520px] h-[520px] pointer-events-none"
        style={{ background: '#FFCBA4', clipPath: 'polygon(100% 0, 100% 100%, 30% 0)', zIndex: 0 }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20 grid lg:grid-cols-2 gap-16 items-center">
        {/* Left */}
        <div>
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
            className="font-display text-[#111] leading-[1.02] mb-6"
            style={{ fontSize: 'clamp(2.8rem, 5vw, 5rem)', fontWeight: 700 }}
          >
            The platform that<br />
            tells you{' '}
            <span className="relative inline-block">
              <span className="relative z-10 italic">why</span>
              <span
                className="absolute inset-x-0 bottom-1 h-4 bg-[#FFCBA4] -z-0"
                style={{ left: '-4px', right: '-4px' }}
              />
            </span>{' '}
            you<br />got it wrong
          </motion.h1>

          <motion.p
            {...fadeUp(0.25)}
            className="font-body text-[#444] text-lg leading-relaxed mb-10 max-w-lg"
          >
            ConceptIQ detects missing prerequisites, maps your concept graph, and
            rebuilds your learning path in real time. Every wrong answer becomes
            a stronger foundation.
          </motion.p>

          <motion.div {...fadeUp(0.35)} className="flex flex-wrap gap-4 mb-14">
            <Link to="/courses">
              <Button variant="primary" size="lg">Explore Courses →</Button>
            </Link>
            <Link to="/mock-test">
              <Button variant="ghost" size="lg">Take a Mock Test</Button>
            </Link>
          </motion.div>

          {/* Metrics */}
          <motion.div {...fadeUp(0.45)} className="flex flex-wrap gap-8">
            {[
              { value: '92%', label: 'Root gap accuracy' },
              { value: '4.8★', label: 'Student rating' },
              { value: '26k+', label: 'Paths rebuilt' },
            ].map(m => (
              <div
                key={m.label}
                className="bg-[#FFCBA4] border-2 border-[#111] px-5 py-3"
                style={{ boxShadow: '3px 3px 0 #111' }}
              >
                <p className="font-display text-[#111] text-2xl font-bold">{m.value}</p>
                <p className="font-body text-[#444] text-xs mt-0.5">{m.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right: Concept chain card */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="hidden lg:block"
        >
          <div
            className="bg-white border-2 border-[#111] p-8 w-full max-w-sm mx-auto"
            style={{ boxShadow: '8px 8px 0 #111' }}
          >
            <div className="flex items-center justify-between mb-6">
              <p className="font-body text-[#111] text-xs font-bold uppercase tracking-widest">Concept Gap Detected</p>
              <span className="bg-red-400 text-white text-xs font-bold px-2 py-0.5 border border-red-600">ALERT</span>
            </div>
            {[
              { label: 'Arithmetic', status: 'ok' },
              { label: 'Algebra Basics', status: 'ok' },
              { label: 'Linear Equations', status: 'weak' },
              { label: 'Quadratic Equations', status: 'weak' },
            ].map((node, i) => (
              <div key={node.label} className="flex flex-col items-center">
                {i > 0 && (
                  <div className="w-0.5 h-5 my-0.5" style={{ background: node.status === 'weak' ? '#ef4444' : '#FFCBA4' }} />
                )}
                <div
                  className="w-full px-4 py-2.5 border-2 font-body text-sm text-center font-semibold"
                  style={node.status === 'weak' ? {
                    background: '#fef2f2',
                    borderColor: '#ef4444',
                    color: '#dc2626',
                    boxShadow: '3px 3px 0 #dc2626',
                  } : {
                    background: '#FFFAF6',
                    borderColor: '#111',
                    color: '#111',
                    boxShadow: '3px 3px 0 #111',
                  }}
                >
                  {node.status === 'weak' && '⚠ '}{node.label}
                </div>
              </div>
            ))}
            <div
              className="mt-6 flex items-center justify-center gap-2 text-xs font-bold py-2.5 px-4 bg-[#FFCBA4] border-2 border-[#111]"
              style={{ boxShadow: '3px 3px 0 #111' }}
            >
              🎯 Root cause: Linear Equations
            </div>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none" />
    </section>
  )
}
