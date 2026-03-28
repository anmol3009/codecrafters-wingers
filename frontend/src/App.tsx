import { useState, lazy, Suspense } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'

const Landing = lazy(() => import('./pages/Landing'))
const Courses = lazy(() => import('./pages/Courses'))
const CoursePlayer = lazy(() => import('./pages/CoursePlayer'))
const MyCourses = lazy(() => import('./pages/MyCourses'))
const TeacherInsights = lazy(() => import('./pages/TeacherInsights'))
const MockTest = lazy(() => import('./pages/MockTest'))
const IntroExperience = lazy(() => import('./components/intro/IntroExperience'))
import Navbar from './components/navigation/Navbar'

function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-navy-dark flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 rounded-full border-2 border-gold/30 border-t-gold animate-spin mx-auto mb-4" />
        <p className="font-display text-white/40 text-base">Loading...</p>
      </div>
    </div>
  )
}

function MainSite() {
  const location = useLocation()
  return (
    <>
      <Navbar />
      <Suspense fallback={<LoadingScreen />}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageTransition><Landing /></PageTransition>} />
            <Route path="/courses" element={<PageTransition><Courses /></PageTransition>} />
            <Route path="/courses/:id" element={<PageTransition><CoursePlayer /></PageTransition>} />
            <Route path="/my-courses" element={<PageTransition><MyCourses /></PageTransition>} />
            <Route path="/teacher-insights" element={<PageTransition><TeacherInsights /></PageTransition>} />
            <Route path="/mock-test" element={<PageTransition><MockTest /></PageTransition>} />
          </Routes>
        </AnimatePresence>
      </Suspense>
    </>
  )
}

export default function App() {
  const [introComplete, setIntroComplete] = useState(false)

  return (
    <AnimatePresence mode="wait">
      {!introComplete ? (
        <Suspense fallback={<LoadingScreen />} key="intro">
          <IntroExperience onComplete={() => {
            setIntroComplete(true)
          }} />
        </Suspense>
      ) : (
        <motion.div
          key="main"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <MainSite />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
