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
        boutique: {
          primary: '#D4AF37',
          secondary: '#2C1810',
          accent: '#9C6E3E',
          light: '#F9F5F0',
          dark: '#1A0F0A',
        },
        dark: {
          bg: '#121212',
          surface: '#1E1E1E',
          card: '#2D2D2D',
          border: '#404040',
          text: '#E5E5E5',
          textMuted: '#A3A3A3',
        }
      },
      fontFamily: {
        playfair: ['Playfair Display', 'serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}