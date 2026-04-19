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
        brand: {
          ink: "#0f2444",
          "ink-soft": "#1a2f5c",
          ocean: "#3d6b9c",
          wave: "#6b96bf",
          mist: "#bfd4e5",
          sand: "#f4ebd8",
          "sand-deep": "#e8dcc0",
          foam: "#fafaf7",
          paper: "#f7f3ea",
          silver: "#c8ccd1",
          "silver-deep": "#8a92a0",
          tide: "#4DBEAD",
          // legacy aliases for existing components
          primary: "#3d6b9c",
          secondary: "#bfd4e5",
          dark: "#0f2444",
          light: "#fafaf7",
          accent: "#c8ccd1",
          muted: "#8a92a0",
        },
        whatsapp: {
          DEFAULT: "#25D366",
          dark: "#1EBE57",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        serif: ["var(--font-cormorant)", "Garamond", "serif"],
      },
      keyframes: {
        "pulse-whatsapp": {
          "0%, 100%": { transform: "scale(1)", boxShadow: "0 0 0 0 rgba(37, 211, 102, 0.4)" },
          "50%": { transform: "scale(1.05)", boxShadow: "0 0 0 12px rgba(37, 211, 102, 0)" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "hero-rise": {
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-14px)" },
        },
        "scroll-cue": {
          "0%": { top: "-50%" },
          "100%": { top: "100%" },
        },
        "ocean-float": {
          "0%, 100%": { filter: "saturate(1) brightness(1)" },
          "50%": { filter: "saturate(1.06) brightness(1.02)" },
        },
        "halo-spin": {
          to: { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "pulse-whatsapp": "pulse-whatsapp 3s ease-in-out infinite",
        "fade-in-up": "fade-in-up 0.6s ease-out forwards",
        "fade-in": "fade-in 0.4s ease-out forwards",
        shimmer: "shimmer 2s linear infinite",
        "float-slow": "float-slow 9s ease-in-out infinite",
        "ocean-float": "ocean-float 28s ease-in-out infinite",
        "halo-spin": "halo-spin 60s linear infinite",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;
