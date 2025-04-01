import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    proxy: {
      '/login': 'http://localhost:3000',
      '/users': 'http://localhost:3000',
      // Add more proxies as needed for other API routes
    },
  },
});
