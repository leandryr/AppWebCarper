import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteCompression from 'vite-plugin-compression';

export default defineConfig({
  plugins: [
    react(),
    viteCompression({ algorithm: 'gzip' }) // Habilita compresión Gzip
  ],
  build: {
    chunkSizeWarningLimit: 500, // Ajusta el límite de advertencia
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react')) return 'react-vendor'; // React separado
            if (id.includes('lodash')) return 'lodash'; // Separar lodash si lo usas
            return 'vendor'; // Otras dependencias
          }
        },
      },
    },
  },
});
