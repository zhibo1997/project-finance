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
  devServer: {
    port: 3001,
    host: '0.0.0.0'
  },
  postcss: {
    plugins: {
      autoprefixer: {}
    }
  }
})
