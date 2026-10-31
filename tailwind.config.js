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
        health: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        senior: {
          warm: '#fbfaf7',
          card: '#ffffff',
          darkCard: '#1f2937',
          border: '#e5e7eb',
        }
      },
      fontSize: {
        'senior-base': ['1.125rem', { lineHeight: '1.75rem' }],
        'senior-lg': ['1.25rem', { lineHeight: '1.85rem' }],
        'senior-xl': ['1.5rem', { lineHeight: '2rem' }],
        'senior-2xl': ['1.875rem', { lineHeight: '2.25rem' }],
      }
    },
  },
  plugins: [],
}

