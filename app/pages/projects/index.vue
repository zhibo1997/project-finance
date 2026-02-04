<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <h1 class="text-3xl font-bold text-gray-900 mb-6">项目管理</h1>

        <!-- 项目列表 -->
        <div class="bg-white overflow-hidden shadow-sm rounded-lg">
          <div class="p-6">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-xl font-semibold text-gray-800">项目列表</h2>
              <NuxtLink
                to="/projects/create"
                class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                新建项目
              </NuxtLink>
            </div>

            <!-- 项目搜索和筛选 -->
            <div class="mb-6">
              <div class="flex flex-col md:flex-row gap-4">
                <div class="flex-1">
                  <input
                    v-model="searchTerm"
                    type="text"
                    placeholder="搜索项目名称、负责人或客户..."
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <select
                  v-model="statusFilter"
                  class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">全部状态</option>
                  <option value="draft">草稿</option>
                  <option value="submitted">已提交</option>
                  <option value="completed">已完成</option>
                  <option value="closed">已结项</option>
                </select>
                <button
                  @click="fetchProjects"
                  class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  搜索
                </button>
              </div>
            </div>

            <!-- 项目列表 -->
            <div class="space-y-4">
              <div
                v-for="project in projects"
                :key="project.id"
                class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div class="flex justify-between items-start">
                  <div class="flex-1">
                    <h3 class="text-lg font-semibold text-gray-900">{{ project.project_name }}</h3>
                    <div class="mt-2 text-sm text-gray-600">
                      <p>负责人: {{ project.project_leader }}</p>
                      <p>客户: {{ project.client_name }}</p>
                      <p>服务金额: ¥{{ project.service_amount }}</p>
                      <p>状态:
                        <span
                          :class="getStatusBadgeClass(project.status)"
                          class="px-2 py-1 rounded-full text-xs font-medium"
                        >
                          {{ getStatusText(project.status) }}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div class="ml-4 flex space-x-2">
                    <NuxtLink
                      :to="`/projects/${project.id}`"
                      class="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded-md text-sm transition-colors"
                    >
                      查看
                    </NuxtLink>
                    <NuxtLink
                      :to="`/projects/${project.id}/edit`"
                      class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm transition-colors"
                    >
                      编辑
                    </NuxtLink>
                    <NuxtLink
                      :to="`/projects/${project.id}/copy`"
                      class="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm transition-colors"
                    >
                      复制
                    </NuxtLink>
                    <button
                      @click="deleteProject(project.id)"
                      class="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm transition-colors"
                    >
                      删除
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- 分页 -->
            <div v-if="total > 0" class="mt-6 flex justify-between items-center">
              <div class="text-sm text-gray-700">
                显示 {{ (currentPage - 1) * pageSize + 1 }} 到 {{ Math.min(currentPage * pageSize, total) }} 条，共 {{ total }} 条
              </div>
              <div class="flex space-x-2">
                <button
                  @click="currentPage--"
                  :disabled="currentPage === 1"
                  class="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  上一页
                </button>
                <button
                  @click="currentPage++"
                  :disabled="currentPage * pageSize >= total"
                  class="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  下一页
                </button>
              </div>
            </div>

            <!-- 空状态 -->
            <div v-if="total === 0" class="text-center py-12">
              <p class="text-gray-500">暂无项目数据</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const searchTerm = ref('')
const statusFilter = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const projects = ref<any[]>([])
const total = ref(0)

const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    draft: '草稿',
    submitted: '已提交',
    completed: '已完成',
    closed: '已结项'
  }
  return statusMap[status] || status
}

const getStatusBadgeClass = (status: string) => {
  const classMap: Record<string, string> = {
    draft: 'bg-yellow-100 text-yellow-800',
    submitted: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    closed: 'bg-gray-100 text-gray-800'
  }
  return classMap[status] || 'bg-gray-100 text-gray-800'
}

const fetchProjects = async () => {
  try {
    const queryParams = new URLSearchParams({
      page: currentPage.value.toString(),
      size: pageSize.value.toString(),
      keyword: searchTerm.value,
      status: statusFilter.value
    })

    const response = await $fetch(`/api/projects?${queryParams.toString()}`)
    if (response.code === 0 && response.data) {
      projects.value = response.data.list || []
      total.value = response.data.total || 0
    }
  } catch (error) {
    console.error('获取项目列表失败:', error)
  }
}

const deleteProject = async (id: string) => {
  if (!confirm('确定要删除该项目吗？')) return

  try {
    const response = await $fetch(`/api/projects/${id}`, {
      method: 'DELETE'
    })
    if (response.code === 0) {
      fetchProjects()
    }
  } catch (error) {
    console.error('删除项目失败:', error)
  }
}

onMounted(() => {
  fetchProjects()
})
</script>

<style scoped>
/* 项目页面样式 */
</style>
