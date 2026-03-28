import { useRef, useState } from 'react'
import type { CSSProperties, PointerEvent } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import SiteNav from '../components/SiteNav'

const cards = [
  { label: 'Algebra basics', x: -180, y: -120, z: 40 },
  { label: 'Linear isolation', x: 120, y: -140, z: -20 },
  { label: 'Graph shifts', x: 220, y: 60, z: 60 },
  { label: 'Quadratics', x: -60, y: 120, z: -40 },
  { label: 'Mock sprint', x: -220, y: 80, z: 30 },
  { label: 'Confidence', x: 40, y: -40, z: 90 },
  { label: 'Teacher view', x: 160, y: 160, z: -60 },
  { label: 'Path reset', x: -140, y: 40, z: -80 },
  { label: 'Root concept', x: 0, y: 0, z: 120 },
]

function OrbitPage() {
  const dragStart = useRef<{ x: number; y: number } | null>(null)
  const [offset, setOffset] = useState({ x: 0, y: 0 })

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    dragStart.current = { x: event.clientX - offset.x, y: event.clientY - offset.y }
  }

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragStart.current) return
    setOffset({
      x: event.clientX - dragStart.current.x,
      y: event.clientY - dragStart.current.y,
    })
  }

  const handlePointerUp = () => {
    dragStart.current = null
  }

  return (
    <motion.main
      className="page orbit"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <SiteNav />
      <section className="orbit-stage">
        <div className="orbit-copy">
          <p className="eyebrow">3D learning space</p>
          <h1>Dispersed insights in an interactive orbit.</h1>
          <p>
            Drag the space to explore every concept card. This is the adaptive
            map SARASWATI builds from each learner.
          </p>
          <div className="hero-actions">
            <Link className="nav-button ghost" to="/globe">
              Back to globe
            </Link>
            <button className="nav-button primary">Request early access</button>
          </div>
        </div>
        <div
          className="orbit-canvas"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          style={{ '--x': `${offset.x}px`, '--y': `${offset.y}px` } as CSSProperties}
        >
          <div className="orbit-grid"></div>
          <div className="orbit-cloud">
            {cards.map((card, index) => (
              <div
                className="orbit-card"
                key={card.label}
                style={
                  {
                    '--i': index,
                    '--cx': `${card.x}px`,
                    '--cy': `${card.y}px`,
                    '--cz': `${card.z}px`,
                  } as CSSProperties
                }
              >
                {card.label}
              </div>
            ))}
          </div>
        </div>
      </section>
    </motion.main>
  )
}

export default OrbitPage
