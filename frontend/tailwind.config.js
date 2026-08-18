/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        void: '#14181B',
        panel: '#1B2124',
        panelBorder: '#2B3236',
        paper: '#F1EAD9',
        paperMuted: '#E4DDC8',
        ink: '#E7E1D2',
        inkMuted: '#98A099',
        brass: '#C89B4A',
        brassDark: '#8F6B2E',
        safe: '#4C8567',
        safeDark: '#33594A',
        risk: '#B14A3E',
        riskDark: '#7A2E27',
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        sans: ['"IBM Plex Sans"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
