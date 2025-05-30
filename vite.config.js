import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    host: true, // Escucha en todas las interfaces de red
    port: 5173, // Puerto específico
    strictPort: false, // Permite buscar otro puerto si 5173 está ocupado
    cors: true, // Habilita CORS
    hmr: {
      overlay: true, // Muestra errores en overlay
    },
  },
});
