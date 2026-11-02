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
        "deep-navy": "#0B1F3A",
        "sky-blue": "#2E8BFF",
        "sunrise-orange": "#FF8A3D",
        "canvas-off-white": "#F7F9FC",
        "stroke-soft": "#E6ECF5",
        "pure-white": "#FFFFFF",
        primary: {
          DEFAULT: "#005bb3",
          container: "#0073e0",
          fixed: "#d6e3ff",
        },
        surface: {
          DEFAULT: "#f7f9fc",
          container: "#eceef1",
          "container-low": "#f2f4f7",
          "container-lowest": "#ffffff",
          "container-high": "#e6e8eb",
          "container-highest": "#e0e3e6",
        },
        "on-surface": "#191c1e",
        "on-surface-variant": "#414754",
        outline: "#717785",
        "outline-variant": "#c1c6d6",
        tertiary: {
          DEFAULT: "#4b5d7b",
          fixed: "#d6e3ff",
        },
      },
      fontFamily: {
        sans: ["var(--font-jakarta)", "Plus Jakarta Sans", "Inter", "sans-serif"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        elevated: "0 4px 20px -2px rgba(11, 31, 58, 0.05)",
        card: "0 12px 32px -4px rgba(11, 31, 58, 0.08)",
        modal: "0 24px 48px -8px rgba(11, 31, 58, 0.16)",
      },
    },
  },
  plugins: [],
};

export default config;

