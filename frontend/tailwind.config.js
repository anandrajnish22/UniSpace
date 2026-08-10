/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // ra.dev portfolio fonts
        sans: ['DM Sans', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Clash Display', 'DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      colors: {
        // Primary: Red-orange (#e84b3a)
        primary: {
          50:  '#fef3f2',
          100: '#fee4e2',
          200: '#fecdca',
          300: '#fca5a2',
          400: '#f87171',
          500: '#e84b3a',
          600: '#d03827',
          700: '#b22b1c',
          800: '#931f14',
          900: '#7a1a10',
          950: '#450a06',
        },
        // Accent: Amber/gold (#f5a623)
        accent: {
          50:  '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f5a623',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        // Surface: Dark backgrounds from ra.dev
        surface: {
          50:  '#f5f3ef',   // --text-primary
          100: '#e5e5e5',
          200: '#d4d0c8',   // --text-secondary
          300: '#a3a3a3',
          400: '#8a8a8a',
          500: '#9ca3af',   // --text-muted
          600: '#404040',
          700: '#262626',   // --bg-2
          800: '#141414',   // --bg-1
          900: '#0a0a0a',   // --bg-darkest
          950: '#050505',
        },
        success: {
          50:  '#f0fdf4',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
        },
        warning: {
          50:  '#fffbeb',
          500: '#f59e0b',
          600: '#d97706',
        },
        danger: {
          50:  '#fef2f2',
          500: '#ef4444',
          600: '#dc2626',
        },
      },
      boxShadow: {
        'glow':     '0 0 20px rgba(232, 75, 58, 0.35)',
        'glow-sm':  '0 0 10px rgba(232, 75, 58, 0.25)',
        'glow-amber': '0 0 20px rgba(245, 166, 35, 0.3)',
        'soft':     '0 1px 3px 0 rgba(0,0,0,0.4)',
        'card':     '0 4px 6px -1px rgba(0,0,0,0.5), 0 2px 4px -2px rgba(0,0,0,0.3)',
        'elevated': '0 10px 30px rgba(0,0,0,0.5), 0 4px 6px rgba(0,0,0,0.3)',
        'float':    '0 20px 40px rgba(0,0,0,0.6)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      animation: {
        'shimmer':       'shimmer 1.5s ease-in-out infinite',
        'fade-in':       'fadeIn 0.25s ease-out',
        'pulse-online':  'pulse-dot 2s ease-in-out infinite',
        'glow-pulse':    'glowPulse 2s ease-in-out infinite',
        'float':         'floatBadge 3s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-dot': {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%':      { transform: 'scale(1.5)', opacity: '0.5' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 15px rgba(232, 75, 58, 0.3)' },
          '50%':      { boxShadow: '0 0 30px rgba(232, 75, 58, 0.6)' },
        },
        floatBadge: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
      },
    },
  },
  plugins: [],
}
