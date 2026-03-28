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
    description: 'ConceptIQ redirects you to the prerequisite concept and gives you a fresh question. Repeat until confident.',
    detail: 'New question variant each retry',
  },
]

export default function HowItWorks() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const items = containerRef.current?.querySelectorAll('.step-item')
    if (!items) return

    gsap.fromTo(
      items,
      { opacity: 0, x: -40 },
      {
        opacity: 1,
        x: 0,
        duration: 0.7,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 75%',
          once: true,
        },
      }
    )

    return () => ScrollTrigger.getAll().forEach(t => t.kill())
  }, [])

  return (
    <section className="section-padding" style={{ background: 'linear-gradient(180deg, #1a1a1a 0%, #222222 100%)' }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: steps */}
          <div ref={containerRef} className="space-y-8">
            <div className="mb-12">
              <p className="font-body text-gold text-sm tracking-widest uppercase mb-4">
                How it works
              </p>
              <h2
                className="font-display text-ink"
                style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 300 }}
              >
                From wrong answer to stronger foundation
              </h2>
            </div>

            {STEPS.map((step) => (
              <div
                key={step.number}
                className={`step-item flex gap-5 p-6 rounded-2xl border transition-all duration-300 hover:border-gold/30 ${
                  step.highlight
                    ? 'border-gold/30 bg-gold/5'
                    : 'border-ink/5 bg-ink/3'
                }`}
                style={{ opacity: 0 }}
              >
                <div className="flex-shrink-0">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-body font-semibold text-sm ${
                      step.highlight
                        ? 'bg-gold text-navy-dark'
                        : 'bg-ink/8 text-ink-soft'
                    }`}
                  >
                    {step.number}
                  </div>
                </div>
                <div>
                  <h3 className="font-display text-ink text-lg font-light mb-2">{step.title}</h3>
                  <p className="font-body text-ink-soft text-sm leading-relaxed mb-3">
                    {step.description}
                  </p>
                  <div
                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-body ${
                      step.highlight
                        ? 'bg-gold/20 text-gold border border-gold/30'
                        : 'bg-ink/5 text-ink-muted border border-ink/10'
                    }`}
                  >
                    {step.detail}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right: visual */}
          <div className="relative">
            <div className="glass-navy rounded-2xl p-8 shadow-navy">
              <p className="font-body text-gold text-xs tracking-widest uppercase mb-6">
                Concept Graph — Live Output
              </p>

              {/* Chain visualization */}
              <div className="space-y-3">
                {[
                  { label: 'Arithmetic', status: 'ok' },
                  { label: 'Algebra Basics', status: 'ok' },
                  { label: 'Linear Equations', status: 'weak' },
                  { label: 'Quadratic Equations', status: 'locked' },
                ].map((node, i) => (
                  <div key={node.label}>
                    {i > 0 && (
                      <div className="flex justify-center mb-3">
                        <div className="w-px h-4 bg-gold/30" />
                      </div>
                    )}
                    <div
                      className={`px-5 py-3 rounded-xl border flex items-center justify-between font-body text-sm ${
                        node.status === 'ok'
                          ? 'border-gold/30 bg-gold/10 text-ink'
                          : node.status === 'weak'
                          ? 'border-red-500/50 bg-red-500/15 text-red-400'
                          : 'border-ink/10 bg-ink/5 text-ink-muted'
                      }`}
                    >
                      <span>{node.label}</span>
                      <span className="text-xs">
                        {node.status === 'ok' && '✓ Mastered'}
                        {node.status === 'weak' && '⚠ Weak — needs revision'}
                        {node.status === 'locked' && '🔒 Locked'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                <p className="font-body text-red-400 text-xs font-medium mb-1">Root cause identified</p>
                <p className="font-display text-ink text-base">
                  You need to revise Linear Equations before continuing to Quadratics
                </p>
              </div>
            </div>

            <div className="mt-8 flex justify-center">
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
