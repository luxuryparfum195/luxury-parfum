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
        luxury: {
          gold: '#C9A227',
          goldLight: '#F4E4BC',
          black: '#0A0A0A',
          cream: '#FFFAF0',
        },
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'serif'],
        display: ['Cinzel', 'serif'],
      },
    },
  },
};

export default config;