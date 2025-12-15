/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0D6EFD",
        secondary: "#757575",
        success: "#28A745",
        warning: "#FFC107",
        error: "#DC3545",
        background: "#F8F9FA",
        surface: "#FFFFFF",
      },
    },
  },
  plugins: [],
};