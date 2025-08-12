/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#059669', // emerald-600
          dark: '#047857',    // emerald-700
        },
      },
      borderRadius: {
        sm: '6px',
        md: '8px',
      },
    },
  },
  plugins: [],
};