<template>
  <div class="max-w-6xl mx-auto space-y-8">
    <!-- 页面标题 -->
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold text-gray-800">记账管理</h1>
      <button
        @click="showAddRecordModal = true"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
      >
        新增记账
      </button>
    </div>

    <!-- 搜索和筛选 -->
    <div class="bg-white rounded-lg shadow-sm p-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">项目</label>
          <select
            v-model="filters.projectId"
            @change="fetchRecords"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">全部项目</option>
            <option v-for="project in projects" :key="project.id" :value="project.id">
              {{ project.name }}
            </option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">类型</label>
          <select
            v-model="filters.type"
            @change="fetchRecords"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">全部类型</option>
            <option value="income">收入</option>
            <option value="expense">支出</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">日期范围</label>
          <div class="flex space-x-2">
            <input
              type="date"
              v-model="filters.startDate"
              @change="fetchRecords"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="date"
              v-model="filters.endDate"
              @change="fetchRecords"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">搜索</label>
          <input
            type="text"
            v-model="filters.keyword"
            @input="fetchRecords"
            placeholder="搜索备注..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>

    <!-- 记账记录列表 -->
    <div class="bg-white rounded-lg shadow-sm overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              项目名称
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              类型
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              金额 (元)
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              日期
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              类别
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              备注
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              附件
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              操作
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="record in records" :key="record.id">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900">{{ getProjectName(record.project_id) }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                :class="[
                  'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                  record.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                ]"
              >
                {{ record.type === 'income' ? '收入' : '支出' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900">
                {{ record.type === 'income' ? '+' : '-' }}¥{{ formatAmount(record.amount) }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatDate(record.record_date) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ getCategoryName(record.category_id, record.type) }}
            </td>
            <td class="px-6 py-4 text-sm text-gray-500">
              {{ record.description }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <div v-if="record.attachments && record.attachments.length > 0" class="flex space-x-2">
                <a
                  v-for="attachment in record.attachments"
                  :key="attachment.id"
                  :href="attachment.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-blue-600 hover:text-blue-900"
                >
                  {{ attachment.file_name }}
                </a>
              </div>
              <span v-else class="text-gray-400">无</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
              <button
                @click="editRecord(record)"
                class="text-green-600 hover:text-green-900"
              >
                编辑
              </button>
              <button
                @click="deleteRecord(record.id)"
                class="text-red-600 hover:text-red-900"
              >
                删除
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 新增/编辑记账模态框 -->
    <div v-if="showAddRecordModal || showEditRecordModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        <div class="flex justify-between items-center p-6 border-b">
          <h2 class="text-xl font-semibold text-gray-800">
            {{ showEditRecordModal ? '编辑记账' : '新增记账' }}
          </h2>
          <button
            @click="closeModal"
            class="text-gray-400 hover:text-gray-600"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="p-6">
          <form @submit.prevent="saveRecord">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">项目 *</label>
                <select
                  v-model="formData.project_id"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">请选择项目</option>
                  <option v-for="project in projects" :key="project.id" :value="project.id">
                    {{ project.name }}
                  </option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">类型 *</label>
                <select
                  v-model="formData.type"
                  required
                  @change="onTypeChange"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">请选择类型</option>
                  <option value="income">收入</option>
                  <option value="expense">支出</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">金额 (元) *</label>
                <input
                  type="number"
                  v-model="formData.amount"
                  required
                  step="0.01"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">日期 *</label>
                <input
                  type="date"
                  v-model="formData.record_date"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">类别 *</label>
                <select
                  v-model="formData.category_id"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">请选择类别</option>
                  <option v-for="category in availableCategories" :key="category.id" :value="category.id">
                    {{ category.name }}
                  </option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">采购内容</label>
                <select
                  v-model="formData.purchase_content_id"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">请选择采购内容</option>
                  <option v-for="content in purchaseContents" :key="content.id" :value="content.id">
                    {{ content.name }}
                  </option>
                </select>
              </div>
            </div>
            <div class="mt-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">备注</label>
              <textarea
                v-model="formData.description"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>
            <div class="mt-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">附件</label>
              <input
                type="file"
                @change="handleFileUpload"
                accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div v-if="selectedFiles.length > 0" class="mt-2 space-y-1">
                <div v-for="(file, index) in selectedFiles" :key="index" class="text-sm text-gray-600">
                  {{ file.name }} ({{ formatFileSize(file.size) }})
                </div>
              </div>
            </div>
            <div class="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                @click="closeModal"
                class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                type="submit"
                class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                {{ showEditRecordModal ? '保存修改' : '新增记账' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

const records = ref<any[]>([])
const projects = ref<any[]>([])
const expenseCategories = ref<any[]>([])
const purchaseContents = ref<any[]>([])
const selectedFiles = ref<File[]>([])

// 筛选条件
const filters = ref({
  projectId: '',
  type: '',
  startDate: '',
  endDate: '',
  keyword: ''
})

// 表单数据
const formData = ref({
  project_id: '',
  type: '',
  amount: 0,
  record_date: new Date().toISOString().split('T')[0],
  category_id: '',
  purchase_content_id: '',
  description: ''
})

// 模态框状态
const showAddRecordModal = ref(false)
const showEditRecordModal = ref(false)

// 计算可用类别（根据类型筛选）
const availableCategories = computed(() => {
  if (!formData.value.type) return []
  return expenseCategories.value.filter(category => {
    return formData.value.type === 'income' ? category.is_income : !category.is_income
  })
})

const formatDate = (date: string | Date) => {
  const d = new Date(date)
  return d.toLocaleDateString('zh-CN')
}

const formatAmount = (amount: number) => {
  return Number(amount).toFixed(2)
}

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

const getProjectName = (projectId: string) => {
  const project = projects.value.find(p => p.id === projectId)
  return project ? project.name : '未知项目'
}

const getCategoryName = (categoryId: string, type: string) => {
  const category = expenseCategories.value.find(c => c.id === categoryId)
  return category ? category.name : '未知类别'
}

// 获取项目列表
const fetchProjects = async () => {
  try {
    const response = await $fetch('/api/projects') as any
    if (response.code === 0) {
      projects.value = Array.isArray(response.data?.list) ? response.data.list : []
    }
  } catch (error) {
    console.error('获取项目列表失败:', error)
  }
}

// 获取费用类别
const fetchExpenseCategories = async () => {
  try {
    const response = await $fetch('/api/dict/expense-categories')
    if (response.code === 0) {
      expenseCategories.value = response.data || []
    }
  } catch (error) {
    console.error('获取费用类别失败:', error)
  }
}

// 获取采购内容
const fetchPurchaseContents = async () => {
  try {
    const response = await $fetch('/api/dict/purchase-contents')
    if (response.code === 0) {
      purchaseContents.value = response.data || []
    }
  } catch (error) {
    console.error('获取采购内容失败:', error)
  }
}

// 获取记账记录
const fetchRecords = async () => {
  try {
    const params = new URLSearchParams()
    if (filters.value.projectId) params.append('project_id', filters.value.projectId)
    if (filters.value.type) params.append('type', filters.value.type)
    if (filters.value.startDate) params.append('start_date', filters.value.startDate)
    if (filters.value.endDate) params.append('end_date', filters.value.endDate)
    if (filters.value.keyword) params.append('keyword', filters.value.keyword)

    const response = await $fetch(`/api/records?${params.toString()}`) as any
    if (response.code === 0) {
      records.value = response.data || []
    }
  } catch (error) {
    console.error('获取记账记录失败:', error)
  }
}

// 删除记账记录
const deleteRecord = async (id: string) => {
  if (!confirm('确定要删除此记账记录吗？')) return

  try {
    const response = await $fetch(`/api/records/${id}`, {
      method: 'DELETE'
    })
    if (response.code === 0) {
      await fetchRecords()
    }
  } catch (error) {
    console.error('删除记账记录失败:', error)
  }
}

// 编辑记账记录
const editRecord = (record: any) => {
  formData.value = {
    project_id: record.project_id,
    type: record.type,
    amount: record.amount,
    record_date: new Date(record.record_date).toISOString().split('T')[0],
    category_id: record.category_id,
    purchase_content_id: record.purchase_content_id,
    description: record.description
  }
  showEditRecordModal.value = true
}

// 处理类型变更
const onTypeChange = () => {
  formData.value.category_id = ''
}

// 处理文件上传
const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    selectedFiles.value = Array.from(target.files)
  }
}

// 保存记账记录
const saveRecord = async () => {
  try {
    const data = { ...formData.value }

    // 处理文件上传
    if (selectedFiles.value.length > 0) {
      const formData = new FormData()
      selectedFiles.value.forEach(file => {
        formData.append('files', file)
      })

      const uploadResponse = await $fetch('/api/upload', {
        method: 'POST',
        body: formData
      }) as any

      if (uploadResponse.code === 0 && uploadResponse.data) {
        (data as any).attachments = uploadResponse.data
      }
    }

    if (showEditRecordModal.value) {
      // 编辑模式
      const recordId = records.value.find(r => r.project_id === formData.value.project_id && r.record_date === formData.value.record_date)?.id
      if (recordId) {
        const response = await $fetch(`/api/records/${recordId}`, {
          method: 'PUT',
          body: data
        }) as any
        if (response.code === 0) {
          await fetchRecords()
          closeModal()
        }
      }
    } else {
      // 新增模式
      const response = await $fetch('/api/records', {
        method: 'POST',
        body: data
      }) as any
      if (response.code === 0) {
        await fetchRecords()
        closeModal()
      }
    }
  } catch (error) {
    console.error('保存记账记录失败:', error)
  }
}

// 关闭模态框
const closeModal = () => {
  showAddRecordModal.value = false
  showEditRecordModal.value = false
  selectedFiles.value = []
  formData.value = {
    project_id: '',
    type: '',
    amount: 0,
    record_date: new Date().toISOString().split('T')[0],
    category_id: '',
    purchase_content_id: '',
    description: ''
  }
}

onMounted(async () => {
  await fetchProjects()
  await fetchExpenseCategories()
  await fetchPurchaseContents()
  await fetchRecords()
})
</script>
