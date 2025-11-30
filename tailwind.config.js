/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#5ccc85',
          text: '#ffffff',
        },
        secondary: {
          DEFAULT: '#f0f5f0',
          text: '#000000',
        },
        accent: {
          DEFAULT: '#5ccc85',
          text: '#ffffff',
        }
      },
      fontFamily: {
        handwriting: ['"Patrick Hand"', 'cursive'],
        sans: ['"Patrick Hand"', 'sans-serif'], // Making it default for now to match the sketch vibe
      },
    },
  },
  plugins: [],
}

