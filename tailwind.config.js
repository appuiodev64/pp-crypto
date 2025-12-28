/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0ea5e9",
        neon: "#00f3ff",
        btc: "#f7931a",
        eth: "#4b8bbe",
        darkbg: "#0a0f1f",
        card: "#111827",
      },
      fontFamily: {
        techno: ["Orbitron", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 15px rgba(0, 243, 255, 0.6)",
      },
      backgroundImage: {
        grid: "linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px),linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)",
      }
    },
  },
  plugins: [],
}
