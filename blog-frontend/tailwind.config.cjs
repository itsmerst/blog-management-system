/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html','./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      borderRadius: { '2xl': '1rem' },
    }
  },
  plugins: [require('@tailwindcss/typography')],
}
