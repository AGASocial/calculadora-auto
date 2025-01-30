/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563eb',
        secondary: '#0f172a',
        'deep-blue': '#1B2A4A',
        'light-blue': '#69B7E3',
        'electric-blue': '#7B4DFF',
        'neon-pink': '#FF2EC4',
        'gold': '#FFD700',
        'silver': '#C0C0C0',
        'menu-active': '#69B7E3',
        'menu-hover': '#1B2A4A'
      },
      borderRadius: {
        'xl': '1rem',
      },
      animation: {
        'liquid': 'liquid 1.5s ease-in-out infinite',
        'pulse-fast': 'pulse-fast 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        liquid: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        'pulse-fast': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: .5 },
        },
      },
      backdropBlur: {
        'glass': '16px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'class',
    }),
  ],
  darkMode: 'class',
}
