import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#00D9FF",
        secondary: "#00A8CC",
        accent: "#00D9FF",
        danger: "#FF3366",
        warning: "#FFB800",
        success: "#00E676",
        background: "#0A0A0F",
        surface: "#12121A",
        "surface-elevated": "#1A1A25",
        "text-primary": "#FFFFFF",
        "text-secondary": "#A0A0B0",
        "text-muted": "#6B6B80",
        border: "#2A2A3A",
      },
      fontFamily: {
        heading: ["Poppins", "sans-serif"],
        body: ["Open Sans", "sans-serif"],
      },
      spacing: {
        xs: "4px",
        sm: "8px",
        md: "16px",
        lg: "24px",
        xl: "32px",
        "2xl": "48px",
        "3xl": "64px",
      },
      boxShadow: {
        sm: "0 1px 2px rgba(0,217,255,0.1)",
        md: "0 4px 12px rgba(0,217,255,0.15)",
        lg: "0 8px 24px rgba(0,217,255,0.2)",
        xl: "0 12px 40px rgba(0,217,255,0.25)",
        glow: "0 0 20px rgba(0,217,255,0.3), 0 0 40px rgba(0,217,255,0.1)",
        "glow-sm": "0 0 10px rgba(0,217,255,0.2)",
      },
      backdropBlur: {
        xs: "4px",
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "20px",
      },
    },
  },
  plugins: [],
};

export default config;
