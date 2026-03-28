import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const FEATURES = [
  {
    icon: '🧠',
    title: 'Root Cause Detection',
    description:
      'When you get a question wrong, ConceptIQ traces back through the concept graph to find the exact prerequisite you\'re missing — not just the topic, but why.',
    highlight: true,
  },
  {
    icon: '🗺️',
    title: 'Concept Dependency Graph',
    description:
      'Every course is built on a prerequisite tree. See exactly which concepts you need to master before moving forward, visualized as an interactive chain.',
    highlight: false,
  },
  {
    icon: '🔄',
    title: 'Smart Retry System',
    description:
      'Instead of just "try again", ConceptIQ shows your weak node, redirects you to the prerequisite, and gives you a fresh question variant after revision.',
    highlight: false,
  },
  {
    icon: '📊',
    title: 'Confidence Scoring',
    description:
      'Every concept gets a live confidence score based on your attempt history. Track improvement across topics and identify patterns in your mistakes.',
    highlight: false,
  },
  {
    icon: '👩‍🏫',
    title: 'Teacher Insights Dashboard',
    description:
      'Teachers see aggregated weak concepts across the class, enrollment trends, and completion rates — all in one clean dashboard with interactive charts.',
    highlight: false,
  },
  {
    icon: '⏱️',
    title: 'Adaptive Mock Tests',
    description:
      'Timed tests that adjust difficulty based on your history. After completion, get a full scorecard with root cause analysis for every wrong answer.',
    highlight: false,
  },
]

export default function FeaturesSection() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const cards = containerRef.current?.querySelectorAll('.feature-card')
    if (!cards) return

    gsap.fromTo(
      cards,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
          once: true,
        },
      }
    )

    return () => ScrollTrigger.getAll().forEach(t => t.kill())
  }, [])

  return (
    <section className="section-padding bg-white" ref={containerRef}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="font-body text-gold text-sm tracking-widest uppercase mb-4">
            Why ConceptIQ wins
          </p>
          <h2
            className="font-display text-ink"
            style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 300 }}
          >
            Every feature built around the{' '}
            <span className="text-gradient-gold italic">root cause</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className={`feature-card p-7 rounded-2xl border transition-all duration-300 hover:border-gold/40 hover:-translate-y-1 ${
                feature.highlight
                  ? 'border-gold/40 bg-gold/5'
                  : 'border-ink/8 bg-white/3 hover:bg-ink/5'
              }`}
              style={{ opacity: 0 }}
            >
              <div className="text-3xl mb-4">{feature.icon}</div>
              <h3 className="font-display text-ink text-xl font-light mb-3">
                {feature.title}
              </h3>
              <p className="font-body text-ink-soft text-sm leading-relaxed">
                {feature.description}
              </p>
              {feature.highlight && (
                <div className="mt-4 inline-flex items-center gap-2 text-gold text-xs font-body">
                  <div className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
                  Your unique edge
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
