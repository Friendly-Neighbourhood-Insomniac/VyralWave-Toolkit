/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        'wave': 'wave 15s cubic-bezier(0.55, 0.5, 0.45, 0.5) infinite',
      },
    },
  },
  plugins: [],
};