/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#7c3aed',    // Purple
        secondary: '#06b6d4',  // Cyan
        dark: '#1f2937',
        light: '#f3f4f6',
      },
    },
  },
  plugins: [],
}