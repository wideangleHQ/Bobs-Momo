/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          beige: "#FCFAF6",
          charcoal: "#1A1A1A",
          red: "#E9171F",
          yellow: "#FFCC00",
          black: "#000000",
          cream: "#F5F2EB",
        }
      },
      fontFamily: {
        display: ["Boldfinger", "Poppins", "sans-serif"],
        ghayaty: ["DG Ghayaty", "Poppins", "sans-serif"],
        sans: ["Poppins", "sans-serif"],
        mono: ["Poppins", "sans-serif"],
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translate3d(0, 0, 0)" },
          "100%": { transform: "translate3d(-50%, 0, 0)" },
        },
        marqueeReverse: {
          "0%": { transform: "translate3d(-50%, 0, 0)" },
          "100%": { transform: "translate3d(0, 0, 0)" },
        },
        spinSlow: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      animation: {
        marquee: "marquee 35s linear infinite",
        marqueeReverse: "marqueeReverse 35s linear infinite",
        spinSlow: "spinSlow 12s linear infinite",
      },
    },
  },
  plugins: [],
}
