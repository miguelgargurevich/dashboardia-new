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
        // Paleta moderna y accesible
        primary: {
          DEFAULT: '#ff9800', // naranja principal
          light: '#ffd699',   // fondo/acento claro
          dark: '#ffb74d',    // acento en modo oscuro
        },
        secondary: {
          DEFAULT: '#2563eb', // azul secundario
          light: '#90caf9',   // fondo/acento claro
          dark: '#1e40af',    // acento en modo oscuro
        },
        accent: {
          DEFAULT: '#ff9800', // igual que primary
          light: '#ffd699',
          dark: '#ffb74d',
        },
        text: {
          DEFAULT: '#18181b', // texto principal modo claro
          dark: '#f3f4f6',    // texto principal modo oscuro
        },
        bg: {
          DEFAULT: '#f3f4f6', // fondo claro
          dark: '#18181b',     // fondo oscuro
        },
        border: {
          DEFAULT: '#e5e7eb', // bordes claros
          dark: '#27272a',    // bordes oscuros
        },
      },
    },
  },
  plugins: [],
};
