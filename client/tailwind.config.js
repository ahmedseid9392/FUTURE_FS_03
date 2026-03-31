// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        boutique: {
          primary: '#D4AF37', // Gold
          secondary: '#2C1810', // Brown
          accent: '#9C6E3E', // Warm Brown
          light: '#F9F5F0', // Cream
        }
      },
      fontFamily: {
        'playfair': ['Playfair Display', 'serif'],
        'poppins': ['Poppins', 'sans-serif'],
      }
    },
  },
  plugins: [],
}