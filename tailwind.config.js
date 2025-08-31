/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'southpark': ['LadFont', 'Arial Black', 'Helvetica Neue', 'Arial', 'sans-serif'],
        'lad': ['LadFont', 'Arial Black', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
