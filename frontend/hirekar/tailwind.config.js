/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "custom-red": "#DE0000",
        "custom-yellow": "#FFD238",
      },
    },
  },
  plugins: [],
};
