import { useLocation, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '../components/ui/Button'
import { CircularProgress } from '../components/ui/CircularProgress'

export default function Scorecard() {
  const location = useLocation()
  const { score = 85, accuracy = 92, weakAreas = [], courseTitle = 'Algebra Foundations' } = location.state || {}

  return (
    <div className="min-h-screen bg-white pt-28 pb-20">
      <div className="max-w-2xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border-2 border-[#111] p-10 relative overflow-hidden"
          style={{ boxShadow: '16px 16px 0 #111' }}
        >
          {/* Confetti simulation (dots) */}
          <div className="absolute inset-0 pointer-events-none opacity-20">
             <div className="absolute top-10 left-10 w-2 h-2 bg-gold rounded-full" />
             <div className="absolute top-20 right-20 w-3 h-3 bg-gold rounded-full" />
             <div className="absolute bottom-10 left-1/2 w-2 h-2 bg-gold rounded-full" />
          </div>

          <div className="text-center mb-10">
            <div className="inline-block bg-[#111] text-[#FFCBA4] px-4 py-1 font-body text-xs font-bold uppercase tracking-widest mb-4">
              Course Completed
            </div>
            <h1 className="font-display text-[#111] text-4xl font-bold mb-2">{courseTitle}</h1>
            <p className="font-body text-[#666]">You've successfully mastered the core concepts!</p>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-10">
            <div className="flex flex-col items-center p-6 bg-[#FFFAF6] border-2 border-[#111]" style={{ boxShadow: '6px 6px 0 #111' }}>
              <CircularProgress value={score} size={100} strokeWidth={8} />
              <p className="font-display text-2xl font-bold mt-4">{score}/100</p>
              <p className="font-body text-xs text-[#999] uppercase tracking-widest mt-1">Final Score</p>
            </div>
            <div className="flex flex-col items-center p-6 bg-[#FFFAF6] border-2 border-[#111]" style={{ boxShadow: '6px 6px 0 #111' }}>
              <div className="h-[100px] flex items-center justify-center">
                 <span className="text-5xl font-display font-bold text-[#111]">{accuracy}%</span>
              </div>
              <p className="font-body text-xs text-[#999] uppercase tracking-widest mt-4">Accuracy</p>
            </div>
          </div>

          <div className="space-y-6 mb-10">
            <div>
              <h3 className="font-display text-xl font-bold mb-3 flex items-center gap-2">
                <span className="text-emerald-500">💎</span> Mastered Concepts
              </h3>
              <div className="flex flex-wrap gap-2">
                {['Variables', 'Linear Functions', 'Slope'].map((c: string) => (
                  <span key={c} className="bg-emerald-50 border-2 border-[#111] px-3 py-1 font-body text-xs font-bold">{c}</span>
                ))}
              </div>
            </div>

            {weakAreas.length > 0 && (
              <div>
                <h3 className="font-display text-xl font-bold mb-3 flex items-center gap-2">
                  <span className="text-red-500">⚠</span> Suggested Revision
                </h3>
                <div className="space-y-2">
                  {weakAreas.map((c: string) => (
                    <div key={c} className="bg-red-50 border-2 border-[#111] p-3 flex justify-between items-center">
                      <span className="font-body text-sm font-bold">{c}</span>
                      <Link to="/courses" className="text-xs font-body font-bold text-red-500 underline uppercase">Review →</Link>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/my-courses" className="flex-1">
              <Button variant="primary" fullWidth size="lg">Go to Dashboard</Button>
            </Link>
            <Link to="/courses" className="flex-1">
              <Button variant="ghost" fullWidth size="lg">Explore More</Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
