import { useState, useEffect, useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'

const CARDS = [
  {
    id: 'mathematics',
    icon: '∑',
    category: 'MATHEMATICS',
    title: 'Algebra & Calculus',
    subtitle: '12 courses • Beginner to Advanced',
    cta: 'Explore Mathematics →',
    href: '/courses?subject=Mathematics',
    accent: '#6366f1',
  },
  {
    id: 'physics',
    icon: '⚛',
    category: 'PHYSICS',
    title: 'Mechanics & Waves',
    subtitle: '8 courses • Beginner to Intermediate',
    cta: 'Explore Physics →',
    href: '/courses?subject=Physics',
    accent: '#06b6d4',
  },
  {
    id: 'chemistry',
    icon: '🧪',
    category: 'CHEMISTRY',
    title: 'Atoms & Reactions',
    subtitle: '9 courses • Beginner to Advanced',
    cta: 'Explore Chemistry →',
    href: '/courses?subject=Chemistry',
    accent: '#10b981',
  },
  {
    id: 'ai',
    icon: '🤖',
    category: 'COMPUTER SCIENCE',
    title: 'AI & Machine Learning',
    subtitle: '6 courses • Intermediate to Advanced',
    cta: 'Explore CS →',
    href: '/courses?subject=Computer Science',
    accent: '#f43f5e',
  },
  {
    id: 'mock',
    icon: '📝',
    category: 'ASSESSMENT',
    title: 'Mock Test Sprint',
    subtitle: 'Timed practice with concept diagnosis',
    cta: 'Start a Mock Test →',
    href: '/mock-test',
    accent: '#FFCBA4',
  },
]

const CARD_COUNT = CARDS.length
const RADIUS = 420

interface CarouselCardProps {
  card: (typeof CARDS)[0]
  index: number
  rotation: number
}

function CarouselCard({ card, index, rotation }: CarouselCardProps) {
  const baseAngle = (index / CARD_COUNT) * 360
  const angle = baseAngle + rotation
  const normalizedAngle = ((angle % 360) + 360) % 360
  const distanceFromFront = Math.abs(normalizedAngle > 180 ? normalizedAngle - 360 : normalizedAngle)
  const opacity = Math.max(0.1, 1 - (distanceFromFront / 180) * 0.85)
  const scale = 1 - (distanceFromFront / 180) * 0.2

  return (
    <div
      style={{
        position: 'absolute',
        width: 260,
        height: 340,
        left: '50%',
        top: '50%',
        marginLeft: -130,
        marginTop: -170,
        transform: `rotateY(${baseAngle + rotation}deg) translateZ(${RADIUS}px)`,
        opacity,
        scale,
        transformStyle: 'preserve-3d',
        willChange: 'transform',
        transition: 'opacity 0.1s',
      }}
    >
      <Link to={card.href}>
        <div
          className="w-full h-full rounded-2xl flex flex-col justify-between p-7 cursor-pointer group"
          style={{
            background: 'rgba(34, 34, 34, 0.8)',
            border: '1px solid rgba(255, 230, 0, 0.35)',
            backdropFilter: 'blur(16px)',
            boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
          }}
        >
          {/* Top: category + icon */}
          <div>
            <p className="font-body text-gold/70 text-xs tracking-widest uppercase mb-4">
              {card.category}
            </p>
            <div
              className="text-5xl mb-4"
              style={{ color: card.accent, fontFamily: 'serif' }}
            >
              {card.icon}
            </div>
          </div>

          {/* Middle: title */}
          <div>
            <h3 className="font-display text-white text-2xl font-light leading-tight mb-2">
              {card.title}
            </h3>
            <p className="font-body text-white/40 text-sm">{card.subtitle}</p>
          </div>

          {/* Bottom: CTA */}
          <div
            className="pt-5 border-t text-sm font-body transition-all duration-300 group-hover:text-gold"
            style={{ borderColor: 'rgba(255, 230, 0, 0.2)', color: 'rgba(255, 230, 0, 0.7)' }}
          >
            {card.cta}
          </div>
        </div>
      </Link>
    </div>
  )
}

export default function CardCarousel3D() {
  const dragX = useMotionValue(0)
  const springX = useSpring(dragX, { stiffness: 55, damping: 18, mass: 1.3 })
  const rotationDeg = useTransform(springX, (x) => x * 0.15)

  const [rotation, setRotation] = useState(0)
  const lastDragRef = useRef(0)

  useEffect(() => {
    return rotationDeg.on('change', val => setRotation(val))
  }, [rotationDeg])

  const snapToNearest = () => {
    const step = 360 / CARD_COUNT
    const currentRot = rotationDeg.get()
    const nearestCard = Math.round(currentRot / step)
    const snapDeg = nearestCard * step
    dragX.set(snapDeg / 0.15)
  }

  const [activeIndex, setActiveIndex] = useState(0)
  useEffect(() => {
    const step = 360 / CARD_COUNT
    const normalized = (((-rotation) % 360) + 360) % 360
    const idx = Math.round(normalized / step) % CARD_COUNT
    setActiveIndex((CARD_COUNT - idx) % CARD_COUNT)
  }, [rotation])

  return (
    <div className="relative w-full overflow-hidden" style={{ height: 480 }}>
      {/* Drag capture layer */}
      <motion.div
        className="absolute inset-0 cursor-grab active:cursor-grabbing z-10"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.04}
        onDrag={(_, info) => {
          const delta = info.delta.x
          lastDragRef.current += delta
          dragX.set(dragX.get() + delta)
        }}
        onDragEnd={snapToNearest}
      />

      {/* 3D scene */}
      <div
        style={{
          perspective: '1200px',
          perspectiveOrigin: '50% 50%',
          width: '100%',
          height: '100%',
          position: 'absolute',
          inset: 0,
        }}
      >
        <div
          style={{
            transformStyle: 'preserve-3d',
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: 0,
            height: 0,
          }}
        >
          {CARDS.map((card, i) => (
            <CarouselCard
              key={card.id}
              card={card}
              index={i}
              rotation={rotation}
            />
          ))}
        </div>
      </div>

      {/* Navigation dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20 pointer-events-none">
        {CARDS.map((_, i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full transition-all duration-300"
            style={{
              background: i === activeIndex ? '#FFCBA4' : 'rgba(255,255,255,0.2)',
              width: i === activeIndex ? 20 : 6,
            }}
          />
        ))}
      </div>

      {/* Drag hint */}
      <p className="absolute bottom-4 right-6 text-white/20 font-body text-xs z-20 pointer-events-none">
        drag to explore
      </p>
    </div>
  )
}
