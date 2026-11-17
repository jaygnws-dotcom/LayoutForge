/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: "#2563EB",
        secondary: "#4D4D4D",
        tertiary: "#E6E6E6",
        neutral: "#FFFFFF",
        surface: "#FFFFFF",
        onSurface: "#000000",
        error: "#D92D20",
        border: "#E6E6E6",
        muted: "#F5F5F5",
        accentSoft: "#EAF1FF"
      },
      fontFamily: {
        sans: ['"Rethink Sans"', 'system-ui', 'sans-serif'],
        mono: ['"Doto"', 'monospace']
      }
    },
  },
  plugins: [],
}
