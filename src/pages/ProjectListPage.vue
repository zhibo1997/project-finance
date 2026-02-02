<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Plus, CheckCircle, Clock, LayoutGrid, Edit3 } from 'lucide-vue-next'
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

const handleAddProject = () => {
  window.location.href = 'http://localhost:3001/application'
}

const handleBookkeeping = () => {
  window.open('https://alidocs.dingtalk.com/i/nodes/dQPGYqjpJYpZo0qYtzRYj2vQVakx1Z5N?corpId=ding5aaad5806ea95bd7ee0f45d8e4f7c288&utm_medium=im_card&iframeQuery=viewId%3DBO1vR6p%26utm_medium%3Dim_card%26sheetId%3DJExS222%26utm_source%3Dim&utm_scene=team_space&utm_source=im', '_blank')
}

const handleEditProject = (projectId: string) => {
  console.log('编辑项目:', projectId)
  router.push('/application')
}

const navigateToDashboard = () => {
  router.push('/')
}
</script>

<template>
  <div class="min-h-screen bg-[#F5F5F7] text-[#1D1D1F] font-sans pb-12 flex flex-col">
    <div class="flex-1 flex flex-col">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex-1 flex flex-col">
        <!-- 页面标题和操作按钮 -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 tracking-tight">项目列表</h1>
            <p class="mt-2 text-sm text-gray-600">
              管理和查看所有项目信息，支持项目记账和状态筛选
            </p>
          </div>
          <div class="flex gap-3">
            <button
              @click="handleAddProject"
              class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm"
            >
              <Plus :size="18" />
              新增项目
            </button>
          </div>
        </div>

        <!-- 筛选和统计区域 -->
        <div class="bg-white rounded-lg border border-gray-200 shadow-sm p-4 mb-6">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div class="flex items-center gap-2">
              <span class="text-sm font-medium text-gray-700">项目状态筛选:</span>
              <button
                @click="statusFilter = 'all'"
                class="px-3 py-1.5 text-sm rounded-full transition-colors"
                :class="statusFilter === 'all'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
              >
                全部
              </button>
              <button
                @click="statusFilter = '已完成'"
                class="px-3 py-1.5 text-sm rounded-full transition-colors flex items-center gap-1"
                :class="statusFilter === '已完成'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
              >
                <CheckCircle :size="14" />
                已完成
              </button>
              <button
                @click="statusFilter = '立项中'"
                class="px-3 py-1.5 text-sm rounded-full transition-colors flex items-center gap-1"
                :class="statusFilter === '立项中'
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
              >
                <Clock :size="14" />
                立项中(草稿箱)
              </button>
            </div>

            <div class="flex items-center gap-6 text-sm">
              <div class="text-gray-600">
                总项目数: <span class="font-semibold text-gray-900">{{ projects.length }}</span>
              </div>
              <div class="text-gray-600">
                已筛选: <span class="font-semibold text-gray-900">{{ filteredProjects.length }}</span>
              </div>
              <div class="text-gray-600">
                总金额: <span class="font-semibold text-blue-600">{{
                  formatCurrency(filteredProjects.reduce((sum, p) => sum + p.serviceAmount, 0))
                }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 项目表格 -->
        <div class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden flex-1 flex flex-col">
          <div class="overflow-hidden flex-1 flex flex-col" style="height: 600px;">
            <div class="overflow-x-auto overflow-y-auto flex-1">
              <table class="w-full text-left border-collapse">
                <thead class="bg-gray-50 text-gray-600 text-sm font-medium sticky top-0 z-10">
                  <tr>
                    <!-- 左侧固定列 -->
                    <th class="px-3 py-2 border-b border-gray-200 bg-white shadow-sm sticky left-0 z-20 min-w-[120px]">项目编号</th>
                    <th class="px-3 py-2 border-b border-gray-200 bg-white shadow-sm sticky left-[120px] z-10 min-w-[200px]">项目名称</th>
                    <th class="px-3 py-2 border-b border-gray-200 bg-white shadow-sm sticky left-[320px] z-10 min-w-[100px]">负责人</th>
                    <th class="px-3 py-2 border-b border-gray-200 bg-white shadow-sm sticky left-[420px] z-10 min-w-[150px]">客户</th>
                    <!-- 可滚动列 -->
                    <th class="px-3 py-2 border-b border-gray-200 min-w-[100px]">服务开始时间</th>
                    <th class="px-3 py-2 border-b border-gray-200 min-w-[100px]">服务结束时间</th>
                    <th class="px-3 py-2 border-b border-gray-200 min-w-[120px]">服务金额</th>
                    <th class="px-3 py-2 border-b border-gray-200 min-w-[80px]">是否跨年</th>
                    <th class="px-3 py-2 border-b border-gray-200 min-w-[100px]">项目状态</th>
                    <th class="px-3 py-2 border-b border-gray-200 min-w-[120px]">项目归属</th>
                    <!-- 右侧固定列 -->
                    <th class="px-3 py-2 border-b border-gray-200 bg-white shadow-sm sticky right-0 z-20 min-w-[280px]">操作</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  <tr
                    v-for="project in filteredProjects"
                    :key="project.id"
                    class="hover:bg-gray-50 transition-colors text-sm"
                  >
                    <!-- 左侧固定列 -->
                    <td class="px-3 py-2 font-medium text-gray-900 bg-white sticky left-0 z-20">{{ project.id }}</td>
                    <td class="px-3 py-2 bg-white sticky left-[120px] z-10 font-medium text-gray-900 max-w-[200px] truncate" :title="project.projectName">{{ project.projectName }}</td>
                    <td class="px-3 py-2 bg-white sticky left-[320px] z-10 text-gray-700">{{ project.projectLeader }}</td>
                    <td class="px-3 py-2 bg-white sticky left-[420px] z-10 text-gray-700 max-w-[150px] truncate" :title="project.clientName">{{ project.clientName }}</td>
                    <!-- 可滚动列 -->
                    <td class="px-3 py-2 text-gray-700">{{ project.serviceStartDate }}</td>
                    <td class="px-3 py-2 text-gray-700">{{ project.serviceEndDate }}</td>
                    <td class="px-3 py-2 font-semibold text-green-600">{{ formatCurrency(project.serviceAmount) }}</td>
                    <td class="px-3 py-2">
                      <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                        :class="project.isCrossYear
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'"
                      >
                        {{ project.isCrossYear ? '是' : '否' }}
                      </span>
                    </td>
                    <td class="px-3 py-2">
                      <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                        :class="project.status === '已完成'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'"
                      >
                        {{ project.status === '已完成' ? '已完成' : '立项中' }}
                      </span>
                    </td>
                    <td class="px-3 py-2 text-gray-700">{{ project.projectType }}</td>
                    <!-- 右侧固定列 -->
                    <td class="px-3 py-2 bg-white sticky right-0 z-20">
                      <div class="flex items-center gap-2">
                        <button
                          @click="handleBookkeeping"
                          class="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
                        >
                          <span class="text-base">￥</span>
                          记账
                        </button>
                        <button
                          v-if="project.status === '立项中'"
                          @click="handleEditProject(project.id)"
                          class="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-orange-600 bg-orange-50 rounded-md hover:bg-orange-100 transition-colors"
                        >
                          <Edit3 :size="14" />
                          修改
                        </button>
                        <button
                          @click="navigateToDashboard"
                          class="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
                        >
                          <LayoutGrid :size="14" />
                          项目看板
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <!-- 表格底部 -->
          <div class="bg-gray-50 px-6 py-3 border-t border-gray-200 text-sm text-gray-600">
            显示 {{ filteredProjects.length }} 条项目记录
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 表格响应式优化 */
@media (max-width: 1024px) {
  .overflow-x-auto {
    -webkit-overflow-scrolling: touch;
    overflow-x: auto;
  }
}

/* 自定义滚动条 */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
