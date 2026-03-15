import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // MUST be your absolute GitHub Pages URL to prevent Auth0 domain hijacking
  base: 'https://AltF0x4.github.io/ACUL-Items/', 
})
