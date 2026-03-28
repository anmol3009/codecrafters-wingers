import { forwardRef } from 'react'
import { cn } from '../../lib/cn'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'gold' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-body font-medium transition-all duration-200 rounded-full focus:outline-none focus:ring-2 focus:ring-gold/40 disabled:opacity-50 disabled:cursor-not-allowed',
          {
            // Orange primary — white text
            'bg-gold hover:bg-gold-dark text-white shadow-gold active:scale-95':
              variant === 'primary',
            // Ghost — dark border/text for light backgrounds
            'border border-ink/20 hover:border-gold text-ink-soft hover:text-gold bg-transparent hover:bg-gold/5 active:scale-95':
              variant === 'ghost',
            // Gold gradient
            'bg-gradient-to-r from-gold-dark via-gold to-gold text-white font-semibold shadow-gold hover:opacity-90 active:scale-95':
              variant === 'gold',
            // Danger
            'bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 active:scale-95':
              variant === 'danger',
            // Sizes
            'px-4 py-1.5 text-sm': size === 'sm',
            'px-6 py-2.5 text-sm': size === 'md',
            'px-8 py-3.5 text-base': size === 'lg',
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
export { Button }
