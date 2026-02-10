<template>
  <div class="space-y-6">
    <!-- 页面标题 -->
    <div class="bg-white rounded-lg shadow-sm p-6">
      <h1 class="text-2xl font-bold text-gray-900">项目管理</h1>
    </div>

    <!-- 搜索和筛选区域 -->
    <div class="bg-white rounded-lg shadow-sm p-6">
      <div class="flex flex-wrap gap-4">
        <div class="flex-1 min-w-[200px]">
          <NInput v-model:value="searchKeyword" placeholder="搜索项目名称、客户名称或负责人" @keyup.enter="fetchProjects">
            <template #prefix>
              <span class="text-gray-400">🔍</span>
            </template>
          </NInput>
        </div>
        <NSelect
          v-model:value="statusFilter"
          placeholder="筛选项目状态"
          style="width: 200px"
          :options="statusOptions"
          clearable
        />
        <NButton type="primary" @click="fetchProjects">
          <template #icon>
            <span class="text-lg">🔍</span>
          </template>
          搜索
        </NButton>
        <NButton type="primary" @click="navigateTo('/projects/create')">
          <template #icon>
            <span class="text-lg">+</span>
          </template>
          新增项目
        </NButton>
      </div>
    </div>

    <!-- 统计信息 -->
    <div class="bg-white rounded-lg shadow-sm p-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
          <div class="text-3xl text-blue-600">📊</div>
          <div>
            <p class="text-sm text-gray-600">项目总数</p>
            <p class="text-xl font-bold text-gray-900">{{ stats.total }}</p>
          </div>
        </div>
        <div class="flex items-center space-x-4 p-4 bg-green-50 rounded-lg">
          <div class="text-3xl text-green-600">✅</div>
          <div>
            <p class="text-sm text-gray-600">已完成项目</p>
            <p class="text-xl font-bold text-gray-900">{{ stats.completed }}</p>
          </div>
        </div>
        <div class="flex items-center space-x-4 p-4 bg-orange-50 rounded-lg">
          <div class="text-3xl text-orange-600">💰</div>
          <div>
            <p class="text-sm text-gray-600">项目总金额</p>
            <p class="text-xl font-bold text-gray-900">{{ formatCurrency(stats.totalAmount) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 项目列表 -->
    <div class="bg-white rounded-lg shadow-sm p-6">
      <NDataTable
        :columns="columns"
        :data="projects"
        :pagination="{
          page: currentPage,
          pageSize: pageSize,
          total: total,
          showSizeChanger: true,
          pageSizes: [10, 20, 50]
        }"
        @update:page="handlePageChange"
        @update:page-size="handlePageSizeChange"
        :scroll-x="1000"
      >
        <template #body-cell-status="{ row }">
          <NTag :type="getStatusType(row.status)" size="small">
            {{ getStatusText(row.status) }}
          </NTag>
        </template>
        <template #body-cell-actions="{ row }">
          <div class="flex space-x-2">
            <NButton type="primary" size="small" @click="navigateTo(`/projects/${row.id}`)">
              看板
            </NButton>
            <NButton type="primary" size="small" @click="navigateTo(`/projects/${row.id}/accounting`)">
              记账
            </NButton>
            <NButton type="primary" size="small" @click="navigateTo(`/projects/${row.id}/edit`)">
              编辑
            </NButton>
            <NButton size="small" @click="handleCopy(row.id)" v-if="['COMPLETED', 'CLOSED'].includes(row.status)">
              复制
            </NButton>
            <NButton type="warning" size="small" @click="handleClose(row.id)" v-if="row.status !== 'CLOSED'">
              关闭
            </NButton>
            <NButton type="error" size="small" @click="handleDelete(row.id)">
              删除
            </NButton>
          </div>
        </template>
      </NDataTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Projects } from '@prisma/client'

const currentPage = ref(1)
const pageSize = ref(20)
const searchKeyword = ref('')
const statusFilter = ref('')
const projects = ref<Projects[]>([])
const total = ref(0)

const stats = reactive({
  total: 0,
  completed: 0,
  totalAmount: 0
})

const { apiFetch } = useApi()

const statusOptions = [
  { label: '草稿', value: 'DRAFT' },
  { label: '已提交', value: 'SUBMITTED' },
  { label: '已完成', value: 'COMPLETED' },
  { label: '已关闭', value: 'CLOSED' }
]

// 获取项目列表
const fetchProjects = async () => {
  try {
    const params = new URLSearchParams({
      page: currentPage.value.toString(),
      size: pageSize.value.toString()
    })

    if (searchKeyword.value) {
      params.set('keyword', searchKeyword.value)
    }

    if (statusFilter.value) {
      params.set('status', statusFilter.value)
    }

    const response = await apiFetch(`/api/projects?${params.toString()}`)
    if (response.code === 0) {
      projects.value = response.data.list
      total.value = response.data.total
      // 计算统计信息
      stats.total = response.data.total
      stats.completed = response.data.list.filter((p: any) => p.status === 'COMPLETED').length
      stats.totalAmount = response.data.list.reduce((sum: number, p: any) => sum + Number(p.service_amount || 0), 0)
    }
  } catch (error) {
    console.error('获取项目列表失败:', error)
  }
}

// 复制项目
const handleCopy = async (id: string) => {
  try {
    await apiFetch(`/api/projects/${id}/copy`, {
      method: 'POST'
    })
    useMessage().success('项目复制成功')
    await fetchProjects()
  } catch (error) {
    console.error('复制项目失败:', error)
  }
}

// 关闭项目
const handleClose = async (id: string) => {
  try {
    await apiFetch(`/api/projects/${id}/status`, {
      method: 'PUT',
      body: { status: 'CLOSED' }
    })
    useMessage().success('项目已关闭')
    await fetchProjects()
  } catch (error) {
    console.error('关闭项目失败:', error)
  }
}

// 删除项目
const handleDelete = async (id: string) => {
  try {
    await apiFetch(`/api/projects/${id}`, {
      method: 'DELETE'
    })
    useMessage().success('项目删除成功')
    await fetchProjects()
  } catch (error) {
    console.error('删除项目失败:', error)
  }
}

// 分页变化
const handlePageChange = (page: number) => {
  currentPage.value = page
  fetchProjects()
}

const handlePageSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
  fetchProjects()
}

// 列配置
const columns = [
  { title: '项目编号', key: 'id', width: 100 },
  { title: '项目名称', key: 'project_name', width: 200 },
  { title: '负责人', key: 'project_leader', width: 100 },
  { title: '客户', key: 'client_name', width: 150 },
  { title: '服务周期', key: 'service_period', width: 150, render: ({ row }) => formatServicePeriod(row) },
  { title: '金额', key: 'service_amount', width: 120, render: ({ row }) => formatCurrency(row.service_amount) },
  { title: '状态', key: 'status', width: 100 },
  { title: '操作', key: 'actions', width: 250 }
]

// 获取状态类型
const getStatusType = (status: string) => {
  const typeMap: Record<string, any> = {
    'DRAFT': 'warning',
    'SUBMITTED': 'info',
    'COMPLETED': 'success',
    'CLOSED': 'error'
  }
  return typeMap[status] || 'default'
}

// 获取状态文本
const getStatusText = (status: string) => {
  const textMap: Record<string, string> = {
    'DRAFT': '草稿',
    'SUBMITTED': '已提交',
    'COMPLETED': '已完成',
    'CLOSED': '已关闭'
  }
  return textMap[status] || status
}

// 格式化服务周期
const formatServicePeriod = (row: any) => {
  if (!row.service_start_date) return '-'
  const start = formatDate(row.service_start_date)
  const end = row.service_end_date ? formatDate(row.service_end_date) : '至今'
  return `${start} - ${end}`
}

onMounted(async () => {
  await fetchProjects()
})
</script>
