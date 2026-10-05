import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        shoply: {
          bg: "#F8F7F3",
          surface: "#FFFFFF",
          text: "#171717",
          mutedText: "#666666",
          lightText: "#8E8E8E",
          border: "#E7E5E0",
          cardBg: "#F4F3EE",
          accent: "#111111",
          hover: "#222222",
          tagBg: "#EFECE6",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        subtle: "0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.04)",
        card: "0 2px 8px -2px rgba(0, 0, 0, 0.05), 0 1px 4px -1px rgba(0, 0, 0, 0.03)",
        elevated: "0 10px 30px -5px rgba(0, 0, 0, 0.08)",
      },
      borderRadius: {
        xl: "14px",
        "2xl": "20px",
        "3xl": "28px",
      }
    },
  },
  plugins: [],
};
export default config;

