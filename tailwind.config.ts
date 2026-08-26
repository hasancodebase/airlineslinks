import type { Config } from "tailwindcss";

// Design tokens extracted directly from stitch_airtech_design_system export
// (DESIGN.md + code.html configs). No personal/profile-related tokens carried over.
const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Core surfaces
        surface: "#0b1326",
        "surface-dim": "#0b1326",
        "surface-bright": "#31394d",
        "surface-container-lowest": "#060e20",
        "surface-container-low": "#131b2e",
        "surface-container": "#171f33",
        "surface-container-high": "#222a3d",
        "surface-container-highest": "#2d3449",
        "surface-variant": "#2d3449",
        "surface-card": "#1E293B",
        background: "#0b1326",

        // Text
        "on-surface": "#dae2fd",
        "on-surface-variant": "#d3c5ac",
        "on-background": "#dae2fd",
        "data-text": "#94A3B8",

        // Borders
        outline: "#9c8f79",
        "outline-variant": "#4f4633",
        "border-subtle": "#334155",

        // Primary (amber)
        primary: "#ffe1a7",
        "on-primary": "#402d00",
        "primary-container": "#fbbf24",
        "on-primary-container": "#6c4f00",
        "primary-fixed": "#ffdf9f",
        "primary-fixed-dim": "#f9bd22",
        "surface-tint": "#f9bd22",

        // Secondary (emerald — VFR / success)
        secondary: "#45dfa4",
        "on-secondary": "#003825",
        "secondary-container": "#00bd85",
        "on-secondary-container": "#00452e",

        // Tertiary (cyan)
        tertiary: "#b6edff",
        "on-tertiary": "#003641",
        "tertiary-container": "#34daff",
        "on-tertiary-container": "#005c6e",

        // Error / danger (IFR/LIFR + critical alerts)
        error: "#ffb4ab",
        "on-error": "#690005",
        "error-container": "#93000a",
        "on-error-container": "#ffdad6",
        "danger-critical": "#F87171",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      fontSize: {
        "headline-lg": ["24px", { lineHeight: "32px", letterSpacing: "-0.02em", fontWeight: "600" }],
        "headline-md": ["18px", { lineHeight: "24px", letterSpacing: "-0.01em", fontWeight: "600" }],
        "body-md": ["14px", { lineHeight: "20px", fontWeight: "400" }],
        "body-sm": ["13px", { lineHeight: "18px", fontWeight: "400" }],
        "data-mono": ["13px", { lineHeight: "20px", fontWeight: "500" }],
        "label-caps": ["11px", { lineHeight: "16px", letterSpacing: "0.05em", fontWeight: "700" }],
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        sm: "0.125rem",
        md: "0.375rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px",
      },
      spacing: {
        unit: "4px",
        gutter: "16px",
        "margin-page": "24px",
        "container-padding": "12px",
      },
      maxWidth: {
        content: "1440px",
      },
    },
  },
  plugins: [],
};

export default config;
