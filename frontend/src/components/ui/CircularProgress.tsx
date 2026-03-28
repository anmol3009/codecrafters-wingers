interface CircularProgressProps {
  value: number  // 0-100
  size?: number
  strokeWidth?: number
  className?: string
  label?: string
}

export function CircularProgress({
  value,
  size = 80,
  strokeWidth = 6,
  className,
  label,
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (value / 100) * circumference

  return (
    <div className={`relative inline-flex items-center justify-center ${className ?? ''}`}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(250,129,18,0.15)"
          strokeWidth={strokeWidth}
        />
        {/* Progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#FA8112"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-ink font-body font-semibold text-sm">{value}%</span>
        {label && <span className="text-ink-muted text-xs">{label}</span>}
      </div>
    </div>
  )
}
