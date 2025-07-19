import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // This 'base' property is the key to fixing the blank page on GitHub Pages.
  // It tells Vite that your app will be served from a subdirectory
  // named 'pantrypal' instead of the root of the domain.
  base: '/pantrypal/', 
  plugins: [react()],
})
