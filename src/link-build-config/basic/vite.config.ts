import { defineConfig, } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import { uid } from 'uid';

const currentBuildId = uid(8);
export default defineConfig({
    define: {
        "process.env.NODE_ENV": '"'.concat(process.env.NODE_ENV, '"')
    },
    plugins: [
        vue({
            template: {
                compilerOptions: {
                    isCustomElement: function(tag) {
                        return tag.includes("fl-") || tag.includes("sl-");
                    }
                }
            }
        }),
    ],
    build: {
        target: 'es2015',
        minify: "terser",
        rollupOptions: {
            input: '#[slot("entry")]',
            treeshake: true,
            output: {
                entryFileNames: '[name].[hash].js',
                chunkFileNames: (assetsInfo) => {
                    console.log('chunk name: ', assetsInfo.name);
                    if (/\/+.*\.js/.test(assetsInfo.name)) {
                        const nameGroup = assetsInfo.name.split('/');
                        return `${nameGroup[0]}/[name].chunk.[hash].js`;
                    } else {
                        return `#[slot("group_id")]-share-${currentBuildId}/[name].chunk.[hash].js`;
                    }
                },
                assetFileNames: (assetsInfo) => {
                    console.log('asset name: ', assetsInfo.name);
                    if (/\/+.*\.css/.test(assetsInfo.name)) {
                        const nameGroup = assetsInfo.name.split('/');
                        return `${nameGroup[0]}/[name].asset.[hash].[ext]`;
                    } else {
                        return `#[slot("group_id")]-share-${currentBuildId}/[name].asset.[hash].[ext]`;
                    }
                },
            },
            preserveEntrySignatures: 'exports-only',
        },
        outDir: 'dist',
        assetsDir: '.',
        emptyOutDir: true,
        terserOptions: {
            compress: {
                //生产环境时移除console
                drop_console: true,
                drop_debugger: true,
            },
        }
    },
    envDir: path.resolve(process.cwd(), 'config'),
    resolve: {
        alias: [
            {
                find: '@',
                replacement: `${__dirname}/#[slot("fl_page")]`,
                customResolver(importee, importer, _resolveOptions) {
                    const pageKey = /^(page-[^\/]+)\//.exec((importer ?? '').replace(__dirname + '/', ''))?.[1];
                    if (!pageKey) {
                        return this.resolve(importee, importer, _resolveOptions);
                    } else {
                        return this.resolve(
                            importee.replace('#[slot("fl_page")]', pageKey),
                            importer,
                            _resolveOptions,
                        );
                    }
                }
            }
        ]
    }
});
