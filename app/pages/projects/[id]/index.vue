<template>
  <div class="space-y-6">
    <div class="bg-white rounded-lg shadow-sm p-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-900">{{ project?.project_name }}</h1>
        <div class="flex space-x-2">
          <NButton type="primary" @click="navigateTo(`/projects/${route.params.id}/edit`)" v-if="project?.status !== 'CLOSED'">
            编辑
          </NButton>
          <NButton type="primary" @click="navigateTo(`/projects/${route.params.id}/accounting`)" v-if="project?.status === 'COMPLETED'">
            记账
          </NButton>
        </div>
      </div>

      <!-- 项目基本信息 -->
      <div class="mb-8">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">项目基本信息</h2>
        <NDataTable
          :columns="infoColumns"
          :data="projectInfo"
          :pagination="false"
          bordered
        />
      </div>

      <!-- 财务概览 -->
      <div class="mb-8">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">财务概览</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="bg-blue-50 rounded-lg p-4">
            <p class="text-sm text-blue-600 mb-1">预计净收入</p>
            <p class="text-2xl font-bold text-blue-900">{{ formatCurrency(expectedNetIncome) }}</p>
          </div>
          <div class="bg-green-50 rounded-lg p-4">
            <p class="text-sm text-green-600 mb-1">入账收入</p>
            <p class="text-2xl font-bold text-green-900">{{ formatCurrency(actualIncome) }}</p>
          </div>
          <div class="bg-yellow-50 rounded-lg p-4">
            <p class="text-sm text-yellow-600 mb-1">预计毛利率</p>
            <p class="text-2xl font-bold text-yellow-900">{{ formatPercentage(expectedGrossMargin) }}</p>
          </div>
          <div class="bg-purple-50 rounded-lg p-4">
            <p class="text-sm text-purple-600 mb-1">实际毛利率</p>
            <p class="text-2xl font-bold text-purple-900">{{ formatPercentage(actualGrossMargin) }}</p>
          </div>
        </div>
      </div>

      <!-- 项目成员 -->
      <div class="mb-8">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">项目成员</h2>
        <div class="flex flex-wrap gap-2">
          <NTag
            v-for="member in project?.project_members || []"
            :key="member.id"
            :type="member.role === 'MANAGER' ? 'warning' : 'primary'"
            size="large"
            style="margin-bottom: 4px"
          >
            {{ member.user_name }} ({{ member.role === 'MANAGER' ? '项目经理' : '成员' }})
          </NTag>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="flex justify-end space-x-4">
        <NButton
          @click="handleCopy"
          v-if="['COMPLETED', 'CLOSED'].includes(project?.status || '')"
        >
          复制项目
        </NButton>
        <NButton
          type="warning"
          @click="handleClose"
          v-if="project?.status !== 'CLOSED'"
        >
          关闭项目
        </NButton>
        <NButton
          type="error"
          @click="handleDelete"
        >
          删除项目
        </NButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Projects } from '@prisma/client'

const route = useRoute()
const project = ref<Projects | null>(null)

const { apiFetch } = useApi()

// 获取项目详情
const fetchProject = async () => {
  try {
    const response = await apiFetch(`/api/projects/${route.params.id}`)
    if (response.code === 0) {
      project.value = response.data
    }
  } catch (error) {
    console.error('获取项目详情失败:', error)
  }
}

// 复制项目
const handleCopy = async () => {
  try {
    await apiFetch(`/api/projects/${route.params.id}/copy`, {
      method: 'POST'
    })
    useMessage().success('项目复制成功')
  } catch (error) {
    console.error('复制项目失败:', error)
  }
}

// 关闭项目
const handleClose = async () => {
  try {
    await apiFetch(`/api/projects/${route.params.id}/status`, {
      method: 'PUT',
      body: { status: 'CLOSED' }
    })
    useMessage().success('项目已关闭')
    await fetchProject()
  } catch (error) {
    console.error('关闭项目失败:', error)
  }
}

// 删除项目
const handleDelete = async () => {
  try {
    await apiFetch(`/api/projects/${route.params.id}`, {
      method: 'DELETE'
    })
    useMessage().success('项目删除成功')
    navigateTo('/')
  } catch (error) {
    console.error('删除项目失败:', error)
  }
}

// 项目信息表格列
const infoColumns = [
  { title: '项目编号', key: 'id' },
  { title: '项目名称', key: 'project_name' },
  { title: '负责人', key: 'project_leader' },
  { title: '客户', key: 'client_name' },
  { title: '项目类型', key: 'project_type', render: ({ row }) => getProjectTypeText(row.project_type) },
  { title: '服务周期', key: 'service_period', render: ({ row }) => formatServicePeriod(row) },
  { title: '状态', key: 'status', render: ({ row }) => getStatusText(row.status) },
  { title: '服务金额', key: 'service_amount', render: ({ row }) => formatCurrency(row.service_amount) },
  { title: '创建时间', key: 'created_at', render: ({ row }) => formatDate(row.created_at) }
]

// 项目信息数据
const projectInfo = computed(() => {
  return project.value ? [
    {
      id: project.value.id,
      project_name: project.value.project_name,
      project_leader: project.value.project_leader,
      client_name: project.value.client_name,
      project_type: project.value.project_type,
      service_start_date: project.value.service_start_date,
      service_end_date: project.value.service_end_date,
      status: project.value.status,
      service_amount: project.value.service_amount,
      created_at: project.value.created_at
    }
  ] : []
})

// 计算财务数据
const expectedNetIncome = computed(() => {
  return project.value ? (Number(project.value.service_amount || 0) * 0.94) : 0
})

const actualIncome = computed(() => {
  return project.value?.incomeAmount || 0
})

const expectedGrossMargin = computed(() => {
  return expectedNetIncome.value > 0 ? 0.25 * 100 : 0
})

const actualGrossMargin = computed(() => {
  return actualIncome.value > 0 ? ((actualIncome.value - Number(project.value?.expenseAmount || 0)) / actualIncome.value) * 100 : 0
})

onMounted(async () => {
  await fetchProject()
})
</script>
