/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          red: {
            DEFAULT: '#c8102e',
            dark: '#a00d24',
            light: '#e63950',
            50: '#fef2f3',
            100: '#fde6e8',
            200: '#fbd0d5',
            300: '#f7a8b1',
            400: '#f07582',
            500: '#e63950',
            600: '#c8102e',
            700: '#a00d24',
            800: '#7a0a1b',
            900: '#5a0713',
          },
        },
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans JP', 'system-ui', 'sans-serif'],
        jp: ['Noto Sans JP', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
