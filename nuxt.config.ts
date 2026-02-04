export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      title: '项目维度财务数据系统',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: '项目维度财务数据管理系统' }
      ]
    }
  },
  typescript: {
    strict: true,
    typeCheck: true
  },
  nitro: {
    compressPublicAssets: true,
    preset: 'node-server'
  },
  runtimeConfig: {
    public: {
      apiBase: '/api'
    },
    mysql: {
      host: process.env.MYSQL_HOST || '127.0.0.1',
      port: process.env.MYSQL_PORT || '3306',
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || '123456',
      database: process.env.MYSQL_DATABASE || 'ai-chat-database'
    }
  }
})
