import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'

// Inline Tailwind configuration to avoid a separate tailwind.config.js file
const tailwindConfig = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', '"Times New Roman"', 'serif'],
      },
      colors: {
        luxury: '#111111',
        gold: '#C6A769',
        background: '#F8F5F0',
        text: '#1F1F1F',
        muted: '#6B7280',
        ivory: {
          50: '#fefdfb',
          100: '#f8f4ec',
          200: '#f0e8d8',
          300: '#e8dcc4',
          400: '#e0d0b0',
          500: '#d8c49c',
          600: '#cdb887',
        },
        'rose-gold': {
          50: '#faf7f8',
          100: '#f5eff0',
          200: '#e8dfe1',
          300: '#dccfd2',
          400: '#c9a9b0',
          500: '#b76e79',
          600: '#b3646e',
          700: '#9d5460',
        },
        charcoal: {
          50: '#f8f8f8',
          100: '#f0f0f0',
          300: '#d4d4d4',
          500: '#626262',
          600: '#2e2e2e',
          700: '#1a1a1a',
          900: '#0a0a0a',
        },
      },
      boxShadow: {
        soft: '0 6px 18px -8px rgba(0, 0, 0, 0.25)',
        gentle: '0 10px 26px -10px rgba(0, 0, 0, 0.3)',
      },
      transitionDuration: {
        250: '250ms',
      }
    },
  },
  plugins: [],
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  css: {
    postcss: {
      plugins: [
        tailwindcss(tailwindConfig),
        autoprefixer(),
      ]
    }
  },
  build: {
    target: 'esnext',
    minify: 'terser',
    sourcemap: false,
  }
})
