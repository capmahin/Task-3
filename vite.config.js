import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
    root: 'src',
    publicDir: '../static',
    base: './',
    build: {
        outDir: 'dist',
        emptyOutDir: true,
        rollupOptions: {
            output: {
                assetFileNames: 'assets/[name].[ext]',
                chunkFileNames: 'assets/[name].js',
                entryFileNames: 'assets/[name].js'
            }
        }
    }
})