<template>
  <Layout>
    <div class="accounting-page">
      <div class="page-header">
        <h2>记账管理</h2>
        <n-button type="primary" size="large" @click="navigateTo('/accounting/new')">
          <template #icon>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </template>
          新增记账
        </n-button>
      </div>

      <div class="search-section">
        <n-input
          v-model:value="searchParams.keyword"
          placeholder="搜索项目名称、客户或负责人..."
          class="search-input"
          clearable
          @keyup.enter="searchRecords"
        />
        <n-select
          v-model:value="searchParams.projectId"
          placeholder="所有项目"
          class="project-select"
          style="width: 200px"
        >
          <n-select-option value="">所有项目</n-select-option>
          <n-select-option
            v-for="project in projects"
            :key="project.id"
            :value="project.id"
          >
            {{ project.projectName }}
          </n-select-option>
        </n-select>
        <n-select
          v-model:value="searchParams.recordType"
          placeholder="所有类型"
          class="record-type-select"
          style="width: 120px"
        >
          <n-select-option value="">所有类型</n-select-option>
          <n-select-option value="income">收入</n-select-option>
          <n-select-option value="expense">支出</n-select-option>
        </n-select>
        <n-button type="primary" @click="searchRecords">搜索</n-button>
      </div>

      <div class="records-list">
        <n-data-table
          :columns="columns"
          :data="records.list"
          :pagination="false"
          class="records-table"
          :bordered="true"
          :scroll-x="1200"
        />
      </div>

      <div class="pagination" v-if="records.total > records.size">
        <n-pagination
          v-model:page="records.page"
          v-model:page-size="records.size"
          :page-sizes="[10, 20, 50, 100]"
          :item-count="records.total"
          show-size-picker
          show-quick-jumper
          show-page-sizes
          @update:page="fetchRecords"
          @update:page-size="fetchRecords"
        />
      </div>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import { ref, onMounted, h, computed } from 'vue'
import type { AccountingRecord } from '~/types/accounting'
import type { Project } from '~/types/project'
import { useApi } from '~/composables/useApi'
import { useRouter } from 'vue-router'

const router = useRouter()
const api = useApi()
const records = ref({
  list: [] as AccountingRecord[],
  total: 0,
  page: 1,
  size: 20
})

const projects = ref<Project[]>([])

const searchParams = ref({
  keyword: '',
  projectId: '',
  recordType: ''
})

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString()
}

const getProjectName = (projectId: string) => {
  const project = projects.value.find(p => p.id === projectId)
  return project?.projectName || ''
}

const columns = [
  {
    title: '项目名称',
    key: 'projectName',
    render: ({ projectId }: AccountingRecord) => {
      return getProjectName(projectId)
    }
  },
  {
    title: '记录类型',
    key: 'recordType',
    render: ({ recordType }: AccountingRecord) => {
      const typeMap = {
        income: { text: '收入', type: 'success' },
        expense: { text: '支出', type: 'error' }
      }
      const typeInfo = typeMap[recordType as keyof typeof typeMap] || { text: recordType, type: 'default' }
      return h('n-tag', { type: typeInfo.type }, { default: () => typeInfo.text })
    }
  },
  { title: '审批流程单ID', key: 'approvalId' },
  {
    title: '记账日期',
    key: 'recordDate',
    render: ({ recordDate }: AccountingRecord) => formatDate(recordDate)
  },
  {
    title: '金额',
    key: 'amount',
    render: ({ amount, recordType }: AccountingRecord) => {
      const prefix = recordType === 'income' ? '+' : '-'
      const type = recordType === 'income' ? 'success' : 'error'
      return h('span', { style: { color: type === 'success' ? '#52c41a' : '#ff4d4f', fontWeight: 'bold' } }, `${prefix}¥${amount.toFixed(2)}`)
    }
  },
  { title: '费用类别', key: 'categoryName' },
  { title: '用途说明', key: 'description' },
  { title: '申请人', key: 'applicant' },
  { title: '发票号', key: 'invoiceNo' },
  { title: '付款方', key: 'payer' },
  { title: '备注', key: 'remark', ellipsis: true },
  {
    title: '操作',
    key: 'actions',
    width: 150,
    render: ({ id }: AccountingRecord) => {
      return h('div', { style: { display: 'flex', gap: '8px' } }, [
        h('n-button', {
          type: 'primary',
          size: 'small',
          onClick: () => router.push(`/accounting/${id}/edit`)
        }, { default: () => '编辑' }),
        h('n-button', {
          type: 'error',
          size: 'small',
          onClick: () => deleteRecord(id)
        }, { default: () => '删除' })
      ])
    }
  }
]

const fetchRecords = async () => {
  try {
    const response = await api.records.list({
      page: records.value.page,
      size: records.value.size,
      keyword: searchParams.value.keyword,
      projectId: searchParams.value.projectId,
      recordType: searchParams.value.recordType
    })
    records.value = response
  } catch (error) {
    console.error('获取记账记录失败:', error)
    useMessage().error('获取记账记录失败')
  }
}

const fetchProjects = async () => {
  try {
    const response = await api.projects.list({ page: 1, size: 100 })
    projects.value = response.list
  } catch (error) {
    console.error('获取项目列表失败:', error)
    useMessage().error('获取项目列表失败')
  }
}

const searchRecords = () => {
  records.value.page = 1
  fetchRecords()
}

const deleteRecord = async (id: string) => {
  try {
    const dialog = useDialog()
    dialog.warning({
      title: '确认删除',
      content: '确定要删除这个记账记录吗？',
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: async () => {
        await api.records.delete(id)
        useMessage().success('记录删除成功')
        fetchRecords()
      }
    })
  } catch (error) {
    console.error('删除记录失败:', error)
    useMessage().error('删除记录失败')
  }
}

const navigateTo = (path: string) => {
  router.push(path)
}

onMounted(async () => {
  await Promise.all([
    fetchRecords(),
    fetchProjects()
  ])
})
</script>

<style scoped>
.accounting-page {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.search-section {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.search-input {
  flex: 1;
  min-width: 200px;
}

.project-select,
.record-type-select {
  min-width: 150px;
}

.records-list {
  margin-bottom: 20px;
}

.records-table {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .search-section {
    flex-direction: column;
  }

  .search-input {
    min-width: 100%;
  }

  .project-select,
  .record-type-select {
    min-width: 100%;
  }
}
</style>
