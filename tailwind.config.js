/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
    },
    extend: {
      colors: {
        primary: '#1677ff',
        success: '#52c41a',
        warning: '#faad14',
        error: '#ff4d4f',
        text: {
            primary: 'rgba(0, 0, 0, 0.88)',
            secondary: 'rgba(0, 0, 0, 0.65)',
            tertiary: 'rgba(0, 0, 0, 0.45)',
        },
        border: {
            primary: '#d9d9d9',
        },
        bg: {
            layout: '#f5f5f5',
            container: '#ffffff',
        }
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'Noto Sans',
          'sans-serif'
        ],
      }
    },
  },
  plugins: [],
};