<template>
  <Layout>
    <div class="accounting-page">
      <div class="page-header">
        <h2>记账管理</h2>
        <NuxtLink to="/accounting/new" class="btn btn-primary">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          新增记账
        </NuxtLink>
      </div>

      <div class="search-section">
        <input
          v-model="searchParams.keyword"
          type="text"
          placeholder="搜索项目名称、客户或负责人..."
          class="search-input"
        />
        <select v-model="searchParams.projectId" class="project-select">
          <option value="">所有项目</option>
          <option v-for="project in projects" :key="project.id" :value="project.id">
            {{ project.projectName }}
          </option>
        </select>
        <select v-model="searchParams.recordType" class="record-type-select">
          <option value="">所有类型</option>
          <option value="income">收入</option>
          <option value="expense">支出</option>
        </select>
        <button @click="searchRecords" class="btn btn-primary">搜索</button>
      </div>

      <div class="records-list">
        <table class="table">
          <thead>
            <tr>
              <th>项目名称</th>
              <th>记录类型</th>
              <th>审批流程单ID</th>
              <th>记账日期</th>
              <th>金额</th>
              <th>费用类别</th>
              <th>用途说明</th>
              <th>申请人</th>
              <th>发票号</th>
              <th>付款方</th>
              <th>备注</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="record in records.list" :key="record.id">
              <td>{{ getProjectName(record.projectId) }}</td>
              <td>{{ record.recordType === 'income' ? '收入' : '支出' }}</td>
              <td>{{ record.approvalId }}</td>
              <td>{{ formatDate(record.recordDate) }}</td>
              <td>¥{{ record.amount.toFixed(2) }}</td>
              <td>{{ record.categoryName }}</td>
              <td>{{ record.description }}</td>
              <td>{{ record.applicant }}</td>
              <td>{{ record.invoiceNo }}</td>
              <td>{{ record.payer }}</td>
              <td>{{ record.remark }}</td>
              <td>
                <NuxtLink :to="`/accounting/${record.id}/edit`" class="btn btn-secondary">编辑</NuxtLink>
                <button @click="deleteRecord(record.id)" class="btn btn-secondary">删除</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="pagination" v-if="records.total > records.size">
        <button @click="changePage(records.page - 1)" :disabled="records.page <= 1" class="btn btn-secondary">上一页</button>
        <span>第 {{ records.page }} 页 / 共 {{ Math.ceil(records.total / records.size) }} 页</span>
        <button @click="changePage(records.page + 1)" :disabled="records.page >= Math.ceil(records.total / records.size)" class="btn btn-secondary">下一页</button>
      </div>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import type { AccountingRecord } from '~/types/accounting'
import type { Project } from '~/types/project'

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

const fetchRecords = async () => {
  try {
    const params = new URLSearchParams()
    params.append('page', records.value.page.toString())
    params.append('size', records.value.size.toString())
    if (searchParams.value.keyword) {
      params.append('keyword', searchParams.value.keyword)
    }
    if (searchParams.value.projectId) {
      params.append('projectId', searchParams.value.projectId)
    }
    if (searchParams.value.recordType) {
      params.append('recordType', searchParams.value.recordType)
    }

    const response = await $fetch(`/api/records?${params.toString()}`)
    if (response?.code === 0) {
      records.value = response.data
    }
  } catch (error) {
    console.error('获取记账记录失败:', error)
  }
}

const fetchProjects = async () => {
  try {
    const response = await $fetch('/api/projects?page=1&size=100')
    if (response?.code === 0) {
      projects.value = response.data.list
    }
  } catch (error) {
    console.error('获取项目列表失败:', error)
  }
}

const searchRecords = () => {
  records.value.page = 1
  fetchRecords()
}

const changePage = (page: number) => {
  records.value.page = page
  fetchRecords()
}

const deleteRecord = async (id: string) => {
  if (!confirm('确定要删除这个记账记录吗？')) {
    return
  }

  try {
    const response = await $fetch(`/api/records/${id}`, {
      method: 'DELETE'
    })
    if (response?.code === 0) {
      alert('记录删除成功')
      fetchRecords()
    } else {
      alert(response?.message || '删除记录失败')
    }
  } catch (error) {
    console.error('删除记录失败:', error)
    alert('删除记录失败')
  }
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
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
}

.project-select,
.record-type-select {
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
}

.records-list {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-top: 20px;
}

@media (max-width: 768px) {
  .search-section {
    flex-direction: column;
  }

  .search-input {
    min-width: 100%;
  }

  .table {
    font-size: 12px;
  }

  .table th,
  .table td {
    padding: 8px;
  }
}
</style>
