/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563eb',
        secondary: '#f59e42',
        accent: '#2563eb',
        darkBg: '#18181b',
        lightBg: '#f3f4f6',
      },
    },
  },
  plugins: [],
};
