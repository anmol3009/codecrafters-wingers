import HeroSection from '../components/home/HeroSection'
import CardCarousel3D from '../components/home/CardCarousel3D'
import FeaturesSection from '../components/home/FeaturesSection'
import HowItWorks from '../components/home/HowItWorks'
import { Link } from 'react-router-dom'

function CarouselSection() {
  return (
    <section className="py-24 overflow-hidden border-t-2 border-[#111]" style={{ background: '#FFFAF6' }}>
      <div className="max-w-7xl mx-auto px-6 mb-12 text-center">
        <div className="inline-block bg-[#FFCBA4] border-2 border-[#111] px-4 py-1 mb-4" style={{ boxShadow: '3px 3px 0 #111' }}>
          <p className="font-body text-xs font-bold tracking-widest uppercase text-[#111]">Explore subjects</p>
        </div>
        <h2 className="font-display text-[#111]" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3rem)', fontWeight: 700 }}>
          Drag to discover your learning path
        </h2>
      </div>
      <CardCarousel3D />
    </section>
  )
}

function CTASection() {
  return (
    <section className="section-padding border-t-2 border-[#111]" style={{ background: '#FFCBA4' }}>
      <div className="max-w-2xl mx-auto text-center">
        <div className="inline-block bg-[#111] text-[#FFCBA4] text-xs font-bold px-4 py-1 mb-6 font-body uppercase tracking-widest">
          Ready to learn deeper?
        </div>
        <h2
          className="font-display text-[#111] mb-6"
          style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 700, lineHeight: 1.05 }}
        >
          Join students who understand <em className="not-italic italic">why</em>, not just what
        </h2>
        <p className="font-body text-[#333] mb-10 leading-relaxed text-lg">
          ConceptIQ gives you the diagnostic layer that most learning platforms skip.
          Start with any course — your concept graph builds as you go.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/courses">
            <button
              className="px-8 py-4 font-body font-bold text-base border-2 border-[#111] bg-[#111] text-[#FFCBA4] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5"
              style={{ boxShadow: '4px 4px 0 #333' }}
            >
              Browse All Courses →
            </button>
          </Link>
          <Link to="/teacher-insights">
            <button
              className="px-8 py-4 font-body font-bold text-base border-2 border-[#111] bg-white text-[#111] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5"
              style={{ boxShadow: '4px 4px 0 #111' }}
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
    <footer className="border-t-2 border-[#111] bg-[#111] py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#FFCBA4] border-2 border-[#FFCBA4] flex items-center justify-center">
            <span className="font-display text-[#111] font-bold text-base">CQ</span>
          </div>
          <div>
            <p className="font-display text-white font-bold">ConceptIQ</p>
            <p className="font-body text-[#999] text-xs">AI Root Learning System</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-6">
          {[
            { label: 'Courses', href: '/courses' },
            { label: 'Mock Test', href: '/mock-test' },
            { label: 'My Courses', href: '/my-courses' },
            { label: 'Teacher Insights', href: '/teacher-insights' },
          ].map(link => (
            <Link key={link.href} to={link.href} className="font-body text-[#999] hover:text-[#FFCBA4] text-sm transition-colors font-medium">
              {link.label}
            </Link>
          ))}
        </div>
        <p className="font-body text-[#666] text-xs">© 2025 ConceptIQ. Built for learning.</p>
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
