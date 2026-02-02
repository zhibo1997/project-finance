<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { FolderOpen, CheckCircle, Clock } from 'lucide-vue-next'
import { PROJECT_LIST_DATA, type Project, type ProjectStatus, formatCurrency } from '../data/projectListData'

const router = useRouter()
const projects = ref<Project[]>(PROJECT_LIST_DATA)
const statusFilter = ref<ProjectStatus | 'all'>('all')

const filteredProjects = computed(() => {
  if (statusFilter.value === 'all') {
    return projects.value
  }
  return projects.value.filter(project => project.status === statusFilter.value)
})

const navigateToProjects = () => {
  router.push('/projects')
}
</script>

<template>
  <div class="min-h-screen bg-[#F5F5F7] text-[#1D1D1F] font-sans pb-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      <!-- 页面标题和操作按钮 -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 tracking-tight">项目看板</h1>
          <p class="mt-2 text-sm text-gray-600">
            项目概览与状态管理
          </p>
        </div>
        <button
          @click="navigateToProjects"
          class="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors shadow-sm"
        >
          <FolderOpen :size="18" />
          项目列表
        </button>
      </div>

      <!-- 项目状态看板 -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- 已完成项目 -->
        <div class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div class="bg-green-50 px-4 py-3 border-b border-green-200 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 bg-green-500 rounded-full"></div>
              <h3 class="font-semibold text-green-800">已完成项目</h3>
            </div>
            <span class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">{{
              projects.filter(p => p.status === '已完成').length
            }}</span>
          </div>
          <div class="p-4 space-y-3 max-h-[500px] overflow-y-auto">
            <div
              v-for="project in projects.filter(p => p.status === '已完成')"
              :key="project.id"
              class="p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors"
            >
              <div class="flex items-center justify-between mb-2">
                <h4 class="font-medium text-gray-900 text-sm">{{ project.projectName }}</h4>
                <span class="text-xs text-green-600 flex items-center gap-1">
                  <CheckCircle :size="12" />
                  已完成
                </span>
              </div>
              <div class="flex items-center justify-between text-xs text-gray-500">
                <span>{{ project.clientName }}</span>
                <span>{{ formatCurrency(project.serviceAmount) }}</span>
              </div>
            </div>
            <div v-if="projects.filter(p => p.status === '已完成').length === 0" class="text-center py-8 text-gray-400 text-sm">
              暂无已完成项目
            </div>
          </div>
        </div>

        <!-- 立项中(草稿箱)项目 -->
        <div class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div class="bg-yellow-50 px-4 py-3 border-b border-yellow-200 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <h3 class="font-semibold text-yellow-800">立项中(草稿箱)</h3>
            </div>
            <span class="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">{{
              projects.filter(p => p.status === '立项中').length
            }}</span>
          </div>
          <div class="p-4 space-y-3 max-h-[500px] overflow-y-auto">
            <div
              v-for="project in projects.filter(p => p.status === '立项中')"
              :key="project.id"
              class="p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors"
            >
              <div class="flex items-center justify-between mb-2">
                <h4 class="font-medium text-gray-900 text-sm">{{ project.projectName }}</h4>
                <span class="text-xs text-yellow-600 flex items-center gap-1">
                  <Clock :size="12" />
                  立项中
                </span>
              </div>
              <div class="flex items-center justify-between text-xs text-gray-500">
                <span>{{ project.clientName }}</span>
                <span>{{ formatCurrency(project.serviceAmount) }}</span>
              </div>
            </div>
            <div v-if="projects.filter(p => p.status === '立项中').length === 0" class="text-center py-8 text-gray-400 text-sm">
              暂无立项中项目
            </div>
          </div>
        </div>
      </div>

      <!-- 项目统计信息 -->
      <div class="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">项目统计</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="text-center">
            <div class="text-2xl font-bold text-gray-900">{{ projects.length }}</div>
            <div class="text-xs text-gray-500 mt-1">总项目数</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-green-600">{{ projects.filter(p => p.status === '已完成').length }}</div>
            <div class="text-xs text-gray-500 mt-1">已完成</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-yellow-600">{{ projects.filter(p => p.status === '立项中').length }}</div>
            <div class="text-xs text-gray-500 mt-1">立项中</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-blue-600">{{ formatCurrency(projects.reduce((sum, p) => sum + p.serviceAmount, 0)).replace('¥', '') }}</div>
            <div class="text-xs text-gray-500 mt-1">总金额</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 自定义滚动条 */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
