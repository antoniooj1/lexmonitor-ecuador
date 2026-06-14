import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0F172A",
        navy: "#1E3A8A",
        surface: "#F8FAFC",
        muted: "#64748B",
        success: "#16A34A",
        warning: "#FACC15",
        review: "#F97316",
        danger: "#DC2626"
      },
      fontFamily: {
        sans: ["Inter", "Montserrat", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      boxShadow: {
        soft: "0 18px 45px rgba(15, 23, 42, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
