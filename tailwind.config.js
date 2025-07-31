/ ** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#059669', // emerald-600
          dark: '#047857',    // emerald-700
        },
      },
    },
  },
  plugins: [],
};