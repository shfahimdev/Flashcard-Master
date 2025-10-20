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
        // Brand colors
        'zakbot-blue': '#1a365d',
        'zakbot-teal': '#319795',
        'zakbot-purple': '#805ad5',
        'zakbot-light': '#f7fafc',
        'zakbot-dark': '#2d3748',
        
        // Color variants
        'zakbot-blue-light': '#2c5282',
        'zakbot-blue-dark': '#1a202c',
        'zakbot-teal-light': '#38b2ac',
        'zakbot-teal-dark': '#2c7a7b',
        'zakbot-purple-light': '#9f7aea',
        'zakbot-purple-dark': '#6b46c1',
      },
      fontFamily: {
        sans: ['Open Sans', 'sans-serif'],
        heading: ['Montserrat', 'sans-serif'],
        mono: ['Roboto Mono', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
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
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-blue': 'linear-gradient(135deg, #1a365d 0%, #2c5282 100%)',
        'gradient-teal': 'linear-gradient(135deg, #319795 0%, #38b2ac 100%)',
        'gradient-purple': 'linear-gradient(135deg, #805ad5 0%, #9f7aea 100%)',
      },
    },
  },
  plugins: [],
}
