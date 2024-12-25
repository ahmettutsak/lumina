import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          100: "#1a1a1a",
          200: "#2d2d2d",
          300: "#3d3d3d",
          400: "#4d4d4d",
        },
      },
    },
  },
  darkMode: "class",
};

export default config;
