import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/HomePage.vue'
import ProjectApplication from '@/pages/ProjectApplication.vue'
import ProjectListPage from '@/pages/ProjectListPage.vue'

// 定义路由配置
const routes = [
  {
    path: '/',
    name: 'projects',
    component: ProjectListPage,
  },
  {
    path: '/accountingList',
    name: 'accountingList',
    component: HomePage,
  },
  {
    path: '/application',
    name: 'application',
    component: ProjectApplication,
  },
  {
    path: '/about',
    name: 'about',
    component: {
      template: '<div class="text-center text-xl p-8">About Page - Coming Soon</div>',
    },
  },
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
