export default defineNuxtConfig({
  // 兼容性配置（Nuxt 4 必须）
  compatibilityDate: "2025-07-15",

  // 关闭 SSR（客户端渲染模式）
  ssr: false,

  // 模块配置 - 添加 Nuxt UI 和 Tailwind CSS 模块
  modules: ['@nuxt/ui', '@nuxtjs/tailwindcss'],

  // 目录结构配置
  srcDir: "app/",
  serverDir: "server/",

  // 应用配置
  app: {
    head: {
      title: '项目维度财务数据系统'
    }
  },

  // 开发工具配置
  devtools: { enabled: true },

  // 确保组件自动导入开启（Nuxt 4 默认配置）
  components: true,

  // CSS 配置
  css: [
    '~/assets/css/main.css'
  ],
})
