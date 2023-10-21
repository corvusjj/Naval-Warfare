import { resolve } from 'path';
import { defineConfig, } from 'vite';

export default defineConfig({
    server: {
        watch: {
            usePolling: true
        }
    },
    build: {
        rollupOptions: {
          input: {
            main: resolve(__dirname, './src/pages/game.html'),
            // nested: resolve(__dirname, 'nested/index.html'),
          },
        },
      },
})