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
                background: "#050505", // Deepest black
                foreground: "#Eaeaea", // Soft white
                brand: {
                    gold: "#FFD700", // Premium Gold
                    neon: "#00FF9C", // Cyber Neon
                    dark: "#0A0A0A", // Secondary Black
                    surface: "rgba(255, 255, 255, 0.05)", // Glassmorphism base
                    cool: "#00BFFF", // Cool blue
                    warm: "#FF6B6B", // Warm red
                    vibrant: "#9C27B0", // Vibrant purple
                }
            },
            fontFamily: {
                sans: ["var(--font-inter)"],
                heading: ["var(--font-oswald)"],
            },
            backgroundImage: {
                "premium-gradient": "linear-gradient(135deg, #050505 0%, #1a1a1a 100%)",
                "gold-glow": "radial-gradient(circle at center, rgba(255, 215, 0, 0.15) 0%, transparent 70%)",
            },
            animation: {
                "fade-in": "fadeIn 0.6s ease-out forwards",
                "slide-up": "slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
                "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
            },
            keyframes: {
                fadeIn: {
                    "0%": { opacity: "0" },
                    "100%": { opacity: "1" },
                },
                slideUp: {
                    "0%": { transform: "translateY(20px)", opacity: "0" },
                    "100%": { transform: "translateY(0)", opacity: "1" },
                }
            },
        },
    },
    plugins: [],
};
export default config;
