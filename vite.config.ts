import { defineConfig } from 'vite'
import path from 'path'
import React from '@vitejs/plugin-react'
import Pages from 'vite-plugin-pages'
import Svgr from 'vite-plugin-svgr'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    React(),
    Pages(),
    Svgr()
  ],
  server: {
    watch: {
      usePolling: true
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  define: {
    'process.env': {}
  }
})
