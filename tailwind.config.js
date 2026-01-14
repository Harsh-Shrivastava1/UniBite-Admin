/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        border: "#1f1f1f",
        input: "#1f1f1f",
        ring: "#333333",
        background: "#000000",
        foreground: "#ffffff",
        primary: {
          DEFAULT: "#ffffff",
          foreground: "#000000",
        },
        secondary: {
          DEFAULT: "#0a0a0a",
          foreground: "#b3b3b3",
        },
        destructive: {
          DEFAULT: "#333333",
          foreground: "#ffffff",
        },
        muted: {
          DEFAULT: "#111111",
          foreground: "#777777",
        },
        accent: {
          DEFAULT: "#111111",
          foreground: "#ffffff",
        },
        popover: {
          DEFAULT: "#111111",
          foreground: "#ffffff",
        },
        card: {
          DEFAULT: "#111111",
          foreground: "#ffffff",
        },
        // Strict mapping for bespoke needs if any
        main: "#000000",
        surface: "#0a0a0a",
        element: "#111111",
        soft: "#b3b3b3",
        faint: "#777777",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      },
      boxShadow: {
        'glow': '0 0 20px rgba(255, 255, 255, 0.15)',
        'glow-sm': '0 0 10px rgba(255, 255, 255, 0.1)',
      }
    },
  },
  plugins: [],
}
