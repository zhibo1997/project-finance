<template>
  <Layout>
    <div class="config-page">
      <div class="page-header">
        <h2>配置管理</h2>
      </div>

      <div class="config-tabs">
        <button
          :class="['tab-button', { active: activeTab === 'expense' }]"
          @click="activeTab = 'expense'"
        >
          费用类别
        </button>
        <button
          :class="['tab-button', { active: activeTab === 'purchase' }]"
          @click="activeTab = 'purchase'"
        >
          采购内容
        </button>
        <button
          :class="['tab-button', { active: activeTab === 'employee' }]"
          @click="activeTab = 'employee'"
        >
          员工成本配置
        </button>
      </div>

      <!-- 费用类别管理 -->
      <div v-if="activeTab === 'expense'" class="config-content">
        <div class="content-header">
          <h3>费用类别管理</h3>
          <button @click="showExpenseModal = true" class="btn btn-primary">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            新增类别
          </button>
        </div>
        <table class="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>名称</th>
              <th>排序号</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="category in expenseCategories" :key="category.id">
              <td>{{ category.id }}</td>
              <td>{{ category.name }}</td>
              <td>{{ category.sortOrder }}</td>
              <td>
                <button @click="editExpenseCategory(category)" class="btn btn-secondary">编辑</button>
                <button @click="deleteExpenseCategory(category.id)" class="btn btn-secondary">删除</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 采购内容管理 -->
      <div v-if="activeTab === 'purchase'" class="config-content">
        <div class="content-header">
          <h3>采购内容管理</h3>
          <button @click="showPurchaseModal = true" class="btn btn-primary">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            新增采购内容
          </button>
        </div>
        <table class="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>名称</th>
              <th>排序号</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="content in purchaseContents" :key="content.id">
              <td>{{ content.id }}</td>
              <td>{{ content.name }}</td>
              <td>{{ content.sortOrder }}</td>
              <td>
                <button @click="editPurchaseContent(content)" class="btn btn-secondary">编辑</button>
                <button @click="deletePurchaseContent(content.id)" class="btn btn-secondary">删除</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 员工成本配置管理 -->
      <div v-if="activeTab === 'employee'" class="config-content">
        <div class="content-header">
          <h3>员工成本配置管理</h3>
          <button @click="showEmployeeModal = true" class="btn btn-primary">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            新增配置
          </button>
        </div>
        <table class="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>级别标识</th>
              <th>级别名称</th>
              <th>日成本</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="config in employeeCostConfigs" :key="config.id">
              <td>{{ config.id }}</td>
              <td>{{ config.levelKey }}</td>
              <td>{{ config.levelName }}</td>
              <td>¥{{ config.dailyCost.toFixed(2) }}</td>
              <td>
                <button @click="editEmployeeCostConfig(config)" class="btn btn-secondary">编辑</button>
                <button @click="deleteEmployeeCostConfig(config.id)" class="btn btn-secondary">删除</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 费用类别表单模态框 -->
      <div v-if="showExpenseModal" class="modal">
        <div class="modal-content">
          <div class="modal-header">
            <h3>{{ editingExpenseCategory ? '编辑费用类别' : '新增费用类别' }}</h3>
            <button @click="closeExpenseModal" class="close-button">×</button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveExpenseCategory">
              <div class="form-group">
                <label for="expenseName">类别名称 *</label>
                <input
                  id="expenseName"
                  v-model="expenseForm.name"
                  type="text"
                  required
                  placeholder="请输入类别名称"
                />
              </div>
              <div class="form-group">
                <label for="expenseSortOrder">排序号</label>
                <input
                  id="expenseSortOrder"
                  v-model.number="expenseForm.sortOrder"
                  type="number"
                  placeholder="请输入排序号"
                />
              </div>
              <div class="form-actions">
                <button type="button" @click="closeExpenseModal" class="btn btn-secondary">取消</button>
                <button type="submit" class="btn btn-primary">保存</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- 采购内容表单模态框 -->
      <div v-if="showPurchaseModal" class="modal">
        <div class="modal-content">
          <div class="modal-header">
            <h3>{{ editingPurchaseContent ? '编辑采购内容' : '新增采购内容' }}</h3>
            <button @click="closePurchaseModal" class="close-button">×</button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="savePurchaseContent">
              <div class="form-group">
                <label for="purchaseName">采购内容名称 *</label>
                <input
                  id="purchaseName"
                  v-model="purchaseForm.name"
                  type="text"
                  required
                  placeholder="请输入采购内容名称"
                />
              </div>
              <div class="form-group">
                <label for="purchaseSortOrder">排序号</label>
                <input
                  id="purchaseSortOrder"
                  v-model.number="purchaseForm.sortOrder"
                  type="number"
                  placeholder="请输入排序号"
                />
              </div>
              <div class="form-actions">
                <button type="button" @click="closePurchaseModal" class="btn btn-secondary">取消</button>
                <button type="submit" class="btn btn-primary">保存</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- 员工成本配置表单模态框 -->
      <div v-if="showEmployeeModal" class="modal">
        <div class="modal-content">
          <div class="modal-header">
            <h3>{{ editingEmployeeCostConfig ? '编辑员工成本配置' : '新增员工成本配置' }}</h3>
            <button @click="closeEmployeeModal" class="close-button">×</button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveEmployeeCostConfig">
              <div class="form-group">
                <label for="employeeLevelKey">级别标识 *</label>
                <input
                  id="employeeLevelKey"
                  v-model="employeeForm.levelKey"
                  type="text"
                  required
                  placeholder="请输入级别标识"
                />
              </div>
              <div class="form-group">
                <label for="employeeLevelName">级别名称 *</label>
                <input
                  id="employeeLevelName"
                  v-model="employeeForm.levelName"
                  type="text"
                  required
                  placeholder="请输入级别名称"
                />
              </div>
              <div class="form-group">
                <label for="employeeDailyCost">日成本 *</label>
                <input
                  id="employeeDailyCost"
                  v-model.number="employeeForm.dailyCost"
                  type="number"
                  required
                  placeholder="请输入日成本"
                />
              </div>
              <div class="form-actions">
                <button type="button" @click="closeEmployeeModal" class="btn btn-secondary">取消</button>
                <button type="submit" class="btn btn-primary">保存</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { ExpenseCategory } from '~/types/config'
import type { PurchaseContent } from '~/types/config'
import type { EmployeeCostConfig } from '~/types/config'

const activeTab = ref('expense')

// 费用类别数据
const expenseCategories = ref<ExpenseCategory[]>([])
const showExpenseModal = ref(false)
const editingExpenseCategory = ref<ExpenseCategory | null>(null)
const expenseForm = ref({
  name: '',
  sortOrder: 0
})

// 采购内容数据
const purchaseContents = ref<PurchaseContent[]>([])
const showPurchaseModal = ref(false)
const editingPurchaseContent = ref<PurchaseContent | null>(null)
const purchaseForm = ref({
  name: '',
  sortOrder: 0
})

// 员工成本配置数据
const employeeCostConfigs = ref<EmployeeCostConfig[]>([])
const showEmployeeModal = ref(false)
const editingEmployeeCostConfig = ref<EmployeeCostConfig | null>(null)
const employeeForm = ref({
  levelKey: '',
  levelName: '',
  dailyCost: 0
})

// 获取费用类别
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

// 获取采购内容
const fetchPurchaseContents = async () => {
  try {
    const response = await $fetch('/api/dict/purchase-contents')
    if (response?.code === 0) {
      purchaseContents.value = response.data
    }
  } catch (error) {
    console.error('获取采购内容失败:', error)
  }
}

// 获取员工成本配置
const fetchEmployeeCostConfigs = async () => {
  try {
    const response = await $fetch('/api/config/employee-costs')
    if (response?.code === 0) {
      employeeCostConfigs.value = response.data
    }
  } catch (error) {
    console.error('获取员工成本配置失败:', error)
  }
}

// 费用类别操作
const editExpenseCategory = (category: ExpenseCategory) => {
  editingExpenseCategory.value = category
  expenseForm.value = { ...category }
  showExpenseModal.value = true
}

const closeExpenseModal = () => {
  showExpenseModal.value = false
  editingExpenseCategory.value = null
  expenseForm.value = { name: '', sortOrder: 0 }
}

const saveExpenseCategory = async () => {
  try {
    if (editingExpenseCategory.value) {
      // 编辑
      const response = await $fetch(`/api/dict/expense-categories/${editingExpenseCategory.value.id}`, {
        method: 'PUT',
        body: expenseForm.value
      })
      if (response?.code === 0) {
        alert('费用类别更新成功')
        closeExpenseModal()
        await fetchExpenseCategories()
      } else {
        alert(response?.message || '更新费用类别失败')
      }
    } else {
      // 新增
      const response = await $fetch('/api/dict/expense-categories', {
        method: 'POST',
        body: expenseForm.value
      })
      if (response?.code === 0) {
        alert('费用类别创建成功')
        closeExpenseModal()
        await fetchExpenseCategories()
      } else {
        alert(response?.message || '创建费用类别失败')
      }
    }
  } catch (error) {
    console.error('保存费用类别失败:', error)
    alert('保存费用类别失败')
  }
}

const deleteExpenseCategory = async (id: string) => {
  if (!confirm('确定要删除这个费用类别吗？')) {
    return
  }

  try {
    const response = await $fetch(`/api/dict/expense-categories/${id}`, {
      method: 'DELETE'
    })
    if (response?.code === 0) {
      alert('费用类别删除成功')
      await fetchExpenseCategories()
    } else {
      alert(response?.message || '删除费用类别失败')
    }
  } catch (error) {
    console.error('删除费用类别失败:', error)
    alert('删除费用类别失败')
  }
}

// 采购内容操作
const editPurchaseContent = (content: PurchaseContent) => {
  editingPurchaseContent.value = content
  purchaseForm.value = { ...content }
  showPurchaseModal.value = true
}

const closePurchaseModal = () => {
  showPurchaseModal.value = false
  editingPurchaseContent.value = null
  purchaseForm.value = { name: '', sortOrder: 0 }
}

const savePurchaseContent = async () => {
  try {
    if (editingPurchaseContent.value) {
      // 编辑
      const response = await $fetch(`/api/dict/purchase-contents/${editingPurchaseContent.value.id}`, {
        method: 'PUT',
        body: purchaseForm.value
      })
      if (response?.code === 0) {
        alert('采购内容更新成功')
        closePurchaseModal()
        await fetchPurchaseContents()
      } else {
        alert(response?.message || '更新采购内容失败')
      }
    } else {
      // 新增
      const response = await $fetch('/api/dict/purchase-contents', {
        method: 'POST',
        body: purchaseForm.value
      })
      if (response?.code === 0) {
        alert('采购内容创建成功')
        closePurchaseModal()
        await fetchPurchaseContents()
      } else {
        alert(response?.message || '创建采购内容失败')
      }
    }
  } catch (error) {
    console.error('保存采购内容失败:', error)
    alert('保存采购内容失败')
  }
}

const deletePurchaseContent = async (id: string) => {
  if (!confirm('确定要删除这个采购内容吗？')) {
    return
  }

  try {
    const response = await $fetch(`/api/dict/purchase-contents/${id}`, {
      method: 'DELETE'
    })
    if (response?.code === 0) {
      alert('采购内容删除成功')
      await fetchPurchaseContents()
    } else {
      alert(response?.message || '删除采购内容失败')
    }
  } catch (error) {
    console.error('删除采购内容失败:', error)
    alert('删除采购内容失败')
  }
}

// 员工成本配置操作
const editEmployeeCostConfig = (config: EmployeeCostConfig) => {
  editingEmployeeCostConfig.value = config
  employeeForm.value = { ...config }
  showEmployeeModal.value = true
}

const closeEmployeeModal = () => {
  showEmployeeModal.value = false
  editingEmployeeCostConfig.value = null
  employeeForm.value = { levelKey: '', levelName: '', dailyCost: 0 }
}

const saveEmployeeCostConfig = async () => {
  try {
    if (editingEmployeeCostConfig.value) {
      // 编辑
      const response = await $fetch(`/api/config/employee-costs/${editingEmployeeCostConfig.value.id}`, {
        method: 'PUT',
        body: employeeForm.value
      })
      if (response?.code === 0) {
        alert('员工成本配置更新成功')
        closeEmployeeModal()
        await fetchEmployeeCostConfigs()
      } else {
        alert(response?.message || '更新员工成本配置失败')
      }
    } else {
      // 新增
      const response = await $fetch('/api/config/employee-costs', {
        method: 'POST',
        body: employeeForm.value
      })
      if (response?.code === 0) {
        alert('员工成本配置创建成功')
        closeEmployeeModal()
        await fetchEmployeeCostConfigs()
      } else {
        alert(response?.message || '创建员工成本配置失败')
      }
    }
  } catch (error) {
    console.error('保存员工成本配置失败:', error)
    alert('保存员工成本配置失败')
  }
}

const deleteEmployeeCostConfig = async (id: string) => {
  if (!confirm('确定要删除这个员工成本配置吗？')) {
    return
  }

  try {
    const response = await $fetch(`/api/config/employee-costs/${id}`, {
      method: 'DELETE'
    })
    if (response?.code === 0) {
      alert('员工成本配置删除成功')
      await fetchEmployeeCostConfigs()
    } else {
      alert(response?.message || '删除员工成本配置失败')
    }
  } catch (error) {
    console.error('删除员工成本配置失败:', error)
    alert('删除员工成本配置失败')
  }
}

onMounted(async () => {
  await Promise.all([
    fetchExpenseCategories(),
    fetchPurchaseContents(),
    fetchEmployeeCostConfigs()
  ])
})
</script>

<style scoped>
.config-page {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 20px;
}

.config-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
}

.tab-button {
  padding: 10px 20px;
  border: 1px solid #d9d9d9;
  border-radius: 4px 4px 0 0;
  background-color: #f0f0f0;
  cursor: pointer;
  transition: all 0.2s;
}

.tab-button:hover {
  background-color: #e6e6e6;
}

.tab-button.active {
  background-color: white;
  border-bottom: 1px solid white;
}

.config-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.content-header h3 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

/* 模态框样式 */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #e8e8e8;
}

.modal-header h3 {
  margin: 0;
  font-size: 16px;
  color: #333;
}

.close-button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
}

.close-button:hover {
  color: #333;
}

.modal-body {
  padding: 20px;
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

.form-group input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
}

.form-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-top: 20px;
}

@media (max-width: 768px) {
  .config-tabs {
    flex-direction: column;
  }

  .content-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .modal-content {
    width: 95%;
  }
}
</style>
