import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./content/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#06070b",
        panel: "#10131b",
        panelElevated: "#151a24",
        line: "#23293a",
        lineStrong: "#36405a",
        text: "#f5f7fb",
        muted: "#93a0b8",
        brand: "#79f2d0",
        brandDeep: "#0d4037",
        accent: "#80a8ff",
        accentDeep: "#182a52",
        success: "#55d6a7",
        warning: "#ffcb70",
      },
      fontFamily: {
        sans: ["var(--font-body)", "sans-serif"],
        display: ["var(--font-display)", "sans-serif"],
      },
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
        30: "7.5rem",
      },
      boxShadow: {
        glow: "0 24px 80px rgba(128, 168, 255, 0.16)",
        panel: "0 18px 40px rgba(5, 8, 15, 0.36)",
        focus: "0 0 0 4px rgba(121, 242, 208, 0.16)",
      },
      borderRadius: {
        lg2: "1rem",
        xl2: "1.25rem",
        "3xl": "1.75rem",
      },
      backgroundImage: {
        "hero-grid":
          "radial-gradient(circle at top, rgba(121, 242, 208, 0.18), transparent 32%), radial-gradient(circle at 20% 20%, rgba(128, 168, 255, 0.14), transparent 22%)",
        "panel-mesh":
          "linear-gradient(135deg, rgba(121, 242, 208, 0.07), transparent 36%), linear-gradient(315deg, rgba(128, 168, 255, 0.08), transparent 42%)",
      },
    },
  },
  plugins: [],
};

export default config;
