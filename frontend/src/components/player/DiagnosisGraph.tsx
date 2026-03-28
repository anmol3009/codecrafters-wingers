import { motion } from 'framer-motion'

interface DiagnosisGraphProps {
  chain: Array<{ name: string; isWeak: boolean }>
  rootCause: string
}

export default function DiagnosisGraph({ chain, rootCause }: DiagnosisGraphProps) {
  return (
    <div className="py-6 px-4 bg-[#111] border-2 border-[#111] rounded-sm relative overflow-hidden">
      <div className="absolute top-0 right-0 p-2 opacity-10">
        <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="40" stroke="white" strokeWidth="0.5" strokeDasharray="2 2" />
          <path d="M50 10V90M10 50H90" stroke="white" strokeWidth="0.5" opacity="0.5" />
        </svg>
      </div>

      <div className="relative z-10">
        <h4 className="font-display text-white text-lg mb-6 flex items-center gap-2">
          <span className="text-[#FFCBA4]">🧠</span> Diagnostic Knowledge Graph
        </h4>

        <div className="flex flex-col items-center gap-4">
          {chain.map((node, i) => (
            <div key={node.name} className="flex flex-col items-center w-full">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.15 }}
                className={`
                  px-6 py-3 border-2 font-body text-sm font-bold min-w-[200px] text-center relative
                  ${node.name === rootCause 
                    ? 'bg-red-500 border-red-200 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]' 
                    : node.isWeak 
                    ? 'bg-[#111] border-red-500 text-red-500' 
                    : 'bg-[#111] border-[#FFCBA4] text-[#FFCBA4]'}
                `}
                style={{ boxShadow: node.name === rootCause ? 'none' : '4px 4px 0px currentColor' }}
              >
                {node.name}
                {node.name === rootCause && (
                  <div className="absolute -right-2 -top-2 bg-white text-red-500 rounded-full w-5 h-5 flex items-center justify-center text-[10px] animate-bounce">
                    !
                  </div>
                )}
              </motion.div>
              
              {i < chain.length - 1 && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 24 }}
                  transition={{ delay: i * 0.15 + 0.1 }}
                  className="w-0.5 bg-gradient-to-b from-[#FFCBA4] to-[#FFCBA4]/20"
                />
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 pt-4 border-t border-white/10">
          <p className="font-body text-xs text-white/60 leading-relaxed italic">
            "We've identified that your struggle with <span className="text-white font-bold">{chain[chain.length-1].name}</span> actually stems from a gap in <span className="text-[#FFCBA4] font-bold">{rootCause}</span>."
          </p>
        </div>
      </div>
    </div>
  )
}
