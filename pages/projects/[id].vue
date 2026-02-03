<template>
  <Layout>
    <div class="project-detail">
      <div class="page-header">
        <h2>项目详情</h2>
        <div class="header-actions">
          <NuxtLink :to="`/projects/${project.id}/edit`" class="btn btn-secondary">编辑</NuxtLink>
          <button @click="copyProject" class="btn btn-secondary">复制</button>
          <button @click="exportProject" class="btn btn-secondary">导出Excel</button>
          <button @click="deleteProject" class="btn btn-secondary" style="background-color: #ff4d4f; color: white;">删除</button>
        </div>
      </div>

      <div v-if="project" class="project-content">
        <div class="project-info">
          <h3>{{ project.projectName }}</h3>
          <p>负责人: {{ project.projectLeader }}</p>
          <p>客户: {{ project.clientName }}</p>
          <p>项目类型: {{ project.projectType }}</p>
          <p>服务日期: {{ formatDate(project.serviceStartDate) }} - {{ formatDate(project.serviceEndDate) }}</p>
          <p>服务金额: ¥{{ project.serviceAmount.toFixed(2) }}</p>
          <p>状态: <span :class="getStatusClass(project.status)">{{ getStatusText(project.status) }}</span></p>
          <p>创建时间: {{ formatDateTime(project.createdAt) }}</p>
          <p>更新时间: {{ formatDateTime(project.updatedAt) }}</p>
        </div>

        <div class="project-form-data" v-if="project.formData">
          <h3>项目表单数据</h3>
          <div class="form-section">
            <h4>基础信息</h4>
            <p>项目背景: {{ project.formData.basicInfo.projectBackground }}</p>
            <p>客户需求: {{ project.formData.basicInfo.clientDemand }}</p>
            <p>服务内容: {{ project.formData.basicInfo.serviceContent }}</p>
            <p>项目成员: {{ project.formData.basicInfo.projectMembers.join(', ') }}</p>
          </div>

          <div class="form-section" v-if="project.formData.serviceIncome && project.formData.serviceIncome.length > 0">
            <h4>服务收入</h4>
            <table class="table">
              <thead>
                <tr>
                  <th>采购内容</th>
                  <th>必要性描述</th>
                  <th>含税金额</th>
                  <th>税率</th>
                  <th>不含税金额</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in project.formData.serviceIncome" :key="item.id">
                  <td>{{ item.purchaseContent }}</td>
                  <td>{{ item.necessityDesc }}</td>
                  <td>¥{{ item.amount.toFixed(2) }}</td>
                  <td>{{ item.taxRate }}%</td>
                  <td>¥{{ (item.amount / (1 + item.taxRate / 100)).toFixed(2) }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="form-section" v-if="project.formData.outsourcingCost && project.formData.outsourcingCost.length > 0">
            <h4>外采成本</h4>
            <table class="table">
              <thead>
                <tr>
                  <th>采购内容</th>
                  <th>单价</th>
                  <th>数量</th>
                  <th>总价</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in project.formData.outsourcingCost" :key="item.id">
                  <td>{{ item.content }}</td>
                  <td>¥{{ item.unitPrice.toFixed(2) }}</td>
                  <td>{{ item.quantity }}</td>
                  <td>¥{{ (item.unitPrice * item.quantity).toFixed(2) }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="form-section" v-if="project.formData.laborCost && project.formData.laborCost.length > 0">
            <h4>人工成本</h4>
            <table class="table">
              <thead>
                <tr>
                  <th>员工姓名</th>
                  <th>员工级别</th>
                  <th>日成本</th>
                  <th>投入天数</th>
                  <th>总成本</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in project.formData.laborCost" :key="item.id">
                  <td>{{ item.employeeName }}</td>
                  <td>{{ item.level }}</td>
                  <td>¥{{ item.dailyCost.toFixed(2) }}</td>
                  <td>{{ item.days }}</td>
                  <td>¥{{ (item.dailyCost * item.days).toFixed(2) }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="form-section" v-if="project.formData.otherExpenses && project.formData.otherExpenses.length > 0">
            <h4>其他费用</h4>
            <table class="table">
              <thead>
                <tr>
                  <th>费用类型</th>
                  <th>金额</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in project.formData.otherExpenses" :key="item.id">
                  <td>{{ item.category }}</td>
                  <td>¥{{ item.amount.toFixed(2) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="project-records">
          <h3>记账记录</h3>
          <div class="record-filters">
            <select v-model="recordType" class="record-type-select">
              <option value="">所有类型</option>
              <option value="income">收入</option>
              <option value="expense">支出</option>
            </select>
            <NuxtLink to="/accounting/new" class="btn btn-primary">新增记账</NuxtLink>
          </div>
          <table class="table">
            <thead>
              <tr>
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
              <tr v-for="record in filteredRecords" :key="record.id">
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
      </div>

      <div v-else class="loading">
        加载中...
      </div>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import type { Project } from '~/types/project'
import type { AccountingRecord } from '~/types/accounting'

const route = useRoute()
const id = route.params.id as string

const project = ref<Project | null>(null)
const records = ref<AccountingRecord[]>([])
const recordType = ref<string>('')

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString()
}

const formatDateTime = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleString()
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

const getStatusClass = (status: string) => {
  const statusMap: Record<string, string> = {
    draft: 'status-draft',
    submitted: 'status-submitted',
    completed: 'status-completed',
    closed: 'status-closed'
  }
  return statusMap[status] || ''
}

const filteredRecords = computed(() => {
  if (!recordType.value) {
    return records.value
  }
  return records.value.filter(record => record.recordType === recordType.value)
})

const fetchProject = async () => {
  try {
    const response = await $fetch(`/api/projects/${id}`)
    if (response?.code === 0) {
      project.value = response.data
    }
  } catch (error) {
    console.error('获取项目详情失败:', error)
  }
}

const fetchRecords = async () => {
  try {
    const response = await $fetch(`/api/projects/${id}/records`)
    if (response?.code === 0) {
      records.value = response.data
    }
  } catch (error) {
    console.error('获取记账记录失败:', error)
  }
}

const copyProject = async () => {
  try {
    const response = await $fetch(`/api/projects/${id}/copy`, {
      method: 'POST'
    })
    if (response?.code === 0) {
      alert('项目复制成功')
      await fetchProject()
    } else {
      alert(response?.message || '复制项目失败')
    }
  } catch (error) {
    console.error('复制项目失败:', error)
    alert('复制项目失败')
  }
}

const exportProject = async () => {
  try {
    const response = await $fetch(`/api/projects/${id}/export`, {
      responseType: 'blob'
    })

    // 创建下载链接
    const url = window.URL.createObjectURL(new Blob([response]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `${project.value?.projectName}_详情.xlsx`)
    document.body.appendChild(link)
    link.click()

    // 清理
    link.parentNode?.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('导出项目失败:', error)
    alert('导出项目失败')
  }
}

const deleteProject = async () => {
  if (!confirm('确定要删除这个项目吗？')) {
    return
  }

  try {
    const response = await $fetch(`/api/projects/${id}`, {
      method: 'DELETE'
    })
    if (response?.code === 0) {
      alert('项目删除成功')
      navigateTo('/projects')
    } else {
      alert(response?.message || '删除项目失败')
    }
  } catch (error) {
    console.error('删除项目失败:', error)
    alert('删除项目失败')
  }
}

const deleteRecord = async (recordId: string) => {
  if (!confirm('确定要删除这个记账记录吗？')) {
    return
  }

  try {
    const response = await $fetch(`/api/records/${recordId}`, {
      method: 'DELETE'
    })
    if (response?.code === 0) {
      alert('记录删除成功')
      await fetchRecords()
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
    fetchProject(),
    fetchRecords()
  ])
})
</script>

<style scoped>
.project-detail {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.project-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.project-info h3 {
  margin: 0 0 16px 0;
  font-size: 24px;
  color: #1890ff;
}

.project-info p {
  margin: 8px 0;
  font-size: 14px;
  color: #666;
}

.project-form-data {
  margin-top: 24px;
}

.form-section {
  margin-bottom: 24px;
  padding: 16px;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
}

.form-section h4 {
  margin: 0 0 12px 0;
  font-size: 16px;
  color: #333;
}

.project-records {
  margin-top: 24px;
}

.record-filters {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.record-type-select {
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
}

.status-draft {
  color: #faad14;
}

.status-submitted {
  color: #1890ff;
}

.status-completed {
  color: #52c41a;
}

.status-closed {
  color: #8c8c8c;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .header-actions {
    width: 100%;
    flex-direction: column;
  }

  .project-info h3 {
    font-size: 20px;
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
