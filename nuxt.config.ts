import AutoImport from "unplugin-auto-import/vite";
import { NaiveUiResolver } from "unplugin-vue-components/resolvers";
import Components from "unplugin-vue-components/vite";

export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [],
  css: ['~/app/assets/css/main.css'],
  app: {
    head: {
      title: '项目维度财务数据系统',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: '项目维度财务数据系统' }
      ]
    }
  },
  vite: {
    build: {
      sourcemap: 'hidden'
    },
    server: {
      port: 3001,
      host: '0.0.0.0'
    },    
    plugins: [
      AutoImport({
        imports: [
          {
            'naive-ui': [
              'useDialog',
              'useMessage',
              'useNotification',
              'useLoadingBar'
            ]
          }
        ]
      }),
      Components({
        resolvers: [NaiveUiResolver()]
      })
    ]
  },
  postcss: {
    plugins: {
      '@tailwindcss/postcss': {},
      autoprefixer: {}
    }
  }
})
