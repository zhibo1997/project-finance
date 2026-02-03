<template>
  <Layout>
    <div class="accounting-form-page">
      <div class="page-header">
        <h2>编辑记账</h2>
      </div>

      <form @submit.prevent="submitForm" class="accounting-form">
        <div class="form-group">
          <label for="recordType">记录类型 *</label>
          <select id="recordType" v-model="formData.recordType" required>
            <option value="">请选择记录类型</option>
            <option value="income">收入</option>
            <option value="expense">支出</option>
          </select>
        </div>

        <div class="form-group">
          <label for="projectId">项目 *</label>
          <select id="projectId" v-model="formData.projectId" required>
            <option value="">请选择项目</option>
            <option v-for="project in projects" :key="project.id" :value="project.id">
              {{ project.projectName }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label for="approvalId">审批流程单ID *</label>
          <input
            id="approvalId"
            v-model="formData.approvalId"
            type="text"
            required
            placeholder="请输入审批流程单ID"
          />
        </div>

        <div class="form-group">
          <label for="recordDate">记账日期 *</label>
          <input
            id="recordDate"
            v-model="formData.recordDate"
            type="date"
            required
          />
        </div>

        <div class="form-group">
          <label for="amount">金额 *</label>
          <input
            id="amount"
            v-model.number="formData.amount"
            type="number"
            required
            placeholder="请输入金额"
          />
        </div>

        <!-- 支出类型特有字段 -->
        <div v-if="formData.recordType === 'expense'" class="expense-fields">
          <div class="form-group">
            <label for="categoryId">费用类别 *</label>
            <select id="categoryId" v-model="formData.categoryId" required>
              <option value="">请选择费用类别</option>
              <option v-for="category in expenseCategories" :key="category.id" :value="category.id">
                {{ category.name }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label for="description">用途说明 *</label>
            <textarea
              id="description"
              v-model="formData.description"
              required
              placeholder="请输入用途说明"
            ></textarea>
          </div>

          <div class="form-group">
            <label for="applicant">申请人 *</label>
            <input
              id="applicant"
              v-model="formData.applicant"
              type="text"
              required
              placeholder="请输入申请人"
            />
          </div>
        </div>

        <!-- 收入类型特有字段 -->
        <div v-if="formData.recordType === 'income'" class="income-fields">
          <div class="form-group">
            <label for="invoiceNo">发票号</label>
            <input
              id="invoiceNo"
              v-model="formData.invoiceNo"
              type="text"
              placeholder="请输入发票号"
            />
          </div>

          <div class="form-group">
            <label for="payer">付款方</label>
            <input
              id="payer"
              v-model="formData.payer"
              type="text"
              placeholder="请输入付款方"
            />
          </div>
        </div>

        <div class="form-group">
          <label for="attachments">附件</label>
          <FileUpload v-model="formData.attachments" />
        </div>

        <div class="form-group">
          <label for="remark">备注</label>
          <textarea
            id="remark"
            v-model="formData.remark"
            placeholder="请输入备注"
          ></textarea>
        </div>

        <div class="form-actions">
          <NuxtLink to="/accounting" class="btn btn-secondary">取消</NuxtLink>
          <button type="submit" class="btn btn-primary">保存</button>
        </div>
      </form>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { CreateIncomeRecordDTO, CreateExpenseRecordDTO } from '~/types/accounting'
import type { Project } from '~/types/project'
import type { ExpenseCategory } from '~/types/config'

const route = useRoute()
const id = route.params.id as string

const formData = ref<CreateIncomeRecordDTO & CreateExpenseRecordDTO & { recordType: 'income' | 'expense'; projectId: string; attachments?: string[] }>({
  recordType: 'income',
  projectId: '',
  approvalId: '',
  recordDate: new Date().toISOString().split('T')[0],
  amount: 0,
  categoryId: '',
  description: '',
  applicant: '',
  invoiceNo: '',
  payer: '',
  attachments: [],
  remark: ''
})

const projects = ref<Project[]>([])
const expenseCategories = ref<ExpenseCategory[]>([])

const fetchRecord = async () => {
  try {
    const response = await $fetch(`/api/records/${id}`)
    if (response?.code === 0) {
      formData.value = response.data
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

const fetchExpenseCategories = async () => {
  try {
    const response = await $fetch('/api/dict/expense-categories')
    if (response?.code === 0) {
      expenseCategories.value = response.data
    }
  } catch (error) {
    console.error('获取费用类别失败:', error)
  }
}

const submitForm = async () => {
  try {
    const response = await $fetch(`/api/records/${id}`, {
      method: 'PUT',
      body: formData.value
    })

    if (response?.code === 0) {
      alert('记账记录更新成功')
      navigateTo('/accounting')
    } else {
      alert(response?.message || '更新记账记录失败')
    }
  } catch (error) {
    console.error('保存记账记录失败:', error)
    alert('保存记账记录失败')
  }
}

onMounted(async () => {
  await Promise.all([
    fetchRecord(),
    fetchProjects(),
    fetchExpenseCategories()
  ])
})
</script>

<style scoped>
.accounting-form-page {
  max-width: 800px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 20px;
}

.accounting-form {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
}

.form-group textarea {
  resize: vertical;
  min-height: 100px;
}

.expense-fields,
.income-fields {
  margin-top: 16px;
  padding: 16px;
  background-color: #fafafa;
  border-radius: 4px;
}

.form-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

@media (max-width: 768px) {
  .accounting-form {
    padding: 15px;
  }

  .form-actions {
    flex-direction: column;
  }
}
</style>
