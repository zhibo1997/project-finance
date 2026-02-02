import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  define: {
    'process.env.NODE_ENV': `"${process.env.NODE_ENV}"`,
  },
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.includes('fl-') || tag.includes('sl-'),
        },
      },
    }),
  ],
  build: {
    target: 'modules',
    minify: true,
    rollupOptions: {
      input: 'src/main.ts',
      treeshake: true,
      output: {
        entryFileNames: 'main.[hash].js',
        assetFileNames: 'asset.[name].[hash].[ext]',
        chunkFileNames: 'chunk.[name].[hash].js',
      },
      preserveEntrySignatures: 'exports-only',
    },
    outDir: 'dist',
    assetsDir: '.',
  },
  envDir: '../../../../config',
});
