/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0F172A',
        secondary: '#06B6D4',
        accent: '#2563EB',
        success: '#22C55E',
        background: '#F8FAFC',
        surface: '#FFFFFF',
        amber: {
          50: '#FFFCEB',
          100: '#FFF9C6',
          200: '#FFF291',
          300: '#FFE95C',
          400: '#FFE236',
          500: '#FFDE21', // Primary Brand Yellow
          600: '#E6C51A', // Dark Yellow for hover
          700: '#CCA814', // Deeper Yellow/Gold
          800: '#997B0F',
          900: '#66500A',
          950: '#332705',
        },
        orange: {
          50: '#FFFCEB',
          100: '#FFF9C6',
          200: '#FFF291',
          300: '#FFE95C',
          400: '#FFE236',
          500: '#FFDE21', // Primary Brand Yellow
          600: '#E6C51A', // Dark Yellow for hover
          700: '#CCA814', // Deeper Yellow/Gold
          800: '#997B0F',
          900: '#66500A',
          950: '#332705',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'premium': '0 10px 30px -5px rgba(0, 0, 0, 0.08), 0 4px 10px -2px rgba(0, 0, 0, 0.04)',
        'glow': '0 0 20px rgba(37, 99, 235, 0.4)',
      },
      animation: {
        'blob': 'blob 7s infinite',
        'fade-up': 'fadeUp 0.8s ease-out forwards',
        'reveal': 'reveal 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        reveal: {
          '0%': { clipPath: 'inset(100% 0 0 0)' },
          '100%': { clipPath: 'inset(0 0 0 0)' },
        }
      }
    },
  },
  plugins: [],
}
