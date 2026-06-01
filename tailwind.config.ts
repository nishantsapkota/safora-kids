import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        safety: {
          green: "#1f9d55",
          blue: "#2563eb",
          orange: "#f97316",
          ink: "#14213d"
        }
      },
      boxShadow: {
        soft: "0 12px 32px rgba(20, 33, 61, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
