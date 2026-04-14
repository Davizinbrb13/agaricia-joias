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
          primary: "#8B7355",
          secondary: "#C4A882",
          dark: "#2C2420",
          light: "#FAF7F2",
          accent: "#D4A574",
          silver: "#C0C0C0",
          muted: "#A89279",
        },
        whatsapp: {
          DEFAULT: "#25D366",
          dark: "#1EBE57",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)"],
        serif: ["var(--font-playfair)"],
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
      },
      animation: {
        "pulse-whatsapp": "pulse-whatsapp 3s ease-in-out infinite",
        "fade-in-up": "fade-in-up 0.6s ease-out forwards",
        "fade-in": "fade-in 0.4s ease-out forwards",
        shimmer: "shimmer 2s linear infinite",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "hero-gradient": "linear-gradient(135deg, rgba(44,36,32,0.7) 0%, rgba(44,36,32,0.3) 100%)",
      },
    },
  },
  plugins: [],
};
export default config;
