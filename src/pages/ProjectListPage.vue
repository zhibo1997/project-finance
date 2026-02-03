<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Plus, CheckCircle, Clock, LayoutGrid, Edit3, User, Shield, Users, Building2, Search, Copy, Trash2 } from 'lucide-vue-next'
import { useProject } from '../composables/useProject'
import { useAuth } from '../composables/useAuth'
import { formatCurrency, formatDate } from '../utils'
import type { ProjectStatus, Project } from '../types/project'

const router = useRouter()
const {
  projects,
  loading,
  loadProjects,
  searchProjects,
  filterProjectsByStatus,
  deleteProject,
  copyProject,
  changeProjectStatus
} = useProject()

const {
  currentUser,
  currentRoleConfig,
  switchRole,
  initAuth,
  canViewAllProjects,
  canCreateProjects,
  canBookkeepingIncome,
  canBookkeepingExpense,
  canEditProjects,
  canViewProject,
  canEditProject,
  canDeleteProject,
  canCopyProject,
  canCloseProject
} = useAuth()

// 搜索和筛选
const searchKeyword = ref('')
const statusFilter = ref<ProjectStatus | 'all'>('all')

// 状态标签配置
const statusConfig = {
  draft: { label: '立项中(草稿箱)', icon: Clock, color: 'yellow' },
  submitted: { label: '立项中(已提交)', icon: Clock, color: 'orange' },
  completed: { label: '已完成', icon: CheckCircle, color: 'green' },
  closed: { label: '已结项', icon: Shield, color: 'gray' }
}

onMounted(() => {
  initAuth()
  loadProjects()
})

// 筛选和搜索后的项目列表
const filteredProjects = computed(() => {
  let filtered = projects.value

  // 根据角色过滤项目
  if (!canViewAllProjects.value) {
    filtered = filtered.filter(project => canViewProject(project.projectLeader, project.formData.basicInfo.projectMembers))
  }

  // 根据状态筛选
  if (statusFilter.value !== 'all') {
    filtered = filterProjectsByStatus(statusFilter.value)
  }

  // 搜索
  if (searchKeyword.value) {
    filtered = searchProjects(searchKeyword.value)
  }

  return filtered
})

// 计算统计信息
const projectStats = computed(() => {
  const total = filteredProjects.value.length
  const totalAmount = filteredProjects.value.reduce((sum, p) => sum + p.serviceAmount, 0)

  return {
    total,
    totalAmount,
    byStatus: {
      draft: filteredProjects.value.filter(p => p.status === 'draft').length,
      submitted: filteredProjects.value.filter(p => p.status === 'submitted').length,
      completed: filteredProjects.value.filter(p => p.status === 'completed').length,
      closed: filteredProjects.value.filter(p => p.status === 'closed').length
    }
  }
})

// 事件处理函数
const handleAddProject = () => {
  router.push('/project/create')
}

const handleEditProject = (projectId: string) => {
  router.push(`/project/edit/${projectId}`)
}

const handleViewProject = (projectId: string) => {
  router.push(`/project/${projectId}`)
}

const handleDeleteProject = async (projectId: string) => {
  if (confirm('确定要删除该项目吗？')) {
    try {
      await deleteProject(projectId)
    } catch (error) {
      console.error('删除项目失败:', error)
    }
  }
}

const handleCopyProject = async (projectId: string) => {
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

const handleCloseProject = async (projectId: string) => {
  if (confirm('确定要结项该项目吗？')) {
    try {
      await changeProjectStatus(projectId, { status: 'closed' })
      alert('项目结项成功')
    } catch (error) {
      console.error('结项项目失败:', error)
    }
  }
}

const handleSubmitProject = async (projectId: string) => {
  if (confirm('确定要提交该项目吗？')) {
    try {
      await changeProjectStatus(projectId, { status: 'submitted' })
      alert('项目提交成功')
    } catch (error) {
      console.error('提交项目失败:', error)
    }
  }
}

const handleCompleteProject = async (projectId: string) => {
  if (confirm('确定要标记该项目为已完成吗？')) {
    try {
      await changeProjectStatus(projectId, { status: 'completed' })
      alert('项目标记为已完成')
    } catch (error) {
      console.error('标记项目完成失败:', error)
    }
  }
}

// 导航到记账页面
const navigateToBookkeeping = () => {
  router.push('/accounting')
}
</script>

<template>
  <div class="min-h-screen bg-[#F5F5F7] text-[#1D1D1F] font-sans pb-12 flex flex-col">
    <!-- 模拟登录状态和角色切换 -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <User class="w-4 h-4 text-white" />
              </div>
              <div>
                <p class="text-sm font-medium text-gray-900">{{ currentUser.name }}</p>
                <p class="text-xs text-gray-500">{{ currentUser.email }}</p>
              </div>
            </div>
            <div class="h-6 w-px bg-gray-300"></div>
            <div class="flex items-center gap-2">
              <span class="text-sm text-gray-600">角色:</span>
              <div class="flex bg-gray-100 rounded-lg p-1">
                <button
                  v-for="(config, role) in { admin: '管理员', project_manager: '项目经理', project_member: '项目成员' }"
                  :key="role"
                  @click="switchRole(role as any)"
                  class="px-3 py-1 text-sm rounded-md transition-colors flex items-center gap-1"
                  :class="currentUser.role === role
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-200'"
                >
                  {{ config }}
                </button>
              </div>
            </div>
          </div>
          <div class="text-xs text-gray-500">{{ currentRoleConfig.description }}</div>
        </div>
      </div>
    </div>

    <div class="flex-1 flex flex-col">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex-1 flex flex-col">
        <!-- 页面标题和操作按钮 -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 tracking-tight">项目列表</h1>
            <p class="mt-2 text-sm text-gray-600">
              {{ currentRoleConfig.description }}
            </p>
          </div>
          <div class="flex gap-3">
            <button
              v-if="canCreateProjects"
              @click="handleAddProject"
              class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm"
            >
              <Plus :size="18" />
              新增项目
            </button>
          </div>
        </div>

        <!-- 搜索和筛选区域 -->
        <div class="bg-white rounded-lg border border-gray-200 shadow-sm p-4 mb-6">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <!-- 搜索框 -->
            <div class="relative flex-1 max-w-md">
              <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                v-model="searchKeyword"
                type="text"
                placeholder="搜索项目名称、客户或负责人..."
                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              />
            </div>

            <!-- 状态筛选 -->
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
                @click="statusFilter = 'completed'"
                class="px-3 py-1.5 text-sm rounded-full transition-colors flex items-center gap-1"
                :class="statusFilter === 'completed'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
              >
                <CheckCircle :size="14" />
                已完成
              </button>
              <button
                @click="statusFilter = 'submitted'"
                class="px-3 py-1.5 text-sm rounded-full transition-colors flex items-center gap-1"
                :class="statusFilter === 'submitted'
                  ? 'bg-orange-100 text-orange-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
              >
                <Clock :size="14" />
                立项中(已提交)
              </button>
              <button
                @click="statusFilter = 'draft'"
                class="px-3 py-1.5 text-sm rounded-full transition-colors flex items-center gap-1"
                :class="statusFilter === 'draft'
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
              >
                <Clock :size="14" />
                立项中(草稿箱)
              </button>
              <button
                @click="statusFilter = 'closed'"
                class="px-3 py-1.5 text-sm rounded-full transition-colors flex items-center gap-1"
                :class="statusFilter === 'closed'
                  ? 'bg-gray-100 text-gray-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
              >
                <Shield :size="14" />
                已结项
              </button>
            </div>
          </div>
        </div>

        <!-- 统计信息 -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div class="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
            <div class="text-gray-500 text-sm">总项目数</div>
            <div class="text-2xl font-bold text-gray-900">{{ projectStats.total }}</div>
          </div>
          <div class="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
            <div class="text-gray-500 text-sm">总金额</div>
            <div class="text-2xl font-bold text-blue-600">{{ formatCurrency(projectStats.totalAmount) }}</div>
          </div>
          <div class="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
            <div class="text-gray-500 text-sm">已完成</div>
            <div class="text-2xl font-bold text-green-600">{{ projectStats.byStatus.completed }}</div>
          </div>
          <div class="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
            <div class="text-gray-500 text-sm">已结项</div>
            <div class="text-2xl font-bold text-gray-600">{{ projectStats.byStatus.closed }}</div>
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
                    <td class="px-3 py-2 text-gray-700">{{ formatDate(project.serviceStartDate) }}</td>
                    <td class="px-3 py-2 text-gray-700">{{ formatDate(project.serviceEndDate) }}</td>
                    <td class="px-3 py-2 font-semibold text-green-600">{{ formatCurrency(project.serviceAmount) }}</td>
                    <td class="px-3 py-2">
                      <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                        :class="new Date(project.serviceStartDate).getFullYear() !== new Date(project.serviceEndDate).getFullYear()
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'"
                      >
                        {{ new Date(project.serviceStartDate).getFullYear() !== new Date(project.serviceEndDate).getFullYear() ? '是' : '否' }}
                      </span>
                    </td>
                    <td class="px-3 py-2">
                      <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                        :class="project.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : project.status === 'submitted'
                          ? 'bg-orange-100 text-orange-800'
                          : project.status === 'closed'
                          ? 'bg-gray-100 text-gray-800'
                          : 'bg-yellow-100 text-yellow-800'"
                      >
                        {{ statusConfig[project.status].label }}
                      </span>
                    </td>
                    <td class="px-3 py-2 text-gray-700">{{ project.projectType }}</td>
                    <!-- 右侧固定列 -->
                    <td class="px-3 py-2 bg-white sticky right-0 z-20">
                      <div class="flex items-center gap-2">
                        <!-- 记账按钮 -->
                        <button
                          @click="navigateToBookkeeping"
                          class="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
                        >
                          <span class="text-base">￥</span>
                          {{ canBookkeepingIncome && canBookkeepingExpense ? '记账' : '支出记账' }}
                        </button>

                        <!-- 编辑按钮 -->
                        <button
                          v-if="canEditProject(project.status, project.projectLeader)"
                          @click="handleEditProject(project.id)"
                          class="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-orange-600 bg-orange-50 rounded-md hover:bg-orange-100 transition-colors"
                        >
                          <Edit3 :size="14" />
                          修改
                        </button>

                        <!-- 项目看板按钮 -->
                        <button
                          @click="handleViewProject(project.id)"
                          class="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
                        >
                          <LayoutGrid :size="14" />
                          项目看板
                        </button>

                        <!-- 复制项目按钮 -->
                        <button
                          v-if="canCopyProject(project.status)"
                          @click="handleCopyProject(project.id)"
                          class="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-green-600 bg-green-50 rounded-md hover:bg-green-100 transition-colors"
                        >
                          <Copy :size="14" />
                          复制
                        </button>

                        <!-- 删除按钮 -->
                        <button
                          v-if="canDeleteProject(project.projectLeader)"
                          @click="handleDeleteProject(project.id)"
                          class="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors"
                        >
                          <Trash2 :size="14" />
                          删除
                        </button>

                        <!-- 状态操作按钮 -->
                        <template v-if="project.status === 'draft'">
                          <button
                            @click="handleSubmitProject(project.id)"
                            class="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-purple-600 bg-purple-50 rounded-md hover:bg-purple-100 transition-colors"
                          >
                            提交
                          </button>
                        </template>
                        <template v-else-if="project.status === 'submitted'">
                          <button
                            @click="handleCompleteProject(project.id)"
                            class="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-green-600 bg-green-50 rounded-md hover:bg-green-100 transition-colors"
                          >
                            完成
                          </button>
                        </template>
                        <template v-else-if="project.status === 'completed'">
                          <button
                            @click="handleCloseProject(project.id)"
                            class="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
                          >
                            结项
                          </button>
                        </template>
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