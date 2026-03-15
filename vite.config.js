import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // This tells Vite that your app will be hosted at AltF0x4.github.io/ACUL-Items/
  base: '/ACUL-Items/', 
})
