import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '../ui/Button'
import { useUserProgress } from '../../lib/useUserProgress'
import AuthModal from '../ui/AuthModal'

const navLinks = [
  { label: 'Courses', href: '/courses' },
  { label: 'Mock Test', href: '/mock-test' },
  { label: 'Teacher Insights', href: '/teacher-insights' },
  { label: 'My Courses', href: '/my-courses' },
]

const careers = [
  { label: 'AI Engineer', emoji: '🤖', color: '#FF6B6B' },
  { label: 'Software Engineer', emoji: '💻', color: '#4ECDC4' },
  { label: 'Data Scientist', emoji: '📊', color: '#45B7D1' },
  { label: 'Businessman', emoji: '💼', color: '#96CEB4' },
  { label: 'Teacher', emoji: '🎓', color: '#FFEAA7' },
  { label: 'Doctor', emoji: '🩺', color: '#DDA0DD' },
  { label: 'Game Developer', emoji: '🎮', color: '#98D8C8' },
  { label: 'Designer', emoji: '🎨', color: '#F7DC6F' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [careerOpen, setCareerOpen] = useState(false)
  const careerRef = useRef<HTMLDivElement>(null)
  const { isLoggedIn, userName, logout } = useUserProgress()
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => { setMobileOpen(false) }, [location.pathname])

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (careerRef.current && !careerRef.current.contains(e.target as Node)) {
        setCareerOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/courses?q=${encodeURIComponent(searchQuery)}`)
      setSearchOpen(false)
    }
  }

  const handleCareerClick = (career: string) => {
    setCareerOpen(false)
    navigate(`/career-roadmap?career=${encodeURIComponent(career)}`)
  }

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-30 bg-white border-b-2 border-[#111]"
        style={{ boxShadow: scrolled ? '0 4px 0px #111' : 'none' }}
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 flex-shrink-0">
            <img src="/image.png" alt="Saraswati Logo" className="w-10 h-10 object-contain" />
            <div className="hidden sm:block">
              <p className="font-display text-black font-bold text-xl leading-tight tracking-tight uppercase">SARASWATI</p>
              <p className="text-[#666] text-xs font-body leading-tight">AI Root Learning</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.href}
                to={link.href}
                className={`px-4 py-2 font-body text-sm font-semibold transition-all duration-100 border-2 ${
                  location.pathname === link.href
                    ? 'bg-[#FFCBA4] text-[#111] border-[#111]'
                    : 'text-[#333] border-transparent hover:border-[#111] hover:bg-[#FFFAF6]'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* ✅ NEW: "I want to become" dropdown */}
            <div ref={careerRef} className="relative">
              <button
                onClick={() => setCareerOpen(v => !v)}
                className={`flex items-center gap-1.5 px-4 py-2 font-body text-sm font-semibold transition-all duration-100 border-2 ${
                  careerOpen
                    ? 'bg-[#111] text-white border-[#111]'
                    : 'text-[#333] border-[#111] hover:bg-[#FFCBA4]'
                }`}
                style={{ boxShadow: careerOpen ? 'none' : '2px 2px 0 #111' }}
              >
                <span>🚀</span>
                <span>I want to become</span>
                <motion.span
                  animate={{ rotate: careerOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-xs"
                >
                  ▼
                </motion.span>
              </button>

              <AnimatePresence>
                {careerOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 mt-2 w-56 bg-white border-2 border-[#111] z-50"
                    style={{ boxShadow: '4px 4px 0 #111' }}
                  >
                    {careers.map((career, i) => (
                      <motion.button
                        key={career.label}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                        onClick={() => handleCareerClick(career.label)}
                        className="w-full text-left px-4 py-3 flex items-center gap-3 font-body text-sm font-semibold text-[#111] hover:bg-[#FFFAF6] border-b border-[#eee] last:border-0 transition-colors group"
                      >
                        <span
                          className="w-8 h-8 flex items-center justify-center text-base border-2 border-[#111] group-hover:scale-110 transition-transform"
                          style={{ backgroundColor: career.color + '40' }}
                        >
                          {career.emoji}
                        </span>
                        {career.label}
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* Right */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 border-2 border-transparent hover:border-[#111] hover:bg-[#FFFAF6] transition-all"
            >
              <SearchIcon />
            </button>

            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#FFCBA4] border-2 border-[#111] flex items-center justify-center" style={{ boxShadow: '2px 2px 0 #111' }}>
                  <span className="text-[#111] font-bold text-xs">{userName.charAt(0).toUpperCase()}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={logout}>Sign out</Button>
              </div>
            ) : (
              <Button variant="primary" size="sm" onClick={() => setAuthOpen(true)}>Sign in</Button>
            )}

            <button
              className="md:hidden p-2 border-2 border-transparent hover:border-[#111]"
              onClick={() => setMobileOpen(v => !v)}
            >
              {mobileOpen ? <XIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t-2 border-[#111]"
            >
              <div className="px-6 py-4 flex flex-col gap-1">
                {navLinks.map(link => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="px-4 py-3 font-body text-sm font-semibold text-[#333] hover:bg-[#FFCBA4] hover:text-[#111] transition-all border-b border-[#eee] last:border-0"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="border-t border-[#eee] pt-2 mt-1">
                  <p className="px-4 py-2 text-xs text-[#999] font-body uppercase tracking-wider">I want to become →</p>
                  {careers.map(career => (
                    <button
                      key={career.label}
                      onClick={() => handleCareerClick(career.label)}
                      className="w-full text-left px-4 py-2.5 font-body text-sm font-semibold text-[#333] hover:bg-[#FFCBA4] transition-all flex items-center gap-2"
                    >
                      <span>{career.emoji}</span> {career.label}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Search Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 z-40"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSearchOpen(false)}
            />
            <motion.div
              className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-full max-w-xl px-4"
              initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            >
              <form onSubmit={handleSearch} className="bg-white border-2 border-[#111] p-4 flex gap-3" style={{ boxShadow: '6px 6px 0 #111' }}>
                <input
                  autoFocus
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="What do you want to learn?"
                  className="flex-1 bg-transparent text-[#111] font-body placeholder:text-[#999] outline-none text-base"
                />
                <Button type="submit" variant="primary" size="sm">Search</Button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  )
}

function SearchIcon() {
  return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
}
function MenuIcon() {
  return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
}
function XIcon() {
  return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
}