/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "casino-bg": "#100E11",
        "casino-border": "#1E2938",
        "casino-card": "#131216",
      },
      fontFamily: {
        aeonik: ["Aeonik", "Inter", "sans-serif"],
      },
      fontWeight: {
        normal: "400",
        medium: "500",
      },
    },
  },
  plugins: [],
};
