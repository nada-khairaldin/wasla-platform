import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // ─── Typography ───────────────────────────────────────────────────────
      fontFamily: {
        cairo: ["Cairo", "sans-serif"],
      },
      fontWeight: {
        regular: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
      },
      fontSize: {
        // Titles
        "title-1": ["72px", { lineHeight: "88px", letterSpacing: "-0.8px" }],
        "title-2": ["64px", { lineHeight: "76px", letterSpacing: "-0.8px" }],
        "title-3": ["56px", { lineHeight: "68px", letterSpacing: "-0.6px" }],
        // Headings
        "h1": ["56px", { lineHeight: "68px", letterSpacing: "-0.5px" }],
        "h2": ["48px", { lineHeight: "58px", letterSpacing: "-0.4px" }],
        "h3": ["40px", { lineHeight: "48px", letterSpacing: "-0.3px" }],
        "h4": ["32px", { lineHeight: "38px", letterSpacing: "-0.2px" }],
        "h5": ["24px", { lineHeight: "30px", letterSpacing: "-0.15px" }],
        "h6": ["20px", { lineHeight: "24px", letterSpacing: "0px" }],
        // Labels
        "label-1": ["16px", { lineHeight: "22px", letterSpacing: "-0.18px" }],
        "label-2": ["14px", { lineHeight: "20px", letterSpacing: "-0.16px" }],
        "label-3": ["12px", { lineHeight: "16px", letterSpacing: "-0.12px" }],
        // Body
        "body-1": ["18px", { lineHeight: "28px", letterSpacing: "0px" }],
        "body-2": ["16px", { lineHeight: "24px", letterSpacing: "0px" }],
        "body-3": ["14px", { lineHeight: "20px", letterSpacing: "0px" }],
        "body-4": ["12px", { lineHeight: "16px", letterSpacing: "0px" }],
        // Captions
        "caption-1": ["10px", { lineHeight: "12px", letterSpacing: "0px" }],
        "caption-2": ["9px", { lineHeight: "10px", letterSpacing: "0px" }],
      },

      // ─── Border Radius ────────────────────────────────────────────────────
      borderRadius: {
        sm: "2px",
        md: "4px",
        lg: "8px",
        xl: "12px",
        "2xl": "16px",
        "3xl": "24px",
        "4xl": "32px",
        "5xl": "48px",
        full: "9999px",
      },

      // ─── Spacing ──────────────────────────────────────────────────────────
      spacing: {
        xxs: "2px",
        xs2: "4px",
        xs: "8px",
        sm: "12px",
        base: "16px",
        md: "20px",
        lg: "24px",
        xl: "28px",
        xl2: "32px",
        xl3: "40px",
        xl4: "48px",
        xl5: "60px",
        xl6: "72px",
        xl7: "80px",
        xl8: "84px",
      },

      // ─── Size (width / height) ────────────────────────────────────────────

      height: {
        xxs: "24px",
        xs2: "32px",
        xs: "40px",
        sm: "48px",
        md: "56px",
        lg: "60px",
      },
      width: {
        xxs: "24px",
        xs2: "32px",
        xs: "40px",
        sm: "48px",
        md: "56px",
        lg: "60px",
        full: "100%",
      },

      // ─── Opacity ──────────────────────────────────────────────────────────
      opacity: {
        10: "0.10",
        15: "0.15",
        20: "0.20",
        25: "0.25",
        30: "0.30",
        35: "0.35",
        40: "0.40",
        45: "0.45",
        50: "0.50",
        55: "0.55",
        60: "0.60",
        65: "0.65",
        70: "0.70",
        75: "0.75",
        80: "0.80",
        85: "0.85",
        90: "0.90",
        95: "0.95",
      },
    },
  },
  plugins: [],
};

export default config;
