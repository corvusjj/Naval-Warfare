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
            game: resolve(__dirname, './src/pages/game.html'),
            placement: resolve(__dirname, './src/pages/placement.html'),
          },
        },
      },
})