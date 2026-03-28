import type { Config } from 'tailwindcss'

export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#FAF3E1',
          dark: '#FFFFFF',
          light: '#F5E7C6',
          50: '#FFF9F0',
        },
        gold: {
          DEFAULT: '#FA8112',
          light: '#FFF5E6',
          dark: '#D4690A',
        },
        ink: {
          DEFAULT: '#222222',
          soft: '#555555',
          muted: '#888888',
        },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'hero-gradient': 'radial-gradient(ellipse at 20% 50%, #F5E7C6 0%, #FAF3E1 50%, #FFFFFF 100%)',
        'gold-gradient': 'linear-gradient(135deg, #FA8112 0%, #FFB347 50%, #D4690A 100%)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 20s linear infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      boxShadow: {
        'gold': '0 0 30px rgba(250, 129, 18, 0.25)',
        'navy': '0 24px 80px rgba(0, 0, 0, 0.08)',
        'card': '0 4px 24px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [],
} satisfies Config
