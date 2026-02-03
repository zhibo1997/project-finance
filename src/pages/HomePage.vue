<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { LayoutGrid, Users, FileText, Settings, ArrowRight } from 'lucide-vue-next'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const {
  currentUser,
  currentRoleConfig,
  canCreateProjects,
  canBookkeepingIncome,
  canBookkeepingExpense
} = useAuth()

// 统计数据
const stats = ref({
  totalProjects: 12,
  activeProjects: 8,
  completedProjects: 4,
  totalRevenue: 2500000,
  totalCost: 1800000,
  profit: 700000
})

// 导航项
const navItems = [
  {
    title: '项目管理',
    description: '查看和管理所有项目',
    icon: LayoutGrid,
    path: '/',
    visible: () => true
  },
  {
    title: '记账管理',
    description: '收入和支出记账',
    icon: FileText,
    path: '/accounting',
    visible: () => true
  },
  {
    title: '团队成员',
    description: '管理项目成员',
    icon: Users,
    path: '/team',
    visible: () => currentUser.value.role === 'admin' || currentUser.value.role === 'project_manager'
  },
  {
    title: '系统配置',
    description: '费用类别和成本配置',
    icon: Settings,
    path: '/config',
    visible: () => currentUser.value.role === 'admin'
  }
]

// 最近项目
const recentProjects = ref([
  {
    id: 'P001',
    name: '社招新人文化融入项目',
    status: '已完成',
    leader: '任志祥',
    revenue: 254400
  },
  {
    id: 'P002',
    name: '数字化转型咨询项目',
    status: '进行中',
    leader: '赵六',
    revenue: 500000
  },
  {
    id: 'P003',
    name: '员工技能提升培训项目',
    status: '草稿',
    leader: '王五',
    revenue: 150000
  }
])

// 图表数据
const chartData = ref({
  projectsByMonth: [
    { month: '1月', count: 2 },
    { month: '2月', count: 3 },
    { month: '3月', count: 1 },
    { month: '4月', count: 4 },
    { month: '5月', count: 2 },
    { month: '6月', count: 5 }
  ],
  revenueByType: [
    { type: '培训项目', amount: 1200000 },
    { type: '咨询项目', amount: 800000 },
    { type: '技术服务', amount: 500000 }
  ]
})

// 导航方法
const navigateTo = (path: string) => {
  router.push(path)
}

const navigateToProject = (projectId: string) => {
  router.push(`/project/${projectId}`)
}

// 格式化金额
const formatCurrency = (amount: number) => {
  return amount.toLocaleString('zh-CN', { style: 'currency', currency: 'CNY', minimumFractionDigits: 2 })
}
</script>

<template>
  <div class="min-h-screen bg-[#F5F5F7] text-[#1D1D1F] font-sans">
    <!-- 页面标题 -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <h1 class="text-2xl font-bold text-gray-900">项目财务数据系统</h1>
        <p class="mt-2 text-sm text-gray-600">
          {{ currentRoleConfig.description }}
        </p>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <!-- 统计卡片 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-500">总项目数</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.totalProjects }}</p>
            </div>
            <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <LayoutGrid :size="20" class="text-blue-600" />
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-500">进行中项目</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.activeProjects }}</p>
            </div>
            <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Users :size="20" class="text-green-600" />
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-500">总营收</p>
              <p class="text-2xl font-bold text-blue-600">{{ formatCurrency(stats.totalRevenue) }}</p>
            </div>
            <div class="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <FileText :size="20" class="text-purple-600" />
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-500">毛利润</p>
              <p class="text-2xl font-bold text-green-600">{{ formatCurrency(stats.profit) }}</p>
            </div>
            <div class="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
              <Settings :size="20" class="text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      <!-- 导航卡片 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div
          v-for="item in navItems.filter(item => item.visible())"
          :key="item.title"
          class="bg-white rounded-lg border border-gray-200 shadow-sm p-6 hover:bg-gray-50 transition-colors cursor-pointer"
          @click="navigateTo(item.path)"
        >
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <component :is="item.icon" :size="24" class="text-blue-600" />
            </div>
            <ArrowRight :size="18" class="text-gray-400" />
          </div>
          <h3 class="text-lg font-semibold mb-2">{{ item.title }}</h3>
          <p class="text-sm text-gray-600">{{ item.description }}</p>
        </div>
      </div>

      <!-- 最近项目 -->
      <div class="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-8">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold">最近项目</h2>
          <button
            @click="navigateTo('/')"
            class="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            查看全部 <ArrowRight :size="14" />
          </button>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead class="bg-gray-50 text-gray-600 font-medium">
              <tr>
                <th class="px-4 py-2">项目名称</th>
                <th class="px-4 py-2">负责人</th>
                <th class="px-4 py-2">状态</th>
                <th class="px-4 py-2">营收</th>
                <th class="px-4 py-2">操作</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr
                v-for="project in recentProjects"
                :key="project.id"
                class="hover:bg-gray-50"
              >
                <td class="px-4 py-3 font-medium text-gray-900">{{ project.name }}</td>
                <td class="px-4 py-3 text-gray-700">{{ project.leader }}</td>
                <td class="px-4 py-3">
                  <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                    :class="project.status === '已完成'
                      ? 'bg-green-100 text-green-800'
                      : project.status === '进行中'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-yellow-100 text-yellow-800'"
                  >
                    {{ project.status }}
                  </span>
                </td>
                <td class="px-4 py-3 font-semibold text-green-600">{{ formatCurrency(project.revenue) }}</td>
                <td class="px-4 py-3">
                  <button
                    @click="navigateToProject(project.id)"
                    class="text-sm text-blue-600 hover:text-blue-700"
                  >
                    查看详情
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 图表区域 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- 月度项目数量 -->
        <div class="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <h2 class="text-lg font-semibold mb-4">月度项目数量</h2>
          <div class="h-64">
            <div class="flex items-center justify-center h-full text-gray-500">
              图表占位区域（待集成 ECharts）
            </div>
          </div>
        </div>

        <!-- 营收分布 -->
        <div class="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <h2 class="text-lg font-semibold mb-4">营收分布</h2>
          <div class="h-64">
            <div class="flex items-center justify-center h-full text-gray-500">
              图表占位区域（待集成 ECharts）
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 响应式优化 */
@media (max-width: 1024px) {
  .overflow-x-auto {
    -webkit-overflow-scrolling: touch;
    overflow-x: auto;
  }
}
</style>