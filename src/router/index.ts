import { createRouter, createWebHistory } from 'vue-router'
import ProjectListPage from '@/pages/ProjectListPage.vue'
import HomePage from '@/pages/HomePage.vue'
import ConfigPage from '@/pages/ConfigPage.vue'
import ProjectDetailPage from '@/pages/ProjectDetailPage.vue'
import ProjectFormPage from '@/pages/ProjectFormPage.vue'
import AccountingPage from '@/pages/AccountingPage.vue'

// 定义路由配置
const routes = [
  {
    path: '/',
    name: 'projects',
    component: ProjectListPage,
  },
  {
    path: '/project/:id',
    name: 'projectDetail',
    component: ProjectDetailPage,
  },
  {
    path: '/project/create',
    name: 'projectCreate',
    component: ProjectFormPage,
  },
  {
    path: '/project/edit/:id',
    name: 'projectEdit',
    component: ProjectFormPage,
  },
  {
    path: '/accountingList',
    name: 'accountingList',
    component: HomePage,
  },
  {
    path: '/application',
    name: 'application',
    component: ProjectFormPage,
  },
  {
    path: '/accounting',
    name: 'accounting',
    component: AccountingPage,
    meta: {
      title: '记账管理',
      requiresAuth: true
    }
  },
  {
    path: '/config',
    name: 'config',
    component: ConfigPage,
    meta: {
      title: '配置管理',
      requiresAuth: true
    }
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
