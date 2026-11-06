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
        warm: {
          50: '#FDFBF7',
          100: '#FAF6EF',
          200: '#F3ECE0',
          300: '#E7DEC9',
          400: '#D2C1A1',
          500: '#B89B6C',
          600: '#9B7B47',
          700: '#7E6034',
          800: '#644A29',
          900: '#4E3821',
          950: '#2A1C0E',
        },
        sacred: {
          rust: '#4B5563',     // Calm Dignified Slate (replaces aggressive loud rust)
          gold: '#B89B6C',     // Soft Champagne / Muted Wheat Gold (replaces loud amber)
          ochre: '#8C7A5B',    // Muted Warm Sand Ochre
          maroon: '#4A2828',   // Quiet Deep Communion Tone
          crimson: '#6B2D2D',  // Subtle Muted Red
          obsidian: '#121214', // Deep Warm Charcoal / Dark background
          espresso: '#18181B', // Rich dark surface
          sand: '#F7F5F0',     // Light surface / soft linen
          cream: '#FAF8F5',    // Calmer, softer off-white
        }
      },
      fontFamily: {
        serif: ['Cinzel', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      screens: {
        'xs': '460px',
      },
      boxShadow: {
        'sharp-sm': '2px 2px 0px 0px rgba(0, 0, 0, 0.9)',
        'sharp': '3px 3px 0px 0px rgba(0, 0, 0, 0.9)',
        'sharp-warm': '3px 3px 0px 0px #4B5563',
        'sharp-gold': '3px 3px 0px 0px #B89B6C',
        'sharp-dark': '3px 3px 0px 0px #FAF8F5',
      },
      borderRadius: {
        'sharp': '0px',
      }
    },
  },
  plugins: [],
}
