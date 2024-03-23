/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "color-primary": "var(--color-primary)",
      },
    },
  },
  darkMode: "class",
  plugins: [],
};
