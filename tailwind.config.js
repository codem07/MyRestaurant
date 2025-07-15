module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#f97316", // orange-500
          light: "#fb923c",   // orange-400
          dark: "#ea580c",    // orange-600
        },
        // You can add more custom colors or override others here
      },
    },
  },
  plugins: [],
} 