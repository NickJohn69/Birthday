/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#fdfbf9',
          100: '#faf8f6',
          200: '#f3efea',
          300: '#e8e2d9',
          400: '#d7ccbd',
        },
        champagne: {
          400: '#e5c158',
          500: '#d4af37',
          600: '#b89228',
        },
        rose: {
          50: '#fff5f6',
          100: '#ffe8ec',
          200: '#fecdd6',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
        },
        luxury: {
          dark: '#1c1917',
          slate: '#292524',
          muted: '#78716c',
          card: '#ffffff',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        cursive: ['Sacramento', 'cursive'],
      },
      boxShadow: {
        'apple-sm': '0 2px 8px -2px rgba(0, 0, 0, 0.04), 0 1px 4px -1px rgba(0, 0, 0, 0.02)',
        'apple-md': '0 12px 32px -8px rgba(0, 0, 0, 0.06), 0 4px 12px -2px rgba(0, 0, 0, 0.03)',
        'apple-lg': '0 24px 48px -12px rgba(0, 0, 0, 0.08), 0 8px 20px -4px rgba(0, 0, 0, 0.04)',
      }
    },
  },
  plugins: [],
}
