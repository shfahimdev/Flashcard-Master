import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:7001',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false, // Disable sourcemaps in production for security
    minify: 'terser', // Use terser for better minification
    rollupOptions: {
      input: {
        main: './index.html',
      },
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          charts: ['recharts'],
          animations: ['framer-motion'],
        },
      },
    },
  },
  // Define global constants for production builds
  define: {
    __APP_ENV__: JSON.stringify(process.env.NODE_ENV || 'development'),
  },
})