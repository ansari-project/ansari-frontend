/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  presets: [require('nativewind/preset')],
  theme: {
    container: {
      center: true,
      screens: {
        '2xl': '100%',
        '3xl': '1920px',
      },
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
        roboto: ['Roboto'],
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
