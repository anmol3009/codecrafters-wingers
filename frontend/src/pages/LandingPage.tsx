import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import SiteNav from '../components/SiteNav'

const textSteps = [
  'Root-cause learning for every wrong answer.',
  'Reveal missing prerequisites in seconds.',
  'Rebuild the right path instantly.',
]

function LandingPage() {
  const [index, setIndex] = useState(0)
  const phrases = useMemo(() => textSteps, [])

  useEffect(() => {
    const interval = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % phrases.length)
    }, 3200)
    return () => window.clearInterval(interval)
  }, [phrases.length])

  return (
    <motion.main
      className="page landing"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <SiteNav />
      <div className="video-stage">
        <video className="video-bg" autoPlay muted loop playsInline>
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
        <div className="video-gradient"></div>
        <div className="video-overlay"></div>
        <div className="video-text">
          <p className="eyebrow">SARASWATI</p>
          <h1>
            AI-powered learning that finds the why, not just the what.
          </h1>
          <motion.p
            key={index}
            className="changing-text"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
          >
            {phrases[index]}
          </motion.p>
          <div className="hero-actions">
            <Link className="nav-button primary" to="/globe">
              Enter experience
            </Link>
            <button className="nav-button ghost">Watch intro</button>
          </div>
        </div>
      </div>
      <div className="scroll-hint">
        <span></span>
        <p>Scroll or continue</p>
      </div>
    </motion.main>
  )
}

export default LandingPage
