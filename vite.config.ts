import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import path from 'path';
import fs from 'fs';

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
      protocolImports: true,
    }),
    {
      name: 'serve-contracts-middleware',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url && req.url.startsWith('/contracts/')) {
            const relativePath = req.url.replace(/^\/contracts\//, '').split('?')[0];
            const filePath = path.resolve(__dirname, 'contracts', relativePath);
            if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
              const ext = path.extname(filePath);
              const mimeTypes: Record<string, string> = {
                '.json': 'application/json',
                '.js': 'application/javascript',
                '.prover': 'application/octet-stream',
                '.verifier': 'application/octet-stream',
                '.zkir': 'application/octet-stream',
                '.bzkir': 'application/octet-stream',
              };
              res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream');
              res.setHeader('Access-Control-Allow-Origin', '*');
              fs.createReadStream(filePath).pipe(res);
              return;
            }
          }
          next();
        });
      },
    },
  ],
  resolve: {
    alias: {
      buffer: 'buffer',
      process: 'process/browser',
    },
  },
  server: {
    port: 5173,
    host: '127.0.0.1',
    cors: true,
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
    },
  },
});
