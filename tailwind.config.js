/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          teal: "#6BB3C0",
          "teal-dark": "#458C99",
          "teal-deep": "#1C434C",
          "teal-light": "#EBF5F6",
          "teal-soft": "#D5ECEE",
          ivory: "#FFFFFF",
          cream: "#F7FCFC",
          linen: "#E1EFF1",
          stone: "#4A6267",
          espresso: "#1C434C",
          gold: "#6BB3C0",
          "gold-light": "#A2D4DC",
          "gold-dark": "#367682",
          rose: "#F4D9DC",
          sage: "#C7E5E3",
          warm: "#FAFDDF",
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Playfair Display", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Inter", "sans-serif"],
      },
      boxShadow: {
        luxury: "0 10px 30px -10px rgba(28, 67, 76, 0.08)",
        "luxury-lg": "0 20px 40px -15px rgba(28, 67, 76, 0.12)",
      },
    },
  },
  plugins: [],
};
