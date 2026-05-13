import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        hf: {
          yellow: "#FFD21E",
          dark: "#1C1C1C",
        },
      },
    },
  },
  plugins: [],
};

export default config;
