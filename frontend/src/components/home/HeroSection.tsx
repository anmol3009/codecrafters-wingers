import { lazy, Suspense } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '../ui/Button'

const ParticleField = lazy(() => import('./ParticleField'))

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
})

export default function HeroSection() {
  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #FAF3E1 0%, #FFF8F0 40%, #FFFFFF 100%)' }}
    >
      {/* Subtle particle layer */}
      <Suspense fallback={null}>
        <div className="absolute inset-0 opacity-40">
          <ParticleField />
        </div>
      </Suspense>

      {/* Orange radial glow — right side */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 700px 600px at 85% 50%, rgba(250,129,18,0.12) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20 grid lg:grid-cols-2 gap-16 items-center">
        {/* Left content */}
        <div>
          <motion.div
            {...fadeUp(0.05)}
            className="inline-flex items-center gap-2 bg-gold/10 border border-gold/30 rounded-full px-4 py-1.5 mb-8"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
            <span className="font-body text-gold text-xs tracking-widest uppercase">
              AI Root-Cause Learning
            </span>
          </motion.div>

          <motion.h1
            {...fadeUp(0.15)}
            className="font-display text-ink leading-[1.05] mb-6"
            style={{ fontSize: 'clamp(2.8rem, 5vw, 5rem)', fontWeight: 300 }}
          >
            The platform that tells you{' '}
            <em className="not-italic" style={{
              background: 'linear-gradient(135deg, #FA8112, #D4690A)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>why</em>{' '}
            you got it wrong
          </motion.h1>

          <motion.p
            {...fadeUp(0.25)}
            className="font-body text-ink-soft text-lg leading-relaxed mb-10 max-w-lg"
          >
            ConceptIQ detects missing prerequisites, maps your concept graph, and
            rebuilds your learning path in real time. Every wrong answer becomes
            a stronger foundation.
          </motion.p>

          <motion.div {...fadeUp(0.35)} className="flex flex-wrap gap-4 mb-14">
            <Link to="/courses">
              <Button variant="primary" size="lg">Explore Courses</Button>
            </Link>
            <Link to="/mock-test">
              <Button variant="ghost" size="lg">Take a Mock Test</Button>
            </Link>
          </motion.div>

          {/* Metrics */}
          <motion.div {...fadeUp(0.45)} className="flex flex-wrap gap-10">
            {[
              { value: '92%', label: 'Root gap accuracy' },
              { value: '4.8★', label: 'Student rating' },
              { value: '26k+', label: 'Paths rebuilt' },
            ].map(m => (
              <div key={m.label}>
                <p className="font-display text-3xl font-light" style={{ color: '#FA8112' }}>{m.value}</p>
                <p className="font-body text-ink-muted text-sm mt-0.5">{m.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right: concept chain visual */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="hidden lg:flex flex-col items-center gap-0"
        >
          <div className="relative bg-white rounded-3xl shadow-xl border border-ink/8 p-8 w-full max-w-sm">
            <p className="font-body text-ink-muted text-xs uppercase tracking-widest mb-6 text-center">
              Concept Gap Detected
            </p>
            {[
              { label: 'Arithmetic', status: 'ok' },
              { label: 'Algebra Basics', status: 'ok' },
              { label: 'Linear Equations', status: 'weak' },
              { label: 'Quadratic Equations', status: 'weak' },
            ].map((node, i) => (
              <div key={node.label} className="flex flex-col items-center">
                {i > 0 && (
                  <div
                    className="w-px h-6 my-1"
                    style={{ background: node.status === 'weak' ? 'rgba(239,68,68,0.3)' : 'rgba(250,129,18,0.3)' }}
                  />
                )}
                <div
                  className="w-full px-5 py-3 rounded-xl border font-body text-sm text-center"
                  style={node.status === 'weak' ? {
                    background: 'rgba(239,68,68,0.06)',
                    borderColor: 'rgba(239,68,68,0.35)',
                    color: '#dc2626',
                  } : {
                    background: 'rgba(250,129,18,0.07)',
                    borderColor: 'rgba(250,129,18,0.3)',
                    color: '#222222',
                  }}
                >
                  {node.status === 'weak' && <span className="mr-1.5">⚠</span>}
                  {node.label}
                </div>
              </div>
            ))}
            <div
              className="mt-6 flex items-center justify-center gap-2 text-xs font-body py-2.5 px-4 rounded-xl"
              style={{ background: 'rgba(250,129,18,0.1)', color: '#FA8112' }}
            >
              <span>🎯</span> Root cause: Linear Equations
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom fade to white */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none" />
    </section>
  )
}
