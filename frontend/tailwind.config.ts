import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: "#facc15", // kuning utama
        darkbg: "#0f172a",
      },
    },
  },
  plugins: [],
};

export default config;