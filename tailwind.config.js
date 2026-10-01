/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  presets: [require('nativewind/preset')],
  // The app manages its own theme; 'media' makes NativeWind throw on web
  // ("Cannot manually set color scheme, as dark mode is type 'media'")
  darkMode: 'class',
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
