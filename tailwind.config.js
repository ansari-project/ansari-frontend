/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  presets: [require('nativewind/preset')],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        transparent: 'transparent',
        current: 'currentColor',
        background: '#F2F2F2',
        'user-message-color': '#F2F9FF',
        green: '#08786B',
        'green-bold': '#003C35',
        orange: '#F29B00',
        black: '#020202',
      },
      fontFamily: {
        exo2: ['Exo2'],
        'exo2-semibold': ['Exo2-SemiBold'],
        'exo2-bold': ['Exo2-Bold'],
        'exo2-bold-italic': ['Exo2-Bold-Italic'],
      },
      width: {
        116: '460px',
      },
      height: {
        116: '460px',
      },
    },
  },
  plugins: [],
}
