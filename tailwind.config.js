/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Syne"', 'sans-serif'],
        body: ['"DM Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        obsidian: {
          50: '#f5f5f7',
          100: '#e8e8ed',
          200: '#c7c7cf',
          300: '#a0a0b0',
          400: '#6e6e85',
          500: '#3d3d5c',
          600: '#2a2a4a',
          700: '#1e1e38',
          800: '#141428',
          900: '#0a0a18',
          950: '#05050f',
        },
        electric: {
          400: '#4fffb0',
          500: '#00ff88',
          600: '#00cc6a',
        },
        coral: {
          400: '#ff6b6b',
          500: '#ff4d4d',
        },
        amber: {
          400: '#ffd166',
          500: '#ffc233',
        },
        violet: {
          400: '#c77dff',
          500: '#9b5de5',
        }
      },
      animation: {
        'fade-up': 'fadeUp 0.5s ease-out forwards',
        'fade-in': 'fadeIn 0.3s ease-out forwards',
        'slide-in': 'slideIn 0.4s ease-out forwards',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'number-pop': 'numberPop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        slideIn: {
          '0%': { opacity: 0, transform: 'translateX(-20px)' },
          '100%': { opacity: 1, transform: 'translateX(0)' },
        },
        numberPop: {
          '0%': { opacity: 0, transform: 'scale(0.7)' },
          '100%': { opacity: 1, transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};