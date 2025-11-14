import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic',
    }),
  ],
  resolve: {
    dedupe: ['react', 'react-dom', '@emotion/react', '@emotion/styled', 'framer-motion', 'react-is'],
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react/jsx-runtime',
      '@mui/material',
      '@mui/utils',
      '@emotion/react',
      '@emotion/styled',
      'framer-motion',
      'prop-types',
      'react-is',
    ],
    exclude: ['@mui/material/styles'],
    esbuildOptions: {
      jsx: 'automatic',
      // Enable CommonJS interop for CommonJS modules
      format: 'esm',
    },
    // Force re-optimization of CommonJS modules
    force: false,
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    // Code splitting configuration
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react/jsx-runtime'],
          'mui-vendor': ['@mui/material', '@mui/icons-material', '@emotion/react', '@emotion/styled'],
          'form-vendor': ['react-hook-form', '@hookform/resolvers', 'zod'],
          'utils-vendor': ['axios', 'zustand'],
          'animation-vendor': ['framer-motion'],
        },
      },
    },
    // Enable source maps for better debugging
    sourcemap: false,
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
    // CSS code splitting
    cssCodeSplit: true,
  },
  server: {
    port: 5173,
    host: 'localhost',
    strictPort: false,
    watch: {
      usePolling: false,
    },
    fs: {
      strict: false,
    },
    // Disable aggressive caching in development
    headers: {
      'Cache-Control': 'no-store',
    },
    // Explicit HMR configuration for WebSocket connections
    hmr: {
      host: 'localhost',
      port: 5173,
      protocol: 'ws',
    },
  },
  // Preview server configuration for production-like testing
  preview: {
    headers: {
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  },
})
