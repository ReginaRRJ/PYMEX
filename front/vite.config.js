import { defineConfig } from 'vite';
import path from 'path'; 
import process from 'process';
import react from '@vitejs/plugin-react-swc';
import { createRequire } from 'module'

const require = createRequire(import.meta.url)

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      process: require.resolve('process/browser'),
      stream: require.resolve('stream-browserify'),
      util: require.resolve('util'),
    },
  },
  define: {
    'process.env': {}, // evita errores de process.env
  },
  server: {
    proxy: {
      '/login': 'http://localhost:3000',
      '/users': 'http://localhost:3000',
    },
  },
});
