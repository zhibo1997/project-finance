<template>
  <div class="space-y-6">
    <!-- 页面标题和操作栏 -->
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold text-gray-800">项目列表</h1>
      <NuxtLink
        to="/projects/create"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
      >
        新建项目
      </NuxtLink>
    </div>

    <!-- 搜索和筛选 -->
    <div class="bg-white p-6 rounded-lg shadow-sm">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">搜索</label>
          <input
            v-model="searchKeyword"
            type="text"
            placeholder="搜索项目名称、客户、负责人..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">状态筛选</label>
          <select
            v-model="statusFilter"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">全部状态</option>
            <option value="draft">立项中(草稿)</option>
            <option value="submitted">立项中(已提交)</option>
            <option value="completed">已完成</option>
            <option value="closed">已结项</option>
          </select>
        </div>
        <div class="flex items-end">
          <button
            @click="searchProjects"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            搜索
          </button>
        </div>
      </div>
    </div>

    <!-- 项目列表 -->
    <div class="bg-white rounded-lg shadow-sm overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              项目名称
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              项目负责人
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              客户名称
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              服务金额
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              状态
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              创建时间
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              操作
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="project in projects" :key="project.id">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900">{{ project.project_name }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-500">{{ project.project_leader }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-500">{{ project.client_name }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">¥{{ formatAmount(project.service_amount) }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                :class="[
                  'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                  project.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                  project.status === 'submitted' ? 'bg-blue-100 text-blue-800' :
                  project.status === 'completed' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                ]"
              >
                {{ getStatusText(project.status) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatDate(project.created_at) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
              <NuxtLink
                :to="`/projects/${project.id}`"
                class="text-blue-600 hover:text-blue-900"
              >
                查看
              </NuxtLink>
              <NuxtLink
                :to="`/projects/${project.id}/edit`"
                class="text-green-600 hover:text-green-900"
              >
                编辑
              </NuxtLink>
              <button
                @click="deleteProject(project.id)"
                class="text-red-600 hover:text-red-900"
              >
                删除
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 分页 -->
    <div class="flex justify-between items-center">
      <div class="text-sm text-gray-700">
        显示 {{ (currentPage - 1) * pageSize + 1 }} - {{ Math.min(currentPage * pageSize, total) }} 条，共 {{ total }} 条
      </div>
      <div class="flex space-x-2">
        <button
          @click="currentPage = Math.max(1, currentPage - 1)"
          :disabled="currentPage <= 1"
          class="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          上一页
        </button>
        <button
          @click="currentPage = Math.min(totalPages, currentPage + 1)"
          :disabled="currentPage >= totalPages"
          class="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          下一页
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const searchKeyword = ref('')
const statusFilter = ref('')
const currentPage = ref(1)
const pageSize = ref(20)
const projects = ref<any[]>([])
const total = ref(0)

const totalPages = computed(() => Math.ceil(total.value / pageSize.value))

const formatAmount = (amount: number | null | undefined) => {
  if (amount == null) return '0.00'
  return amount.toFixed(2)
}

const formatDate = (date: string | Date) => {
  const d = new Date(date)
  return d.toLocaleDateString('zh-CN')
}

const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    draft: '草稿',
    submitted: '已提交',
    completed: '已完成',
    closed: '已结项'
  }
  return statusMap[status] || status
}

const searchProjects = async () => {
  currentPage.value = 1
  await fetchProjects()
}

const fetchProjects = async () => {
  try {
    const queryParams = new URLSearchParams({
      page: currentPage.value.toString(),
      size: pageSize.value.toString(),
      ...(searchKeyword.value && { keyword: searchKeyword.value }),
      ...(statusFilter.value && { status: statusFilter.value })
    })

    const response = await $fetch(`/api/projects?${queryParams.toString()}`)
    if (response.code === 0) {
      projects.value = response.data?.list || []
      total.value = response.data?.total || 0
    }
  } catch (error) {
    console.error('获取项目列表失败:', error)
  }
}

const deleteProject = async (id: string) => {
  if (!confirm('确定要删除此项目吗？')) return

  try {
    const response = await $fetch(`/api/projects/${id}`, {
      method: 'DELETE'
    })
    if (response.code === 0) {
      await fetchProjects()
    }
  } catch (error) {
    console.error('删除项目失败:', error)
  }
}

onMounted(() => {
  fetchProjects()
})
</script>
