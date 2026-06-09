/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Cormorant Garamond"', 'serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        'arch-black': '#0A0A0A',
        'arch-concrete': '#C8BFB0',
        'arch-steel': '#4A5568',
        'arch-chalk': '#F5F2ED',
        'arch-ghost': '#1A1A1A',
      }
    },
  },
  plugins: [],
}
