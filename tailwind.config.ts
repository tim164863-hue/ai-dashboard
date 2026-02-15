import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
        accent: "var(--color-accent)",
        danger: "var(--color-danger)",
        warning: "var(--color-warning)",
        success: "var(--color-success)",
        background: "var(--color-bg)",
        surface: "var(--color-surface)",
        "surface-elevated": "var(--color-surface-elevated)",
        "text-primary": "var(--color-text-primary)",
        "text-secondary": "var(--color-text-secondary)",
        "text-muted": "var(--color-text-muted)",
        border: "var(--color-border)",
        cyber: {
          cyan: "#00F0FF",
          magenta: "#FF2D6B",
          yellow: "#FCEE09",
          dark: "#0A0A0F",
        },
      },
      fontFamily: {
        display: ["Orbitron", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
        body: ["Inter", "sans-serif"],
      },
      boxShadow: {
        sm: "0 1px 2px rgba(0,0,0,0.1)",
        md: "0 4px 12px rgba(0,0,0,0.15)",
        lg: "0 8px 24px rgba(0,0,0,0.2)",
        xl: "0 12px 40px rgba(0,0,0,0.25)",
        glow: "0 0 20px rgba(0,240,255,0.3), 0 0 40px rgba(0,240,255,0.1)",
        "glow-sm": "0 0 10px rgba(0,240,255,0.2)",
        "glow-magenta": "0 0 20px rgba(255,45,107,0.3), 0 0 40px rgba(255,45,107,0.1)",
        "glow-yellow": "0 0 20px rgba(252,238,9,0.3), 0 0 40px rgba(252,238,9,0.1)",
      },
      borderRadius: {
        cyber: "2px",
      },
    },
  },
  plugins: [],
};

export default config;
