/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-pink-purple': 'linear-gradient(90deg, #ff6f91, #c86dd7)',
      },
      colors: {
        primary: {
          light: '#ff6f91',
          dark: '#c86dd7',
        },
        secondary: {
          light: '#f3f4f6',
          dark: '#374151',
        },
      },
    },
  },
  plugins: [],
};