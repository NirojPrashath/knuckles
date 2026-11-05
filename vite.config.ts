import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (id.includes('react-dom') || id.includes('/react/') || id.includes('scheduler')) return 'react'
          if (id.includes('@radix-ui')) return 'radix'
          if (id.includes('/motion/')) return 'motion'
          if (id.includes('lucide-react') || id.includes('@iconify')) return 'icons'
          return 'vendor'
        },
      },
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5175,
    strictPort: true,
    allowedHosts: true,
    hmr: { clientPort: 443, protocol: 'wss' },
  },
})
