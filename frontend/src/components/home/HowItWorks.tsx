import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Button } from '../ui/Button'

gsap.registerPlugin(ScrollTrigger)

const STEPS = [
  {
    number: '01',
    title: 'Enroll in a Course',
    description: 'Pick a subject. We show prerequisite tags so you know exactly what knowledge you need before starting.',
    detail: 'Prerequisites: Arithmetic, Algebra Basics',
  },
  {
    number: '02',
    title: 'Watch & Answer MCQs',
    description: 'After each video section, answer a multiple-choice question. Sections are locked until you pass.',
    detail: 'No skipping — every concept matters',
  },
  {
    number: '03',
    title: 'Wrong Answer? We Dig Deeper',
    description: 'Tell us your approach. Our AI maps it to the concept graph and identifies your root cause gap.',
    detail: '"You\'re missing Variable Isolation (Linear Equations)"',
    highlight: true,
  },
  {
    number: '04',
    title: 'Rebuild Your Path',
    description: 'SARASWATI redirects you to the prerequisite concept and gives you a fresh question. Repeat until confident.',
    detail: 'New question variant each retry',
  },
]

export default function HowItWorks() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const items = containerRef.current?.querySelectorAll('.step-item')
    if (!items) return

    items.forEach((item) => {
      gsap.fromTo(
        item,
        { opacity: 0, x: -50, y: 20 },
        {
          opacity: 1,
          x: 0,
          y: 0,
          duration: 0.6,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 88%',
            once: true,
          },
        }
      )
    })

    return () => ScrollTrigger.getAll().forEach(t => t.kill())
  }, [])

  return (
    <section className="section-padding" style={{ background: 'linear-gradient(180deg, #1a1a1a 0%, #222222 100%)' }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left: steps */}
          <div ref={containerRef} className="space-y-6">
            <div className="mb-10">
              <div className="inline-block bg-[#FFCBA4] border-2 border-[#FFCBA4] px-4 py-1 mb-4">
                <p className="font-body text-[#111] text-xs font-bold tracking-widest uppercase">How it works</p>
              </div>
              <h2
                className="font-display text-white"
                style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700 }}
              >
                From wrong answer to stronger foundation
              </h2>
            </div>

            {STEPS.map((step) => (
              <div
                key={step.number}
                className="step-item flex gap-5 p-5 border border-white/10 transition-all duration-150 hover:border-white/25"
                style={{
                  opacity: 0,
                  background: step.highlight ? 'rgba(255,203,164,0.08)' : 'rgba(255,255,255,0.04)',
                  borderColor: step.highlight ? 'rgba(255,203,164,0.35)' : 'rgba(255,255,255,0.10)',
                }}
              >
                <div className="flex-shrink-0">
                  <div
                    className="w-10 h-10 flex items-center justify-center font-body font-bold text-sm border"
                    style={{
                      background: step.highlight ? '#FFCBA4' : 'rgba(255,255,255,0.08)',
                      borderColor: step.highlight ? '#FFCBA4' : 'rgba(255,255,255,0.15)',
                      color: step.highlight ? '#111' : '#fff',
                    }}
                  >
                    {step.number}
                  </div>
                </div>
                <div>
                  <h3 className="font-display text-white text-lg font-bold mb-1">{step.title}</h3>
                  <p className="font-body text-white/60 text-sm leading-relaxed mb-3">
                    {step.description}
                  </p>
                  <span
                    className="inline-block font-body text-xs font-bold px-3 py-1 border"
                    style={{
                      background: step.highlight ? 'rgba(255,203,164,0.15)' : 'rgba(255,255,255,0.06)',
                      borderColor: step.highlight ? 'rgba(255,203,164,0.4)' : 'rgba(255,255,255,0.15)',
                      color: step.highlight ? '#FFCBA4' : 'rgba(255,255,255,0.55)',
                    }}
                  >
                    {step.detail}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Right: visual */}
          <div className="relative lg:sticky lg:top-28">
            <div className="border border-white/15 p-8" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <p className="font-body text-[#FFCBA4] text-xs font-bold tracking-widest uppercase mb-6 border-b border-white/10 pb-4">
                Concept Graph — Live Output
              </p>

              <div className="space-y-0">
                {[
                  { label: 'Arithmetic', status: 'ok' },
                  { label: 'Algebra Basics', status: 'ok' },
                  { label: 'Linear Equations', status: 'weak' },
                  { label: 'Quadratic Equations', status: 'locked' },
                ].map((node, i) => (
                  <div key={node.label}>
                    {i > 0 && (
                      <div className="flex justify-center my-1">
                        <div className="w-px h-5 bg-white/20" />
                      </div>
                    )}
                    <div
                      className="px-5 py-3 border flex items-center justify-between font-body text-sm"
                      style={{
                        background: node.status === 'ok' ? 'rgba(255,203,164,0.08)'
                          : node.status === 'weak' ? 'rgba(248,113,113,0.12)'
                          : 'rgba(255,255,255,0.04)',
                        borderColor: node.status === 'ok' ? 'rgba(255,203,164,0.3)'
                          : node.status === 'weak' ? 'rgba(248,113,113,0.4)'
                          : 'rgba(255,255,255,0.10)',
                      }}
                    >
                      <span className="font-bold text-white">{node.label}</span>
                      <span className={`text-xs font-bold ${
                        node.status === 'ok' ? 'text-green-400'
                        : node.status === 'weak' ? 'text-red-400'
                        : 'text-white/35'
                      }`}>
                        {node.status === 'ok' && '✓ Mastered'}
                        {node.status === 'weak' && '⚠ Weak — needs revision'}
                        {node.status === 'locked' && '🔒 Locked'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 border border-red-500/30" style={{ background: 'rgba(248,113,113,0.08)' }}>
                <p className="font-body text-red-400 text-xs font-bold uppercase tracking-wide mb-1">Root cause identified</p>
                <p className="font-body text-white/80 text-sm leading-snug">
                  Revise <strong className="text-white">Linear Equations</strong> before continuing to Quadratics
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <Link to="/courses">
                <Button variant="gold" size="lg">Start Learning Now</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
