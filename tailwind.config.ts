import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  // corePlugins ko yahan se hata kar seedha plugins ke upar likhein 
  // aur syntax check karein
  corePlugins: {
    preflight: false,
  },
  plugins: [],
} satisfies Config; // Ye line TypeScript ko batati hai ke config sahi hai

export default config;