import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    // Aquí estaba el error, le quitamos el "src/"
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}", 
  ],
  theme: {
    extend: {
      colors: {
        bloomly: {
          olive: "#4F6F52",
          green: "#739072",
          light: "#EDF3ED",
          pink: "#E8B7C8",
          gray: "#4A4A4A",
          bg: "#F7F9F7",
        },
      },
    },
  },
  plugins: [],
};
export default config;