<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, Calendar, User, Building2, LayoutGrid, Edit3, Copy, Trash2, FileText, Download } from 'lucide-vue-next'
import { useProject } from '../composables/useProject'
import { useAuth } from '../composables/useAuth'
import { formatCurrency, formatDate } from '../utils'
import type { ProjectStatus } from '../types/project'

const route = useRoute()
const router = useRouter()
const projectId = route.params.id as string

const {
  currentProject,
  loading,
  getProject,
  deleteProject,
  copyProject,
  changeProjectStatus
} = useProject()

const {
  currentUser,
  currentRoleConfig,
  canEditProject,
  canDeleteProject,
  canCopyProject,
  canCloseProject
} = useAuth()

// 状态标签配置
const statusConfig = {
  draft: { label: '立项中(草稿箱)', color: 'yellow' },
  submitted: { label: '立项中(已提交)', color: 'orange' },
  completed: { label: '已完成', color: 'green' },
  closed: { label: '已结项', color: 'gray' }
}

onMounted(() => {
  getProject(projectId)
})

// 计算项目财务数据
const financialData = computed(() => {
  if (!currentProject.value) return { totalRevenue: 0, totalCost: 0, profit: 0, profitMargin: 0 }

  const formData = currentProject.value.formData

  // 计算服务收入
  const totalRevenue = formData.serviceIncome.reduce((sum, item) => sum + item.amount, 0)

  // 计算外采成本
  const outsourcingCost = formData.outsourcingCost.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0)

  // 计算人工成本
  const laborCost = formData.laborCost.reduce((sum, item) => sum + (item.dailyCost * item.days), 0)

  // 计算其他费用
  const otherExpenses = formData.otherExpenses.reduce((sum, item) => sum + item.amount, 0)

  // 总费用
  const totalCost = outsourcingCost + laborCost + otherExpenses

  // 毛利润和利润率
  const profit = totalRevenue - totalCost
  const profitMargin = totalRevenue > 0 ? (profit / totalRevenue) * 100 : 0

  return {
    totalRevenue,
    totalCost,
    profit,
    profitMargin,
    outsourcingCost,
    laborCost,
    otherExpenses
  }
})

// 事件处理函数
const handleBack = () => {
  router.push('/')
}

const handleEditProject = () => {
  router.push(`/project/edit/${projectId}`)
}

const handleDeleteProject = async () => {
  if (confirm('确定要删除该项目吗？')) {
    try {
      await deleteProject(projectId)
      router.push('/')
    } catch (error) {
      console.error('删除项目失败:', error)
    }
  }
}

const handleCopyProject = async () => {
  try {
    const copied = await copyProject(projectId)
    if (copied) {
      alert('项目复制成功')
      router.push(`/project/edit/${copied.id}`)
    }
  } catch (error) {
    console.error('复制项目失败:', error)
  }
}

const handleCloseProject = async () => {
  if (confirm('确定要结项该项目吗？')) {
    try {
      await changeProjectStatus(projectId, { status: 'closed' })
      alert('项目结项成功')
      getProject(projectId) // 刷新数据
    } catch (error) {
      console.error('结项项目失败:', error)
    }
  }
}

const handleSubmitProject = async () => {
  if (confirm('确定要提交该项目吗？')) {
    try {
      await changeProjectStatus(projectId, { status: 'submitted' })
      alert('项目提交成功')
      getProject(projectId) // 刷新数据
    } catch (error) {
      console.error('提交项目失败:', error)
    }
  }
}

const handleCompleteProject = async () => {
  if (confirm('确定要标记该项目为已完成吗？')) {
    try {
      await changeProjectStatus(projectId, { status: 'completed' })
      alert('项目标记为已完成')
      getProject(projectId) // 刷新数据
    } catch (error) {
      console.error('标记项目完成失败:', error)
    }
  }
}

// 导出Excel功能
const handleExportExcel = () => {
  // 这里可以实现导出Excel的功能
  alert('导出功能开发中...')
}
</script>

<template>
  <div class="min-h-screen bg-[#F5F5F7] text-[#1D1D1F] font-sans pb-12">
    <!-- 页面顶部导航 -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <button
              @click="handleBack"
              class="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft :size="18" />
              返回项目列表
            </button>
            <div class="h-6 w-px bg-gray-300"></div>
            <h1 class="text-xl font-bold text-gray-900">{{ currentProject?.projectName }}</h1>
            <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
              :class="currentProject?.status === 'completed'
                ? 'bg-green-100 text-green-800'
                : currentProject?.status === 'submitted'
                ? 'bg-orange-100 text-orange-800'
                : currentProject?.status === 'closed'
                ? 'bg-gray-100 text-gray-800'
                : 'bg-yellow-100 text-yellow-800'"
            >
              {{ currentProject ? statusConfig[currentProject.status].label : '加载中...' }}
            </span>
          </div>

          <!-- 操作按钮 -->
          <div class="flex items-center gap-3">
            <button
              @click="handleExportExcel"
              class="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Download :size="16" />
              导出Excel
            </button>

            <button
              v-if="canEditProject(currentProject?.status as ProjectStatus || '', currentProject?.projectLeader || '')"
              @click="handleEditProject"
              class="flex items-center gap-2 px-4 py-2 text-sm text-orange-600 bg-white border border-orange-300 rounded-lg hover:bg-orange-50 transition-colors"
            >
              <Edit3 :size="16" />
              编辑项目
            </button>

            <button
              v-if="canCopyProject(currentProject?.status as ProjectStatus || '')"
              @click="handleCopyProject"
              class="flex items-center gap-2 px-4 py-2 text-sm text-green-600 bg-white border border-green-300 rounded-lg hover:bg-green-50 transition-colors"
            >
              <Copy :size="16" />
              复制项目
            </button>

            <button
              v-if="canCloseProject(currentProject?.projectLeader || '')"
              @click="handleCloseProject"
              class="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Trash2 :size="16" />
              结项项目
            </button>

            <!-- 状态操作按钮 -->
            <template v-if="currentProject?.status === 'draft'">
              <button
                @click="handleSubmitProject"
                class="flex items-center gap-2 px-4 py-2 text-sm text-purple-600 bg-white border border-purple-300 rounded-lg hover:bg-purple-50 transition-colors"
              >
                提交项目
              </button>
            </template>
            <template v-else-if="currentProject?.status === 'submitted'">
              <button
                @click="handleCompleteProject"
                class="flex items-center gap-2 px-4 py-2 text-sm text-green-600 bg-white border border-green-300 rounded-lg hover:bg-green-50 transition-colors"
              >
                标记完成
              </button>
            </template>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <!-- 项目概览卡片 -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <!-- 项目信息卡片 -->
        <div class="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <h2 class="text-lg font-semibold mb-4 flex items-center gap-2">
            <LayoutGrid :size="20" class="text-gray-500" />
            项目信息
          </h2>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-500 mb-1">项目编号</label>
              <p class="text-sm text-gray-900">{{ currentProject?.id }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-500 mb-1">项目负责人</label>
              <p class="text-sm text-gray-900 flex items-center gap-2">
                <User :size="16" class="text-gray-400" />
                {{ currentProject?.projectLeader }}
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-500 mb-1">客户名称</label>
              <p class="text-sm text-gray-900 flex items-center gap-2">
                <Building2 :size="16" class="text-gray-400" />
                {{ currentProject?.clientName }}
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-500 mb-1">项目类型</label>
              <p class="text-sm text-gray-900">{{ currentProject?.projectType }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-500 mb-1">服务周期</label>
              <p class="text-sm text-gray-900 flex items-center gap-2">
                <Calendar :size="16" class="text-gray-400" />
                {{ currentProject ? `${formatDate(currentProject.serviceStartDate)} 至 ${formatDate(currentProject.serviceEndDate)}` : '' }}
              </p>
            </div>
          </div>
        </div>

        <!-- 财务概览卡片 -->
        <div class="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <h2 class="text-lg font-semibold mb-4 flex items-center gap-2">
            <FileText :size="20" class="text-gray-500" />
            财务概览
          </h2>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-500 mb-1">服务总金额</label>
              <p class="text-sm font-semibold text-green-600">{{ formatCurrency(financialData.totalRevenue) }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-500 mb-1">总成本</label>
              <p class="text-sm font-semibold text-red-600">{{ formatCurrency(financialData.totalCost) }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-500 mb-1">毛利润</label>
              <p class="text-sm font-semibold" :class="financialData.profit >= 0 ? 'text-green-600' : 'text-red-600'">
                {{ formatCurrency(financialData.profit) }}
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-500 mb-1">利润率</label>
              <p class="text-sm font-semibold" :class="financialData.profitMargin >= 0 ? 'text-green-600' : 'text-red-600'">
                {{ financialData.profitMargin.toFixed(1) }}%
              </p>
            </div>
          </div>

          <div class="mt-6 pt-4 border-t border-gray-200">
            <h3 class="text-sm font-medium text-gray-700 mb-3">成本详情</h3>
            <div class="space-y-2">
              <div class="flex justify-between text-sm">
                <span class="text-gray-500">外采成本:</span>
                <span class="text-gray-900">{{ formatCurrency(financialData.outsourcingCost) }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-500">人工成本:</span>
                <span class="text-gray-900">{{ formatCurrency(financialData.laborCost) }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-500">其他费用:</span>
                <span class="text-gray-900">{{ formatCurrency(financialData.otherExpenses) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 项目成员卡片 -->
        <div class="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <h2 class="text-lg font-semibold mb-4 flex items-center gap-2">
            <User :size="20" class="text-gray-500" />
            项目成员
          </h2>

          <div class="space-y-3">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <User :size="20" class="text-blue-600" />
              </div>
              <div>
                <p class="text-sm font-medium text-gray-900">{{ currentProject?.projectLeader }}</p>
                <p class="text-xs text-gray-500">负责人</p>
              </div>
            </div>

            <div class="pt-3 border-t border-gray-100">
              <h3 class="text-xs font-medium text-gray-500 mb-2">项目成员</h3>
              <div class="space-y-2">
                <div
                  v-for="member in currentProject?.formData.basicInfo.projectMembers"
                  :key="member"
                  class="flex items-center gap-3"
                >
                  <div class="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <User :size="16" class="text-gray-500" />
                  </div>
                  <p class="text-sm text-gray-900">{{ member }}</p>
                </div>
                <p v-if="(!currentProject?.formData.basicInfo.projectMembers || currentProject.formData.basicInfo.projectMembers.length === 0)" class="text-sm text-gray-500 italic">
                  暂无项目成员
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 项目详细信息 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <!-- 项目背景和需求 -->
        <div class="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <h2 class="text-lg font-semibold mb-4">项目背景</h2>
          <p class="text-sm text-gray-700 leading-relaxed">{{ currentProject?.formData.basicInfo.projectBackground }}</p>
        </div>

        <div class="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <h2 class="text-lg font-semibold mb-4">客户需求</h2>
          <p class="text-sm text-gray-700 leading-relaxed">{{ currentProject?.formData.basicInfo.clientDemand }}</p>
        </div>

        <!-- 服务内容 -->
        <div class="bg-white rounded-lg border border-gray-200 shadow-sm p-6 lg:col-span-2">
          <h2 class="text-lg font-semibold mb-4">服务内容</h2>
          <p class="text-sm text-gray-700 leading-relaxed">{{ currentProject?.formData.basicInfo.serviceContent }}</p>
        </div>
      </div>

      <!-- 服务收入详情 -->
      <div class="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-8">
        <h2 class="text-lg font-semibold mb-4">服务收入详情</h2>
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead class="bg-gray-50 text-gray-600 font-medium">
              <tr>
                <th class="px-4 py-2">采购内容</th>
                <th class="px-4 py-2">必要性描述</th>
                <th class="px-4 py-2">含税金额</th>
                <th class="px-4 py-2">税率</th>
                <th class="px-4 py-2">不含税金额</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr
                v-for="item in currentProject?.formData.serviceIncome"
                :key="item.id"
                class="hover:bg-gray-50"
              >
                <td class="px-4 py-3">{{ item.purchaseContent }}</td>
                <td class="px-4 py-3">{{ item.necessityDesc }}</td>
                <td class="px-4 py-3 font-semibold text-green-600">{{ formatCurrency(item.amount) }}</td>
                <td class="px-4 py-3">{{ item.taxRate }}%</td>
                <td class="px-4 py-3 font-semibold">{{ formatCurrency(item.amount / (1 + item.taxRate / 100)) }}</td>
              </tr>
              <tr v-if="(!currentProject?.formData.serviceIncome || currentProject.formData.serviceIncome.length === 0)">
                <td colspan="5" class="px-4 py-3 text-center text-gray-500 italic">
                  暂无服务收入记录
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 成本详情 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <!-- 外采成本 -->
        <div class="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <h2 class="text-lg font-semibold mb-4">外采成本</h2>
          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm">
              <thead class="bg-gray-50 text-gray-600 font-medium">
                <tr>
                  <th class="px-4 py-2">采购内容</th>
                  <th class="px-4 py-2">单价</th>
                  <th class="px-4 py-2">数量</th>
                  <th class="px-4 py-2">小计</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr
                  v-for="item in currentProject?.formData.outsourcingCost"
                  :key="item.id"
                  class="hover:bg-gray-50"
                >
                  <td class="px-4 py-3">{{ item.content }}</td>
                  <td class="px-4 py-3">{{ formatCurrency(item.unitPrice) }}</td>
                  <td class="px-4 py-3">{{ item.quantity }}</td>
                  <td class="px-4 py-3 font-semibold text-red-600">{{ formatCurrency(item.unitPrice * item.quantity) }}</td>
                </tr>
                <tr v-if="(!currentProject?.formData.outsourcingCost || currentProject.formData.outsourcingCost.length === 0)">
                  <td colspan="4" class="px-4 py-3 text-center text-gray-500 italic">
                    暂无外采成本记录
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 人工成本 -->
        <div class="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <h2 class="text-lg font-semibold mb-4">人工成本</h2>
          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm">
              <thead class="bg-gray-50 text-gray-600 font-medium">
                <tr>
                  <th class="px-4 py-2">员工姓名</th>
                  <th class="px-4 py-2">级别</th>
                  <th class="px-4 py-2">日成本</th>
                  <th class="px-4 py-2">投入天数</th>
                  <th class="px-4 py-2">小计</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr
                  v-for="item in currentProject?.formData.laborCost"
                  :key="item.id"
                  class="hover:bg-gray-50"
                >
                  <td class="px-4 py-3">{{ item.employeeName }}</td>
                  <td class="px-4 py-3">{{ item.level }}</td>
                  <td class="px-4 py-3">{{ formatCurrency(item.dailyCost) }}</td>
                  <td class="px-4 py-3">{{ item.days }}</td>
                  <td class="px-4 py-3 font-semibold text-red-600">{{ formatCurrency(item.dailyCost * item.days) }}</td>
                </tr>
                <tr v-if="(!currentProject?.formData.laborCost || currentProject.formData.laborCost.length === 0)">
                  <td colspan="5" class="px-4 py-3 text-center text-gray-500 italic">
                    暂无人工成本记录
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 其他费用 -->
        <div class="bg-white rounded-lg border border-gray-200 shadow-sm p-6 lg:col-span-2">
          <h2 class="text-lg font-semibold mb-4">其他费用</h2>
          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm">
              <thead class="bg-gray-50 text-gray-600 font-medium">
                <tr>
                  <th class="px-4 py-2">费用类型</th>
                  <th class="px-4 py-2">金额</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr
                  v-for="item in currentProject?.formData.otherExpenses"
                  :key="item.id"
                  class="hover:bg-gray-50"
                >
                  <td class="px-4 py-3">{{ item.category }}</td>
                  <td class="px-4 py-3 font-semibold text-red-600">{{ formatCurrency(item.amount) }}</td>
                </tr>
                <tr v-if="(!currentProject?.formData.otherExpenses || currentProject.formData.otherExpenses.length === 0)">
                  <td colspan="2" class="px-4 py-3 text-center text-gray-500 italic">
                    暂无其他费用记录
                  </td>
                </tr>
              </tbody>
            </table>
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