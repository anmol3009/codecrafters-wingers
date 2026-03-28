import { motion } from 'framer-motion'
import { AlertCircle, Brain, Target, ChevronDown } from 'lucide-react'

interface DiagnosisGraphProps {
  chain: Array<{ name: string; isWeak: boolean }>
  rootCause: string
}

export default function DiagnosisGraph({ chain, rootCause }: DiagnosisGraphProps) {
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

        {/* Footer info */}
        <div className="mt-12 bg-white/5 border border-white/10 rounded-xl p-4">
          <p className="font-body text-xs text-ink-muted leading-relaxed">
            <span className="text-gold font-bold">Analysis:</span> The mistake path indicates a structural weakness starting at 
            <span className="text-red-400 font-bold px-1.5 py-0.5 bg-red-500/10 rounded-md mx-1 border border-red-500/20">{rootCause}</span>. 
            We recommend patching this prerequisite before continuing with {chain[chain.length-1].name}.
          </p>
        </div>
      </div>
    </div>
  )
}
