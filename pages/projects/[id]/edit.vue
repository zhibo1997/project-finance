<template>
  <Layout>
    <div class="project-form-page">
      <div class="page-header">
        <h2>{{ project ? '编辑项目' : '新建项目' }}</h2>
      </div>

      <form @submit.prevent="submitForm" class="project-form">
        <div class="form-section">
          <h3>项目基本信息</h3>

          <div class="form-group">
            <label for="projectName">项目名称 *</label>
            <input
              id="projectName"
              v-model="formData.basicInfo.projectName"
              type="text"
              required
              placeholder="请输入项目名称"
            />
          </div>

          <div class="form-group">
            <label for="projectLeader">项目负责人 *</label>
            <input
              id="projectLeader"
              v-model="formData.basicInfo.projectLeader"
              type="text"
              required
              placeholder="请输入项目负责人"
            />
          </div>

          <div class="form-group">
            <label for="clientName">客户名称 *</label>
            <input
              id="clientName"
              v-model="formData.basicInfo.clientName"
              type="text"
              required
              placeholder="请输入客户名称"
            />
          </div>

          <div class="form-group">
            <label for="projectType">项目类型 *</label>
            <input
              id="projectType"
              v-model="formData.basicInfo.projectType"
              type="text"
              required
              placeholder="请输入项目类型"
            />
          </div>

          <div class="form-group">
            <label for="serviceStartDate">服务开始日期 *</label>
            <input
              id="serviceStartDate"
              v-model="formData.basicInfo.serviceStartDate"
              type="date"
              required
            />
          </div>

          <div class="form-group">
            <label for="serviceEndDate">服务结束日期 *</label>
            <input
              id="serviceEndDate"
              v-model="formData.basicInfo.serviceEndDate"
              type="date"
              required
            />
          </div>

          <div class="form-group">
            <label for="projectMembers">项目成员</label>
            <input
              id="projectMembers"
              v-model="projectMembersText"
              type="text"
              placeholder="请输入项目成员，用逗号分隔"
            />
          </div>

          <div class="form-group">
            <label for="projectBackground">项目背景</label>
            <textarea
              id="projectBackground"
              v-model="formData.basicInfo.projectBackground"
              placeholder="请输入项目背景"
            ></textarea>
          </div>

          <div class="form-group">
            <label for="clientDemand">客户需求</label>
            <textarea
              id="clientDemand"
              v-model="formData.basicInfo.clientDemand"
              placeholder="请输入客户需求"
            ></textarea>
          </div>

          <div class="form-group">
            <label for="serviceContent">服务内容</label>
            <textarea
              id="serviceContent"
              v-model="formData.basicInfo.serviceContent"
              placeholder="请输入服务内容"
            ></textarea>
          </div>
        </div>

        <div class="form-section">
          <h3>服务收入</h3>
          <button type="button" @click="addServiceIncomeItem" class="btn btn-secondary">
            新增收入项
          </button>
          <div v-for="(item, index) in formData.serviceIncome" :key="item.id" class="income-item">
            <div class="form-group">
              <label>采购内容 *</label>
              <input
                v-model="item.purchaseContent"
                type="text"
                required
                placeholder="请输入采购内容"
              />
            </div>
            <div class="form-group">
              <label>必要性描述 *</label>
              <textarea
                v-model="item.necessityDesc"
                required
                placeholder="请输入必要性描述"
              ></textarea>
            </div>
            <div class="form-group">
              <label>含税金额 *</label>
              <input
                v-model.number="item.amount"
                type="number"
                required
                placeholder="请输入含税金额"
              />
            </div>
            <div class="form-group">
              <label>税率 *</label>
              <input
                v-model.number="item.taxRate"
                type="number"
                required
                placeholder="请输入税率"
              />
            </div>
            <button type="button" @click="removeServiceIncomeItem(index)" class="btn btn-secondary">
              删除
            </button>
          </div>
        </div>

        <div class="form-section">
          <h3>外采成本</h3>
          <button type="button" @click="addOutsourcingCostItem" class="btn btn-secondary">
            新增外采成本项
          </button>
          <div v-for="(item, index) in formData.outsourcingCost" :key="item.id" class="cost-item">
            <div class="form-group">
              <label>采购内容 *</label>
              <input
                v-model="item.content"
                type="text"
                required
                placeholder="请输入采购内容"
              />
            </div>
            <div class="form-group">
              <label>单价 *</label>
              <input
                v-model.number="item.unitPrice"
                type="number"
                required
                placeholder="请输入单价"
              />
            </div>
            <div class="form-group">
              <label>数量 *</label>
              <input
                v-model.number="item.quantity"
                type="number"
                required
                placeholder="请输入数量"
              />
            </div>
            <button type="button" @click="removeOutsourcingCostItem(index)" class="btn btn-secondary">
              删除
            </button>
          </div>
        </div>

        <div class="form-section">
          <h3>人工成本</h3>
          <button type="button" @click="addLaborCostItem" class="btn btn-secondary">
            新增人工成本项
          </button>
          <div v-for="(item, index) in formData.laborCost" :key="item.id" class="labor-item">
            <div class="form-group">
              <label>员工姓名 *</label>
              <input
                v-model="item.employeeName"
                type="text"
                required
                placeholder="请输入员工姓名"
              />
            </div>
            <div class="form-group">
              <label>员工级别 *</label>
              <input
                v-model="item.level"
                type="text"
                required
                placeholder="请输入员工级别"
              />
            </div>
            <div class="form-group">
              <label>日成本 *</label>
              <input
                v-model.number="item.dailyCost"
                type="number"
                required
                placeholder="请输入日成本"
              />
            </div>
            <div class="form-group">
              <label>投入天数 *</label>
              <input
                v-model.number="item.days"
                type="number"
                required
                placeholder="请输入投入天数"
              />
            </div>
            <button type="button" @click="removeLaborCostItem(index)" class="btn btn-secondary">
              删除
            </button>
          </div>
        </div>

        <div class="form-section">
          <h3>其他费用</h3>
          <button type="button" @click="addOtherExpenseItem" class="btn btn-secondary">
            新增其他费用项
          </button>
          <div v-for="(item, index) in formData.otherExpenses" :key="item.id" class="expense-item">
            <div class="form-group">
              <label>费用类型 *</label>
              <input
                v-model="item.category"
                type="text"
                required
                placeholder="请输入费用类型"
              />
            </div>
            <div class="form-group">
              <label>金额 *</label>
              <input
                v-model.number="item.amount"
                type="number"
                required
                placeholder="请输入金额"
              />
            </div>
            <button type="button" @click="removeOtherExpenseItem(index)" class="btn btn-secondary">
              删除
            </button>
          </div>
        </div>

        <div class="form-actions">
          <NuxtLink to="/projects" class="btn btn-secondary">取消</NuxtLink>
          <button type="submit" class="btn btn-primary">保存</button>
        </div>
      </form>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { ProjectFormData, ServiceIncomeItem, OutsourcingCostItem, LaborCostItem, OtherExpenseItem } from '~/types/project'

const route = useRoute()
const id = route.params.id as string

const formData = ref<ProjectFormData>({
  basicInfo: {
    projectName: '',
    projectLeader: '',
    clientName: '',
    projectType: '',
    serviceStartDate: new Date().toISOString().split('T')[0],
    serviceEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    projectMembers: [],
    projectBackground: '',
    clientDemand: '',
    serviceContent: ''
  },
  serviceIncome: [],
  outsourcingCost: [],
  laborCost: [],
  otherExpenses: []
})

const projectMembersText = ref('')

const generateId = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

const addServiceIncomeItem = () => {
  const item: ServiceIncomeItem = {
    id: generateId(),
    purchaseContent: '',
    necessityDesc: '',
    amount: 0,
    taxRate: 0
  }
  formData.value.serviceIncome.push(item)
}

const removeServiceIncomeItem = (index: number) => {
  formData.value.serviceIncome.splice(index, 1)
}

const addOutsourcingCostItem = () => {
  const item: OutsourcingCostItem = {
    id: generateId(),
    content: '',
    unitPrice: 0,
    quantity: 0
  }
  formData.value.outsourcingCost.push(item)
}

const removeOutsourcingCostItem = (index: number) => {
  formData.value.outsourcingCost.splice(index, 1)
}

const addLaborCostItem = () => {
  const item: LaborCostItem = {
    id: generateId(),
    employeeId: '',
    employeeName: '',
    level: '',
    dailyCost: 0,
    days: 0
  }
  formData.value.laborCost.push(item)
}

const removeLaborCostItem = (index: number) => {
  formData.value.laborCost.splice(index, 1)
}

const addOtherExpenseItem = () => {
  const item: OtherExpenseItem = {
    id: generateId(),
    category: '',
    amount: 0
  }
  formData.value.otherExpenses.push(item)
}

const removeOtherExpenseItem = (index: number) => {
  formData.value.otherExpenses.splice(index, 1)
}

const fetchProject = async () => {
  try {
    const response = await $fetch(`/api/projects/${id}`)
    if (response?.code === 0) {
      formData.value = response.data.formData
      projectMembersText.value = response.data.formData.basicInfo.projectMembers.join(', ')
    }
  } catch (error) {
    console.error('获取项目详情失败:', error)
  }
}

const submitForm = async () => {
  try {
    // 处理项目成员
    formData.value.basicInfo.projectMembers = projectMembersText.value.split(',').map(member => member.trim()).filter(member => member.length > 0)

    // 计算服务总金额
    let totalAmount = 0
    formData.value.serviceIncome.forEach(item => {
      totalAmount += item.amount
    })

    if (id) {
      // 编辑项目
      const response = await $fetch(`/api/projects/${id}`, {
        method: 'PUT',
        body: {
          ...formData.value.basicInfo,
          serviceAmount: totalAmount,
          formData: formData.value
        }
      })
      if (response?.code === 0) {
        alert('项目更新成功')
        navigateTo(`/projects/${id}`)
      } else {
        alert(response?.message || '更新项目失败')
      }
    } else {
      // 新建项目
      const response = await $fetch('/api/projects', {
        method: 'POST',
        body: {
          ...formData.value.basicInfo,
          serviceAmount: totalAmount,
          formData: formData.value
        }
      })
      if (response?.code === 0) {
        alert('项目创建成功')
        navigateTo(`/projects/${response.data.id}`)
      } else {
        alert(response?.message || '创建项目失败')
      }
    }
  } catch (error) {
    console.error('保存项目失败:', error)
    alert('保存项目失败')
  }
}

onMounted(() => {
  if (id) {
    fetchProject()
  }
})
</script>

<style scoped>
.project-form-page {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 20px;
}

.project-form {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.form-section {
  margin-bottom: 24px;
  padding: 16px;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
}

.form-section h3 {
  margin: 0 0 16px 0;
  font-size: 18px;
  color: #333;
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

.income-item,
.cost-item,
.labor-item,
.expense-item {
  margin-bottom: 16px;
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
  .project-form {
    padding: 15px;
  }

  .form-section {
    padding: 12px;
  }

  .form-actions {
    flex-direction: column;
  }
}
</style>
