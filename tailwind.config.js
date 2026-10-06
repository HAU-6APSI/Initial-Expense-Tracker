/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2C4A52",
        accent: "#C89B3C",
        bg: "#F0EFE9",
        paper: "#F0EFE9",
        surface: "#FFFFFF",
        ink: "#21262B",

        success: "#4B7B62",
        successBg: "#E8F0EB",

        danger: "#B65C4B",
        dangerBg: "#F7EAE7",

        line: "#D9D6CC",
        soft: "#6D7477",

        catFood: "#C8763A",
        catTransport: "#3E6B8A",
        catSchool: "#6B5B95",
        catOther: "#8A8577",
      },

      fontFamily: {
        sans: ["Inter", "sans-serif"],
        serif: ["Fraunces", "serif"],
      },

      boxShadow: {
        soft: "0 8px 30px rgba(33, 38, 43, 0.06)",
        card: "0 2px 10px rgba(33, 38, 43, 0.05)",
      },

      borderRadius: {
        "2xl": "1rem",
      },
    },
  },
  plugins: [],
};