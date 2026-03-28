import { cn } from '../../lib/cn'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'beginner' | 'intermediate' | 'advanced' | 'gold' | 'default'
  className?: string
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-body font-medium',
        {
          'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30': variant === 'beginner',
          'bg-amber-500/20 text-amber-400 border border-amber-500/30': variant === 'intermediate',
          'bg-red-500/20 text-red-400 border border-red-500/30': variant === 'advanced',
          'bg-gold/20 text-gold border border-gold/30': variant === 'gold',
          'bg-ink/8 text-ink-soft border border-ink/10': variant === 'default',
        },
        className
      )}
    >
      {children}
    </span>
  )
}

export function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const variant =
    difficulty === 'Beginner' ? 'beginner'
    : difficulty === 'Intermediate' ? 'intermediate'
    : difficulty === 'Advanced' ? 'advanced'
    : 'default'
  return <Badge variant={variant}>{difficulty}</Badge>
}
