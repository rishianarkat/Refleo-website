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
        // Refleo brand palette
        "teal-dark": "#2D4F4F", // dark background
        "teal-deep": "#24403F", // alternate deeper band
        teal: "#4A7C7C", // primary
        "teal-light": "#7FB3B3", // accent
        apricot: "#E8A87C", // CTA / highlight
        "apricot-light": "#F2C8A0",
        cream: "#FAF5F0", // light sections
        ink: "#0B1717", // near-black teal: the v2 homepage ground
        white: "#FFFFFF",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        serif: ["var(--font-fraunces)", "Georgia", "serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
