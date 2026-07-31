/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          950: "#060608",
          900: "#0b0b0e",
          850: "#121116",
          800: "#1a1820",
          700: "#262330",
        },
        brand: {
          50: "#fef2f2",
          100: "#fee2e2",
          200: "#fca5a5",
          300: "#f87171",
          400: "#ef4444",
          500: "#dc2626",
          600: "#b91c1c",
          700: "#991b1b",
          800: "#7f1d1d",
          900: "#450a0a",
          950: "#280505",
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'glow-red': '0 0 25px -5px rgba(239, 68, 68, 0.35)',
        'glow-red-lg': '0 0 40px -5px rgba(220, 38, 38, 0.5)',
        'glass-red': '0 8px 32px 0 rgba(239, 68, 68, 0.12)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 15px rgba(239, 68, 68, 0.2)' },
          '100%': { boxShadow: '0 0 30px rgba(239, 68, 68, 0.6)' },
        }
      }
    },
  },
  plugins: [],
}
