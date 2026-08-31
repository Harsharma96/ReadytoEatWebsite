import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#FFF8F2",
        foreground: "#0B1220",
        primary: {
          DEFAULT: "#FF6B35",
          hover: "#E85620",
          light: "#FFF0E5",
        },
        secondary: {
          DEFAULT: "#FF8A00",
          light: "#FFF4E6",
        },
        accent: {
          DEFAULT: "#FF4D6D",
          light: "#FFE4E9",
        },
        fresh: {
          DEFAULT: "#3ECF6E",
          light: "#EAF9EF",
          dark: "#2A9D4E",
        },
        dark: {
          DEFAULT: "#0B1220",
          surface: "#141C2E",
          card: "#1C2438",
        },
      },
      fontFamily: {
        sans: ["var(--font-jakarta)", "Plus Jakarta Sans", "Poppins", "sans-serif"],
        heading: ["var(--font-outfit)", "Outfit", "sans-serif"],
      },
      borderRadius: {
        "3xl": "1.5rem",
        "4xl": "2rem",
        "5xl": "2.5rem",
        "card": "32px",
      },
      boxShadow: {
        glow: "0 20px 45px -10px rgba(255, 107, 53, 0.45)",
        "glow-lg": "0 30px 70px -12px rgba(255, 107, 53, 0.55)",
        "glow-secondary": "0 20px 45px -10px rgba(255, 138, 0, 0.45)",
        "glow-accent": "0 20px 45px -10px rgba(255, 77, 109, 0.45)",
        "glow-fresh": "0 20px 45px -10px rgba(62, 207, 110, 0.4)",
        "glass-luxury": "0 25px 60px rgba(0, 0, 0, 0.06), 0 4px 16px rgba(255, 107, 53, 0.04)",
      },
    },
  },
  plugins: [],
};
export default config;
