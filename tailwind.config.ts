import type { Config } from 'tailwindcss'

// In Tailwind v4, theme colors/fonts are defined via @theme in globals.css.
// This config is kept for content scanning and any future plugins.
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
}

export default config
