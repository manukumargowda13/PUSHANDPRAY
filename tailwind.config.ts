import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        // Midnight Navy - Authoritative, Trustworthy, Institutional
        navy: {
          950: "#060D17",
          900: "#0B192C",
          850: "#0F2137",
          800: "#162B45",
          700: "#1E3A5F",
          600: "#2B4C77",
          100: "#E7EEF7",
          50: "#F2F6FB",
        },
        // Warm Ivory - Soft, Human, Accessible Background
        ivory: {
          900: "#3D382E",
          800: "#575043",
          300: "#D6CEBF",
          200: "#E8E2D5",
          100: "#F3EFE6",
          50: "#FAF8F3",
          DEFAULT: "#FBF9F4",
        },
        // Muted Teal - Primary Clean Energy & Grid Accent
        teal: {
          900: "#134E4A",
          800: "#115E59",
          700: "#0F766E",
          600: "#0D9488",
          500: "#14B8A6",
          100: "#CCFBF1",
          50: "#F0FDFA",
        },
        // Subtle Amber / Solar Saffron - Energy, Sunlight, Warm Guidance
        saffron: {
          900: "#7C2D12",
          800: "#9A3412",
          700: "#C2410C",
          600: "#D97706",
          500: "#F59E0B",
          100: "#FEF3C7",
          50: "#FFFBEB",
        },
        // Limited Natural Green - Compliance & Environmental Verification
        naturalGreen: {
          900: "#14532D",
          800: "#166534",
          700: "#15803D",
          600: "#16A34A",
          100: "#DCFCE7",
          50: "#F0FDF4",
        },
        primary: {
          DEFAULT: "#0F2137", // Midnight Navy
          hover: "#0B192C",
          foreground: "#FBF9F4",
        },
        secondary: {
          DEFAULT: "#0F766E", // Muted Teal
          hover: "#115E59",
          foreground: "#FFFFFF",
        },
        energy: {
          coal: "#334155", // Charcoal Slate
          gas: "#D97706", // Amber
          nuclear: "#7E22CE", // Deep Purple
          hydro: "#0284C7", // Sky Blue
          solar: "#D97706", // Saffron / Warm Amber
          wind: "#0F766E", // Muted Teal
          otherRE: "#059669", // Natural Green
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        xl: "0.75rem",
        lg: "0.5rem",
        md: "calc(0.5rem - 2px)",
        sm: "calc(0.5rem - 4px)",
      },
      boxShadow: {
        warm: "0 1px 3px 0 rgba(15, 33, 55, 0.05), 0 1px 2px -1px rgba(15, 33, 55, 0.05)",
        card: "0 2px 6px -1px rgba(15, 33, 55, 0.06), 0 2px 4px -2px rgba(15, 33, 55, 0.04)",
        lifted: "0 10px 25px -5px rgba(15, 33, 55, 0.08), 0 8px 10px -6px rgba(15, 33, 55, 0.04)",
      },
    },
  },
  plugins: [],
};

export default config;
