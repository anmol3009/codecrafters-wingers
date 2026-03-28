import { useRef, useEffect } from 'react'

const CARDS = [
  { category: 'SCHOOL LIFE', title: 'Algebra & Calculus', img: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=500&q=80' },
  { category: 'SCHOOL LIFE', title: "Newton's Laws", img: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=500&q=80' },
  { category: 'CORE FEATURE', title: 'AI Root Cause Engine', img: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=500&q=80' },
  { category: 'SCHOOL LIFE', title: 'Concept Maps', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80' },
  { category: 'SCHOOL LIFE', title: 'Atomic Theory', img: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=500&q=80' },
  { category: 'ASSESSMENT', title: 'Adaptive Mock Tests', img: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=500&q=80' },
  { category: 'DASHBOARD', title: 'Teacher Insights', img: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=500&q=80' },
  { category: 'SCHOOL LIFE', title: 'ML & Algorithms', img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&q=80' },
  { category: 'PERSONAL', title: 'Learning Journey', img: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=500&q=80' },
  { category: 'SCHOOL LIFE', title: 'Life Sciences', img: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=500&q=80' },
  { category: 'ASSESSMENT', title: 'Final Scorecard', img: 'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=500&q=80' },
  { category: 'CORE FEATURE', title: 'Smart Revision Path', img: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=500&q=80' },
  { category: 'SCHOOL LIFE', title: 'World History', img: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=500&q=80' },
  { category: 'SCHOOL LIFE', title: 'Organic Chemistry', img: 'https://images.unsplash.com/photo-1628863353691-0071c8c1874c?w=500&q=80' },
  { category: 'ENROLMENTS', title: 'My Progress', img: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=500&q=80' },
  { category: 'SCHOOL LIFE', title: 'Quadratic Equations', img: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=500&q=80' },
  { category: 'ASSESSMENT', title: 'Confidence Score', img: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=500&q=80' },
  { category: 'SCHOOL LIFE', title: 'Deep Learning', img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&q=80' },
  { category: 'CAMPUS', title: 'Study Spaces', img: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=500&q=80' },
  { category: 'SCHOOL LIFE', title: 'Class Discussions', img: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=500&q=80' },
  { category: 'LEARNING', title: 'Prerequisite Graphs', img: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=500&q=80' },
  { category: 'ENROLMENTS', title: 'Join ConceptIQ', img: 'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=500&q=80' },
]

const N = CARDS.length
const RADIUS = 500       // sphere radius in CSS px
const PERSPECTIVE = 980  // perspective distance
const CARD_W = 185
const CARD_H = 240

function getPositions(n: number) {
  const goldenAngle = Math.PI * (3 - Math.sqrt(5))
  return Array.from({ length: n }, (_, i) => {
    const yNorm = 1 - (i / (n - 1)) * 2
    const pitch = Math.asin(yNorm) * (180 / Math.PI)
    const yaw = (goldenAngle * i * 180) / Math.PI
    return { yaw, pitch }
  })
}

const positions = getPositions(N)

interface GlobeSceneProps {
  onContinue: () => void
}

export default function GlobeScene({ onContinue }: GlobeSceneProps) {
  const globeRef = useRef<HTMLDivElement>(null)
  const angleRef = useRef(0)
  const rafRef = useRef(0)

  useEffect(() => {
    const tick = () => {
      angleRef.current += 0.06
      if (globeRef.current) {
        globeRef.current.style.transform = `rotateY(${angleRef.current}deg)`
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  return (
    <div
      className="relative w-full h-screen overflow-hidden select-none"
      style={{
        background: '#1a1a1a',
        perspective: `${PERSPECTIVE}px`,
        perspectiveOrigin: '50% 48%',
      }}
    >
      {/* Sphere */}
      <div
        ref={globeRef}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: 0,
          height: 0,
          transformStyle: 'preserve-3d',
        }}
      >
        {CARDS.map((card, i) => {
          const { yaw, pitch } = positions[i]
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                width: CARD_W,
                height: CARD_H,
                left: -CARD_W / 2,
                top: -CARD_H / 2,
                transform: `rotateY(${yaw}deg) rotateX(${-pitch}deg) translateZ(${RADIUS}px)`,
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                borderRadius: 8,
                overflow: 'hidden',
                boxShadow: '0 6px 30px rgba(0,0,0,0.6)',
              }}
            >
              {/* Full-bleed photo */}
              <img
                src={card.img}
                alt=""
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: 'grayscale(90%) brightness(0.55)',
                }}
              />
              {/* Dark gradient overlay — heavier at bottom */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to bottom, rgba(8,24,48,0.1) 0%, rgba(8,24,48,0.75) 100%)',
                }}
              />
              {/* Text on top of photo */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: '12px 14px',
                }}
              >
                <p style={{
                  fontSize: 8,
                  color: '#FFCBA4',
                  fontFamily: 'Inter, sans-serif',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  marginBottom: 5,
                  opacity: 0.9,
                }}>
                  {card.category}
                </p>
                <p style={{
                  fontSize: 15,
                  color: '#ffffff',
                  fontFamily: '"Cormorant Garamond", Georgia, serif',
                  fontWeight: 500,
                  lineHeight: 1.2,
                }}>
                  {card.title}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Logo */}
      <div className="absolute top-8 left-8 z-20 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gold flex items-center justify-center flex-shrink-0">
          <span className="font-display text-navy-dark font-bold text-lg">CQ</span>
        </div>
        <p className="font-display text-white font-semibold text-lg">ConceptIQ</p>
      </div>

      {/* Hamburger */}
      <div className="absolute top-8 right-8 z-20">
        <div className="w-12 h-12 rounded-full bg-white/10 border border-white/15 flex items-center justify-center backdrop-blur-sm">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </div>
      </div>

      {/* Radial vignette to make center text readable */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: 'radial-gradient(ellipse 55% 50% at 50% 48%, rgba(8,24,48,0.68) 0%, transparent 100%)',
        }}
      />

      {/* Center: headline + continue */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none">
        <p className="font-body text-white/40 text-xs tracking-[0.3em] uppercase mb-4">
          Who are Deep Learners who
        </p>
        <h2
          className="font-display text-white text-center"
          style={{
            fontSize: 'clamp(2.8rem, 6vw, 5.5rem)',
            fontWeight: 300,
            lineHeight: 1.05,
            letterSpacing: '-0.01em',
            textShadow: '0 2px 40px rgba(8,24,48,0.8)',
          }}
        >
          Inspire the World
        </h2>

        <button
          onClick={onContinue}
          className="pointer-events-auto mt-10 flex items-center justify-center font-body text-sm text-white transition-all duration-400 hover:scale-105"
          style={{
            width: 100,
            height: 100,
            borderRadius: '50%',
            border: '1.5px solid rgba(255,255,255,0.5)',
            background: 'transparent',
            letterSpacing: '0.04em',
            backdropFilter: 'blur(2px)',
          }}
          onMouseEnter={e => {
            const el = e.currentTarget as HTMLButtonElement
            el.style.background = 'rgba(255,255,255,0.08)'
            el.style.borderColor = 'rgba(255,255,255,0.9)'
          }}
          onMouseLeave={e => {
            const el = e.currentTarget as HTMLButtonElement
            el.style.background = 'transparent'
            el.style.borderColor = 'rgba(255,255,255,0.5)'
          }}
        >
          Continue
        </button>
      </div>
    </div>
  )
}
