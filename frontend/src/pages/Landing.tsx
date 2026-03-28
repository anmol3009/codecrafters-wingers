import HeroSection from '../components/home/HeroSection'
import CardCarousel3D from '../components/home/CardCarousel3D'
import FeaturesSection from '../components/home/FeaturesSection'
import HowItWorks from '../components/home/HowItWorks'
import { Link } from 'react-router-dom'

function CarouselSection() {
  return (
    <section className="py-24 overflow-hidden" style={{ background: '#FAF3E1' }}>
      <div className="max-w-7xl mx-auto px-6 mb-12 text-center">
        <p className="font-body text-sm tracking-widest uppercase mb-4" style={{ color: '#FA8112' }}>
          Explore subjects
        </p>
        <h2 className="font-display text-ink" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3rem)', fontWeight: 300 }}>
          Drag to discover your learning path
        </h2>
      </div>
      <CardCarousel3D />
    </section>
  )
}

function CTASection() {
  return (
    <section
      className="section-padding text-center"
      style={{ background: 'linear-gradient(135deg, #FA8112 0%, #D4690A 100%)' }}
    >
      <div className="max-w-2xl mx-auto">
        <p className="font-body text-white/70 text-sm tracking-widest uppercase mb-6">
          Ready to learn deeper?
        </p>
        <h2
          className="font-display text-white mb-6"
          style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 300, lineHeight: 1.1 }}
        >
          Join students who understand{' '}
          <em className="not-italic italic">why</em>, not just what
        </h2>
        <p className="font-body text-white/75 mb-10 leading-relaxed text-lg">
          ConceptIQ gives you the diagnostic layer that most learning platforms
          skip. Start with any course — your concept graph builds as you go.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/courses">
            <button
              className="px-8 py-4 rounded-xl font-body text-base font-medium transition-all duration-200 bg-white hover:bg-FAF3E1"
              style={{ color: '#FA8112' }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#FAF3E1' }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#FFFFFF' }}
            >
              Browse All Courses
            </button>
          </Link>
          <Link to="/teacher-insights">
            <button
              className="px-8 py-4 rounded-xl font-body text-base font-medium transition-all duration-200 border-2 border-white/50 text-white hover:border-white hover:bg-white/10"
            >
              Teacher Dashboard
            </button>
          </Link>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer style={{ background: '#FAF3E1', borderTop: '1px solid rgba(34,34,34,0.08)' }} className="py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: '#FA8112' }}>
            <span className="font-display text-white font-bold text-base">CQ</span>
          </div>
          <div>
            <p className="font-display text-ink font-semibold">ConceptIQ</p>
            <p className="font-body text-ink-muted text-xs">AI Root Learning System</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-6">
          {[
            { label: 'Courses', href: '/courses' },
            { label: 'Mock Test', href: '/mock-test' },
            { label: 'My Courses', href: '/my-courses' },
            { label: 'Teacher Insights', href: '/teacher-insights' },
          ].map(link => (
            <Link
              key={link.href}
              to={link.href}
              className="font-body text-ink-muted hover:text-ink text-sm transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
        <p className="font-body text-ink-muted text-xs">© 2025 ConceptIQ. Built for learning.</p>
      </div>
    </footer>
  )
}

export default function Landing() {
  return (
    <>
      <HeroSection />
      <CarouselSection />
      <FeaturesSection />
      <HowItWorks />
      <CTASection />
      <Footer />
    </>
  )
}
