/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        yt: {
          red: '#FF0000',
          dark: '#0F0F0F',
          surface: '#1F1F1F',
          border: '#272727',
          hover: '#272727',
          text: '#F1F1F1',
          subtext: '#AAAAAA',
        },
      },
      fontFamily: {
        sans: ['YouTube Sans', 'Roboto', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
