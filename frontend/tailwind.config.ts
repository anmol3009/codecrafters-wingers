import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#FFFFFF',
          dark: '#FFFFFF',
          light: '#FFFAF6',
          50: '#FFFFF0',
        },
        gold: {
          DEFAULT: '#FFCBA4',
          light: '#FFE8D0',
          dark: '#F0A875',
        },
        ink: {
          DEFAULT: '#111111',
          soft: '#333333',
          muted: '#666666',
        },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #FFFAF6 0%, #FFFFFF 100%)',
        'gold-gradient': 'linear-gradient(135deg, #FFCBA4 0%, #FFE8D0 100%)',
      },
      boxShadow: {
        'brutal':    '4px 4px 0px #111111',
        'brutal-lg': '6px 6px 0px #111111',
        'brutal-sm': '2px 2px 0px #111111',
        'brutal-xl': '8px 8px 0px #111111',
        'gold':  '4px 4px 0px #111111',
        'navy':  '4px 4px 0px #111111',
        'card':  '4px 4px 0px #111111',
      },
      borderRadius: {
        DEFAULT: '2px',
        sm: '2px',
        md: '2px',
        lg: '4px',
        xl: '4px',
        '2xl': '4px',
        '3xl': '4px',
        full: '9999px',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config
