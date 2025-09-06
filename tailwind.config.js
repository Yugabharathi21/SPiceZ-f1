/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'f1-red': '#E10600',
        'f1-red-light': '#FF1801',
        'f1-red-dark': '#B30000',
        'f1-black': '#15151E',
        'f1-dark': '#1F1F27',
        'f1-gray': '#38383F',
        'f1-silver': '#F0F0F5',
        'f1-light': '#FFFFFF',
        'f1-accent': '#3DD2CC',
        'f1-yellow': '#FFBA08'
      },
      fontFamily: {
        f1: ['"Formula1 Display-Black"', 'Titillium Web', 'Arial Black', 'sans-serif'],
        body: ['Inter', 'Poppins', 'system-ui', 'sans-serif'],
        f1mono: ['"JetBrains Mono"', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'card': '0 4px 20px rgba(0, 0, 0, 0.1)',
        'card-hover': '0 10px 30px rgba(0, 0, 0, 0.2)',
        'card-dark': '0 4px 20px rgba(0, 0, 0, 0.4)',
        'card-dark-hover': '0 10px 30px rgba(0, 0, 0, 0.6)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'f1-gradient': 'linear-gradient(135deg, #E10600 0%, #FF1801 50%, #B30000 100%)',
        'f1-dark-gradient': 'linear-gradient(135deg, #15151E 0%, #1F1F27 100%)',
      },
      animation: {
        'pulse-red': 'pulse-red 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-in-bottom': 'slide-in-bottom 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both',
        'slide-in-right': 'slide-in-right 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both',
        'slide-out-right': 'slide-out-right 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both',
      },
      keyframes: {
        'pulse-red': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(225, 6, 0, 0.4)' },
          '50%': { boxShadow: '0 0 0 8px rgba(225, 6, 0, 0)' },
        },
        'slide-in-bottom': {
          '0%': { transform: 'translateY(50px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(50px)', opacity: 0 },
          '100%': { transform: 'translateX(0)', opacity: 1 },
        },
        'slide-out-right': {
          '0%': { transform: 'translateX(0)', opacity: 1 },
          '100%': { transform: 'translateX(50px)', opacity: 0 },
        },
      },
    },
  },
  plugins: [],
};
