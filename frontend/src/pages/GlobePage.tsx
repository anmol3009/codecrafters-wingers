import { motion } from 'framer-motion'
import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import SiteNav from '../components/SiteNav'

const cards = [
  'Concept map',
  'Mock test',
  'Teacher insights',
  'Adaptive path',
  'Weak node',
  'Confidence score',
  'Video checkpoint',
  'AI feedback',
]

function GlobePage() {
  return (
    <motion.main
      className="page globe"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <SiteNav />
      <section className="globe-stage">
        <div className="globe-copy">
          <p className="eyebrow">Global concept view</p>
          <h1>Every learner becomes a living knowledge globe.</h1>
          <p>
            Each card represents a concept signal. SARASWATI rotates the full
            picture so teachers and learners can see the weak links instantly.
          </p>
          <div className="hero-actions">
            <Link className="nav-button ghost" to="/">
              Back to intro
            </Link>
            <Link className="nav-button primary" to="/orbit">
              Next experience
            </Link>
          </div>
        </div>
        <div className="globe-wrap">
          <div className="globe-core"></div>
          <div className="globe-ring"></div>
          <div className="globe-ring ring-two"></div>
          <div className="globe-rotator">
            {cards.map((label, index) => (
              <div
                className="globe-card"
                key={label}
                style={{ '--i': index } as CSSProperties}
              >
                {label}
              </div>
            ))}
          </div>
        </div>
      </section>
    </motion.main>
  )
}

export default GlobePage
