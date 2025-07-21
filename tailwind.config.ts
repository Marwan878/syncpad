/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#2F80ED", // Primary Teal Blue
          light: "#2D9CDB", // Lighter variant
          dark: "#1C60B9", // Darker variant for hover
        },
        accent: {
          DEFAULT: "#27AE60", // Emerald Green
          light: "#6FCF97", // Light green for success backgrounds
          dark: "#1E8749", // Darker green for hover
        },
        background: {
          light: "#F9FAFB", // Main light background
          muted: "#E5E7EB", // Sidebar, borders
          dark: "#1F2937", // Main dark mode background
          darkMuted: "#374151", // Dark sidebar/cards
        },
        text: {
          primary: "#111827", // Main text
          secondary: "#6B7280", // Muted text
          inverted: "#FFFFFF", // Text on dark/brand backgrounds
        },
        state: {
          error: "#EB5757", // Errors, delete actions
          warning: "#F2C94C", // Warnings, sync issues
        },
      },
    },
  },
  plugins: [],
};
