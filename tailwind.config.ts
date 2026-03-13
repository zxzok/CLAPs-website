import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#16212b",
        mist: "#eef3f5",
        paper: "#fbf9f3",
        layer1: "#0b7285",
        layer2: "#c7771a",
        matched: "#1f2937",
        driver: "#c2410c",
        dd1: "#14746f",
        dd2: "#d97706",
        cds: "#2f6f4f",
        cms: "#94a3b8",
        source: "#0f766e",
        relay: "#365486",
        target: "#d97706"
      },
      boxShadow: {
        card: "0 30px 80px -40px rgba(22, 33, 43, 0.25)"
      },
      backgroundImage: {
        mesh:
          "radial-gradient(circle at 10% 20%, rgba(11,114,133,0.14), transparent 28%), radial-gradient(circle at 90% 0%, rgba(199,119,26,0.12), transparent 26%), linear-gradient(180deg, rgba(255,255,255,0.92), rgba(238,243,245,0.72))"
      }
    }
  },
  plugins: []
};

export default config;
