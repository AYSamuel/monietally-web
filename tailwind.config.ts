import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // ── Primary Brand (variable names kept for compatibility, values now emerald) ──
        brand: {
          blue: "#11A675",       // primary emerald
          purple: "#0A6E4D",     // deep emerald
          "deep-blue": "#084034", // deepest emerald
          royal: "#0F8B68",
          mint: "#5DDDA8",
          gold: "#F4B860",       // warm gold accent
        },
        // ── Accents (kept for variety in feature cards) ──
        accent: {
          pink: "#E85D8A",
          orange: "#E67A3D",
          cyan: "#00B8D9",
          green: "#00C98B",
          gold: "#F4B860",
        },
        // ── Semantic ──
        income: "#00C98B",
        expense: "#E85D8A",
        success: "#00C98B",
        error: "#E84D4D",
        warning: "#E6A545",
        info: "#11A675",
        "on-track": "#40C4FF",
        // ── Dark surfaces ──
        dark: {
          bg: "#0A0B0D",
          "bg-secondary": "#12131A",
          surface: "#16171D",
          "surface-elevated": "#1D1E26",
          border: "#2D2E35",
          "border-subtle": "#23242B",
        },
        // ── Light surfaces ──
        light: {
          bg: "#F8F9FD",
          "bg-secondary": "#FFFFFF",
          surface: "#FFFFFF",
          "surface-elevated": "#F5F6FA",
          border: "#D1D2D9",
          "border-subtle": "#E8E9EE",
        },
        // ── Text ──
        "text-dark": {
          primary: "#E8E9ED",
          secondary: "#8A8B95",
          tertiary: "#5A5B65",
        },
        "text-light": {
          primary: "#1A1B1E",
          secondary: "#6B6C73",
          tertiary: "#9B9BA5",
        },
        // ── Grays ──
        gray: {
          50: "#FAFAFC",
          100: "#F5F6FA",
          200: "#E8E9EE",
          300: "#D1D2D9",
          400: "#B3B4BD",
          500: "#9B9BA5",
          600: "#6B6C73",
          700: "#4A4B52",
          800: "#2D2E33",
          900: "#1A1B1E",
        },
        // ── Editorial palette (landing redesign v2) ──
        // Static color tokens. Theme-swap behavior is handled per-section
        // with `bg-cream dark:bg-ink` etc., not by remapping these tokens.
        cream: {
          DEFAULT: "#F5F1E8",
          soft: "#FAF8F1",
        },
        ink: {
          DEFAULT: "#0F1117",
          soft: "#1A1C24",
        },
        gold: {
          DEFAULT: "#C9A961",
        },
      },
      fontFamily: {
        sans: [
          "var(--font-body)",
          "DM Sans",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        display: [
          "var(--font-display)",
          "Playfair Display",
          "ui-serif",
          "Georgia",
          "serif",
        ],
      },
      backgroundImage: {
        "gradient-hero": "linear-gradient(135deg, #084034, #0A6E4D)",
        "gradient-hero-purple": "linear-gradient(135deg, #0A6E4D, #14B881)",
        "gradient-cta": "linear-gradient(135deg, #084034, #0A6E4D)",
        "gradient-card-blue": "linear-gradient(135deg, #14B881, #0A6E4D)",
        "gradient-card-pink": "linear-gradient(135deg, #E85D8A, #E87099)",
        "gradient-sunset": "linear-gradient(135deg, #BA4668, #BF5E33)",
        "gradient-ocean": "linear-gradient(135deg, #14B881, #0A6E4D)",
        "gradient-dark":
          "linear-gradient(180deg, #0A0B0D 0%, #12131A 100%)",
        "gradient-radial-blue":
          "radial-gradient(ellipse at center, rgba(17,166,117,0.14) 0%, transparent 70%)",
      },
      borderRadius: {
        "2xl": "16px",
        "3xl": "24px",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out",
        "fade-in-up": "fadeInUp 0.6s ease-out",
        "slide-up": "slideUp 0.8s ease-out",
        float: "float 6s ease-in-out infinite",
        glow: "glow 3s ease-in-out infinite alternate",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(40px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        glow: {
          "0%": { opacity: "0.4" },
          "100%": { opacity: "0.8" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
