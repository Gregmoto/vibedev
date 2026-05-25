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
        // All tokens are CSS-variable-backed so .admin-scope can override to dark palette
        bg:           "rgb(var(--color-bg)           / <alpha-value>)",
        panel:        "rgb(var(--color-panel)         / <alpha-value>)",
        panelElevated:"rgb(var(--color-panelElevated) / <alpha-value>)",
        line:         "rgb(var(--color-line)          / <alpha-value>)",
        lineStrong:   "rgb(var(--color-lineStrong)    / <alpha-value>)",
        text:         "rgb(var(--color-text)          / <alpha-value>)",
        muted:        "rgb(var(--color-muted)         / <alpha-value>)",
        brand:        "rgb(var(--color-brand)         / <alpha-value>)",
        brandDeep:    "rgb(var(--color-brandDeep)     / <alpha-value>)",
        accent:       "rgb(var(--color-accent)        / <alpha-value>)",
        accentDeep:   "rgb(var(--color-accentDeep)    / <alpha-value>)",
        success:      "rgb(var(--color-success)       / <alpha-value>)",
        warning:      "rgb(var(--color-warning)       / <alpha-value>)",
        danger:       "rgb(var(--color-danger)        / <alpha-value>)",
      },
      fontFamily: {
        sans:    ["var(--font-body)", "sans-serif"],
        display: ["var(--font-display)", "sans-serif"],
      },
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
        30: "7.5rem",
      },
      boxShadow: {
        // Light-theme shadows (subtle, using dark ink on light surfaces)
        panel:   "0 1px 3px rgba(15,23,42,0.06), 0 12px 24px -8px rgba(15,23,42,0.08)",
        glow:    "0 0 0 4px rgba(37,99,235,0.12)",
        focus:   "0 0 0 4px rgba(37,99,235,0.18)",
        "lg-card":"0 4px 6px rgba(15,23,42,0.05), 0 20px 40px -12px rgba(15,23,42,0.15)",
      },
      borderRadius: {
        lg2:  "1rem",
        xl2:  "1.25rem",
        "3xl":"1.75rem",
      },
      backgroundImage: {
        // Very subtle light-theme gradients
        "hero-grid":
          "radial-gradient(circle at 30% 20%, rgba(37,99,235,0.07), transparent 50%), " +
          "radial-gradient(circle at 80% 80%, rgba(14,165,233,0.05), transparent 40%)",
        "panel-mesh":
          "linear-gradient(135deg, rgba(37,99,235,0.04), transparent 50%), " +
          "linear-gradient(315deg, rgba(14,165,233,0.03), transparent 50%)",
      },
    },
  },
  plugins: [],
};

export default config;
