/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#020617", // Deep navy/black
        panel: "rgba(15, 23, 42, 0.7)", // Glass background
        neon: {
          blue: "#0ea5e9",
          green: "#22c55e",
          red: "#ef4444",
          yellow: "#eab308",
          cyan: "#06b6d4",
          purple: "#a855f7",
        }
      },
      boxShadow: {
        'neon-blue': '0 0 10px rgba(14, 165, 233, 0.5)',
        'neon-green': '0 0 10px rgba(34, 197, 94, 0.5)',
        'neon-red': '0 0 10px rgba(239, 68, 68, 0.5)',
      },
      backgroundImage: {
        'cyber-grid': "radial-gradient(circle, rgba(14, 165, 233, 0.1) 1px, transparent 1px)",
      },
      backgroundSize: {
        'grid-sm': '20px 20px',
        'grid-lg': '50px 50px',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'border-flow': 'border-flow 3s linear infinite',
      },
      keyframes: {
        'border-flow': {
          '0%, 100%': { borderColor: 'rgba(14, 165, 233, 0.5)' },
          '50%': { borderColor: 'rgba(14, 165, 233, 1)' },
        }
      }
    },
  },
  plugins: [],
}
