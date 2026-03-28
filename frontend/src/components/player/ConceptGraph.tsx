import { motion } from 'framer-motion'

interface GraphNode {
  name: string
  isWeak: boolean
}

interface ConceptGraphProps {
  nodes: GraphNode[]
  className?: string
}

const NODE_W = 130
const NODE_H = 44
const GAP = 48

export default function ConceptGraph({ nodes, className }: ConceptGraphProps) {
  const totalWidth = nodes.length * NODE_W + (nodes.length - 1) * GAP
  const svgWidth = Math.max(totalWidth, 300)

  return (
    <div className={`overflow-x-auto ${className ?? ''}`}>
      <svg
        viewBox={`-10 -10 ${svgWidth + 20} ${NODE_H + 40}`}
        width="100%"
        style={{ minWidth: svgWidth, maxHeight: 100 }}
      >
        {/* Connecting lines */}
        {nodes.slice(0, -1).map((_, i) => {
          const x1 = i * (NODE_W + GAP) + NODE_W
          const x2 = (i + 1) * (NODE_W + GAP)
          const y = NODE_H / 2

          return (
            <motion.line
              key={`line-${i}`}
              x1={x1} y1={y} x2={x2} y2={y}
              stroke="rgba(255,230,0,0.4)"
              strokeWidth={2}
              strokeDasharray="80"
              initial={{ strokeDashoffset: 80 }}
              animate={{ strokeDashoffset: 0 }}
              transition={{ delay: i * 0.18 + 0.1, duration: 0.35, ease: 'easeOut' }}
            />
          )
        })}

        {/* Arrow heads */}
        {nodes.slice(0, -1).map((_, i) => {
          const x2 = (i + 1) * (NODE_W + GAP)
          const y = NODE_H / 2
          return (
            <motion.polygon
              key={`arrow-${i}`}
              points={`${x2 - 6},${y - 4} ${x2},${y} ${x2 - 6},${y + 4}`}
              fill="rgba(255,230,0,0.4)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.18 + 0.45 }}
            />
          )
        })}

        {/* Node rectangles */}
        {nodes.map((node, i) => {
          const x = i * (NODE_W + GAP)
          const isWeak = node.isWeak

          return (
            <g key={node.name} transform={`translate(${x}, 0)`}>
              <motion.rect
                width={NODE_W}
                height={NODE_H}
                rx={8}
                fill={isWeak ? 'rgba(239,68,68,0.15)' : 'rgba(255,230,0,0.1)'}
                stroke={isWeak ? '#ef4444' : 'rgba(255,230,0,0.4)'}
                strokeWidth={isWeak ? 2 : 1}
                initial={{ opacity: 0, scaleX: 0.7 }}
                animate={{
                  opacity: 1,
                  scaleX: 1,
                  strokeOpacity: isWeak ? [1, 0.25, 1] : 1,
                }}
                transition={{
                  opacity: { delay: i * 0.15, duration: 0.3 },
                  scaleX: { delay: i * 0.15, duration: 0.3 },
                  strokeOpacity: isWeak
                    ? { repeat: Infinity, duration: 1.4, ease: 'easeInOut', delay: 0.5 }
                    : {},
                }}
                style={{ transformOrigin: `${NODE_W / 2}px ${NODE_H / 2}px` }}
              />

              <motion.text
                x={NODE_W / 2}
                y={NODE_H / 2 + 5}
                textAnchor="middle"
                fill={isWeak ? '#f87171' : 'rgba(255,255,255,0.85)'}
                fontSize={11}
                fontFamily="Inter, sans-serif"
                fontWeight="500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.15 + 0.15 }}
              >
                {node.name}
              </motion.text>

              {/* Weak indicator */}
              {isWeak && (
                <motion.text
                  x={NODE_W - 10}
                  y={12}
                  fontSize={11}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.15 + 0.3 }}
                >
                  ⚠
                </motion.text>
              )}
            </g>
          )
        })}
      </svg>
    </div>
  )
}
