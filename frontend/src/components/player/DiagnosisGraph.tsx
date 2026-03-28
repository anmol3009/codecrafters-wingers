import { motion } from 'framer-motion'
import { AlertCircle, Brain, Target, ChevronDown, Rocket, BookOpen } from 'lucide-react'
import { Link } from 'react-router-dom'

interface DiagnosisGraphProps {
  chain: Array<{ name: string; isWeak: boolean }>
  rootCause: string
  detailedExplanation?: string
  recommendations?: Array<{
    id: string
    title: string
    isEnrolled: boolean
  }>
}

export default function DiagnosisGraph({ chain, rootCause, detailedExplanation, recommendations }: DiagnosisGraphProps) {
  return (
    <div className="py-8 px-6 bg-navy/40 border border-gold/20 rounded-2xl relative overflow-hidden backdrop-blur-xl">
      {/* Background patterns */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <svg width="100%" height="100%" className="absolute inset-0">
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h4 className="font-display text-white text-xl font-light tracking-wide flex items-center gap-3">
              <Brain className="w-6 h-6 text-gold" />
              Diagnostic Trace
            </h4>
            <p className="text-ink-muted text-xs uppercase tracking-widest mt-1">Tracing knowledge architecture</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full">
            <AlertCircle className="w-3 h-3 text-red-400" />
            <span className="text-red-400 text-[10px] uppercase font-bold tracking-tighter">Root Cause Found</span>
          </div>
        </div>

        <div className="flex flex-col items-center relative">
          {/* Vertical Trace Line */}
          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[1px] bg-gradient-to-b from-gold/40 via-gold/10 to-transparent" />

          {chain.map((node, i) => {
            const isRoot = node.name === rootCause
            
            return (
              <div key={node.name} className="flex flex-col items-center w-full relative mb-8 last:mb-0">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.2, type: 'spring', stiffness: 100 }}
                  className="z-20 w-full max-w-sm"
                >
                  <div className={`
                    relative group transition-all duration-300
                    p-4 rounded-xl border-2 backdrop-blur-sm
                    ${isRoot 
                      ? 'bg-red-500/10 border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.15)] ring-1 ring-red-500/20' 
                      : node.isWeak 
                        ? 'bg-navy/80 border-red-400/30' 
                        : 'bg-navy/80 border-gold/20'}
                  `}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`
                          w-8 h-8 rounded-lg flex items-center justify-center border
                          ${isRoot ? 'bg-red-500 border-red-400' : 'bg-navy-dark border-gold/20'}
                        `}>
                          {isRoot ? <Target className="w-4 h-4 text-white" /> : <div className="w-1.5 h-1.5 rounded-full bg-gold/40" />}
                        </div>
                        <div>
                          <p className={`font-display text-sm font-medium ${isRoot ? 'text-white' : 'text-ink'}`}>
                            {node.name}
                          </p>
                          <p className="text-[10px] text-ink-muted uppercase tracking-tighter">
                            {isRoot ? 'Detected Deficiency' : node.isWeak ? 'Intermediate Gap' : 'Prerequisite'}
                          </p>
                        </div>
                      </div>
                      
                      {isRoot && (
                        <motion.div 
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ repeat: Infinity, duration: 2 }}
                          className="w-2 h-2 rounded-full bg-red-400 shadow-[0_0_8px_#ef4444]"
                        />
                      )}
                    </div>

                    {isRoot && (
                      <div className="mt-3 pt-3 border-t border-red-500/10">
                        <p className="text-red-300/80 text-[11px] leading-relaxed italic">
                          Mistakes in higher concepts originate from this fundamental gap.
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>

                {i < chain.length - 1 && (
                  <div className="h-8 flex items-center justify-center">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.2 + 0.3 }}
                    >
                      <ChevronDown className="w-4 h-4 text-gold/30" />
                    </motion.div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* AI Analysis & Recommendations */}
        <div className="mt-12 space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-xl p-5 backdrop-blur-md">
            <h5 className="font-display text-gold text-[10px] uppercase tracking-widest mb-3 flex items-center gap-2">
              <Brain className="w-3 h-3" />
              In-Depth Analysis
            </h5>
            <p className="font-body text-xs text-ink-muted leading-relaxed">
              {detailedExplanation || `The mistake path indicates a structural weakness starting at ${rootCause}. We recommend patching this prerequisite before continuing with ${chain[chain.length-1].name}.`}
            </p>
          </div>

          {recommendations && recommendations.length > 0 && (
            <div className="bg-gold/5 border border-gold/20 rounded-xl p-5">
              <h5 className="font-display text-gold text-[10px] uppercase tracking-widest mb-4 flex items-center gap-2">
                <Rocket className="w-3 h-3" />
                Recommended for your path
              </h5>
              <div className="space-y-3">
                {recommendations.map((rec) => (
                  <div key={rec.id} className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-navy/80 border border-gold/10 flex items-center justify-center">
                        <BookOpen className="w-4 h-4 text-gold/60" />
                      </div>
                      <span className="text-sm font-medium text-ink group-hover:text-white transition-colors">
                        {rec.title}
                      </span>
                    </div>
                    
                    {rec.isEnrolled ? (
                      <Link 
                        to={`/course/${rec.id}`}
                        className="px-3 py-1 bg-gold text-navy text-[10px] font-bold rounded uppercase tracking-tighter hover:bg-white transition-colors"
                      >
                        Start Now
                      </Link>
                    ) : (
                      <span className="text-[10px] text-ink-muted uppercase font-bold tracking-tighter px-3 py-1 border border-white/10 rounded">
                        Available Course
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
