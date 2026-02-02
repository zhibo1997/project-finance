import { defineConfig, splitVendorChunkPlugin } from "vite";
import vue from "@vitejs/plugin-vue";
import UnpluginVite from "@enn/unplugin-ency-design/vite";
import path from "path";
import { uid } from 'uid';
const currentBuildId = uid(8);
export default defineConfig({
    define: {
        "process.env.NODE_ENV": '"'.concat(process.env.NODE_ENV, '"')
    },
    plugins: [
        // splitVendorChunkPlugin(),
        vue({
            template: {
                compilerOptions: {
                    isCustomElement: function(tag) {
                        return tag.includes("fl-") || tag.includes("sl-");
                    }
                }
            }
        }),
        UnpluginVite({}),
    ],
    build: {
        target: 'modules',
        minify: "esbuild",
        rollupOptions: {
            input: '#[slot("entry")]',
            treeshake: true,
            output: {
                entryFileNames: '[name].[hash].js',
                chunkFileNames: (assetsInfo) => {
                    console.log('chunk name: ', assetsInfo.name);
                    if (/\/+.*\.js/.test(assetsInfo.name)) {
                        const nameGroup = assetsInfo.name.split('/');
                        return `${nameGroup[0]}/[name].[hash].js`;
                    } else {
                        return `#[slot("group_id")]-share-${currentBuildId}/[name].[hash].js`;
                    }
                },
                assetFileNames: (assetsInfo) => {
                    console.log('asset name: ', assetsInfo.name);
                    if (/\/+.*\.css/.test(assetsInfo.name)) {
                        const nameGroup = assetsInfo.name.split('/');
                        return `${nameGroup[0]}/[name].[hash].[ext]`;
                    } else {
                        return `#[slot("group_id")]-share-${currentBuildId}/[name].[hash].[ext]`;
                    }
                },
            },
            preserveEntrySignatures: 'exports-only',
        },
        outDir: 'dist',
        assetsDir: '.',
        emptyOutDir: true,
    },
    envDir: path.resolve(process.cwd(), 'config'),
});
