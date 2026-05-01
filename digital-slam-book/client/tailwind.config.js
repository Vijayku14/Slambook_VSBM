/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        body: ["Manrope", "sans-serif"]
      },
      colors: {
        ink: "#16110f",
        cream: "#fff7e8",
        coral: "#ff6f61",
        mango: "#ffbf47",
        lagoon: "#1d9a8a"
      },
      boxShadow: {
        glow: "0 24px 80px rgba(255, 111, 97, 0.28)"
      }
    }
  },
  plugins: []
};
