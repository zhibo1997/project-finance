<template>
  <div class="max-w-6xl mx-auto space-y-8">
    <!-- 页面标题 -->
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold text-gray-800">配置管理</h1>
    </div>

    <!-- 配置导航 -->
    <div class="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
      <nav class="flex space-x-4">
        <button
          v-for="tab in configTabs"
          :key="tab.key"
          @click="activeTab = tab.key"
          :class="[
            'px-4 py-2 rounded-md text-sm font-medium transition-colors',
            activeTab === tab.key
              ? 'bg-blue-600 text-white'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          ]"
        >
          {{ tab.label }}
        </button>
      </nav>
    </div>

    <!-- 费用类别配置 -->
    <div v-if="activeTab === 'expense-categories'" class="space-y-6">
      <div class="flex justify-between items-center">
        <h2 class="text-lg font-semibold text-gray-800">费用类别管理</h2>
        <UButton
          @click="showAddCategoryModal = true"
          color="blue"
          size="sm"
        >
          新增类别
        </UButton>
      </div>

      <div class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                名称
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                排序号
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
            <tr v-for="category in expenseCategories" :key="category.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ category.name }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-500">{{ category.sort_order }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(category.created_at) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <UButton
                  @click="editCategory(category)"
                  color="green"
                  size="sm"
                  variant="text"
                >
                  编辑
                </UButton>
                <UButton
                  @click="deleteCategory(category.id)"
                  color="red"
                  size="sm"
                  variant="text"
                >
                  删除
                </UButton>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 采购内容配置 -->
    <div v-if="activeTab === 'purchase-contents'" class="space-y-6">
      <div class="flex justify-between items-center">
        <h2 class="text-lg font-semibold text-gray-800">采购内容管理</h2>
        <UButton
          @click="showAddPurchaseModal = true"
          color="blue"
          size="sm"
        >
          新增内容
        </UButton>
      </div>

      <div class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                名称
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                排序号
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
            <tr v-for="content in purchaseContents" :key="content.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ content.name }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-500">{{ content.sort_order }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(content.created_at) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <UButton
                  @click="editPurchaseContent(content)"
                  color="green"
                  size="sm"
                  variant="text"
                >
                  编辑
                </UButton>
                <UButton
                  @click="deletePurchaseContent(content.id)"
                  color="red"
                  size="sm"
                  variant="text"
                >
                  删除
                </UButton>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 员工成本配置 -->
    <div v-if="activeTab === 'employee-costs'" class="space-y-6">
      <div class="flex justify-between items-center">
        <h2 class="text-lg font-semibold text-gray-800">员工成本配置</h2>
        <UButton
          @click="showAddCostModal = true"
          color="blue"
          size="sm"
        >
          新增配置
        </UButton>
      </div>

      <div class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                级别标识
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                级别名称
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                日成本 (元)
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
            <tr v-for="config in employeeCosts" :key="config.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ config.level_key }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ config.level_name }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">¥{{ config.daily_cost }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(config.created_at) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <UButton
                  @click="editEmployeeCost(config)"
                  color="green"
                  size="sm"
                  variant="text"
                >
                  编辑
                </UButton>
                <UButton
                  @click="deleteEmployeeCost(config.id)"
                  color="red"
                  size="sm"
                  variant="text"
                >
                  删除
                </UButton>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 新增费用类别模态框 -->
    <UModal v-model="showAddCategoryModal" title="新增费用类别" :close-button="true">
      <form @submit.prevent="addCategory">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">名称 *</label>
            <UInput
              v-model="categoryForm.name"
              required
              placeholder="请输入费用类别名称"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">排序号</label>
            <UInput
              type="number"
              v-model="categoryForm.sort_order"
              placeholder="请输入排序号"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">类型</label>
            <div class="flex items-center space-x-4">
              <label class="flex items-center">
                <UCheckbox
                  v-model="categoryForm.is_income"
                  :value="true"
                  class="mr-2"
                />
                收入
              </label>
              <label class="flex items-center">
                <UCheckbox
                  v-model="categoryForm.is_income"
                  :value="false"
                  class="mr-2"
                />
                支出
              </label>
            </div>
          </div>
        </div>
        <div class="mt-6 flex justify-end space-x-3">
          <UButton
            type="button"
            @click="showAddCategoryModal = false"
            variant="outline"
            size="sm"
          >
            取消
          </UButton>
          <UButton
            type="submit"
            color="blue"
            size="sm"
          >
            新增
          </UButton>
        </div>
      </form>
    </UModal>

    <!-- 编辑费用类别模态框 -->
    <UModal v-model="showEditCategoryModal" title="编辑费用类别" :close-button="true">
      <form @submit.prevent="updateCategory">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">名称 *</label>
            <UInput
              v-model="categoryForm.name"
              required
              placeholder="请输入费用类别名称"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">排序号</label>
            <UInput
              type="number"
              v-model="categoryForm.sort_order"
              placeholder="请输入排序号"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">类型</label>
            <div class="flex items-center space-x-4">
              <label class="flex items-center">
                <UCheckbox
                  v-model="categoryForm.is_income"
                  :value="true"
                  class="mr-2"
                />
                收入
              </label>
              <label class="flex items-center">
                <UCheckbox
                  v-model="categoryForm.is_income"
                  :value="false"
                  class="mr-2"
                />
                支出
              </label>
            </div>
          </div>
        </div>
        <div class="mt-6 flex justify-end space-x-3">
          <UButton
            type="button"
            @click="showEditCategoryModal = false"
            variant="outline"
            size="sm"
          >
            取消
          </UButton>
          <UButton
            type="submit"
            color="blue"
            size="sm"
          >
            保存修改
          </UButton>
        </div>
      </form>
    </UModal>

    <!-- 新增采购内容模态框 -->
    <UModal v-model="showAddPurchaseModal" title="新增采购内容" :close-button="true">
      <form @submit.prevent="addPurchaseContent">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">名称 *</label>
            <UInput
              v-model="purchaseForm.name"
              required
              placeholder="请输入采购内容名称"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">排序号</label>
            <UInput
              type="number"
              v-model="purchaseForm.sort_order"
              placeholder="请输入排序号"
            />
          </div>
        </div>
        <div class="mt-6 flex justify-end space-x-3">
          <UButton
            type="button"
            @click="showAddPurchaseModal = false"
            variant="outline"
            size="sm"
          >
            取消
          </UButton>
          <UButton
            type="submit"
            color="blue"
            size="sm"
          >
            新增
          </UButton>
        </div>
      </form>
    </UModal>

    <!-- 编辑采购内容模态框 -->
    <UModal v-model="showEditPurchaseModal" title="编辑采购内容" :close-button="true">
      <form @submit.prevent="updatePurchaseContent">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">名称 *</label>
            <UInput
              v-model="purchaseForm.name"
              required
              placeholder="请输入采购内容名称"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">排序号</label>
            <UInput
              type="number"
              v-model="purchaseForm.sort_order"
              placeholder="请输入排序号"
            />
          </div>
        </div>
        <div class="mt-6 flex justify-end space-x-3">
          <UButton
            type="button"
            @click="showEditPurchaseModal = false"
            variant="outline"
            size="sm"
          >
            取消
          </UButton>
          <UButton
            type="submit"
            color="blue"
            size="sm"
          >
            保存修改
          </UButton>
        </div>
      </form>
    </UModal>

    <!-- 新增员工成本配置模态框 -->
    <UModal v-model="showAddCostModal" title="新增员工成本配置" :close-button="true">
      <form @submit.prevent="addEmployeeCost">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">级别标识 *</label>
            <UInput
              v-model="costForm.level_key"
              required
              placeholder="请输入级别标识"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">级别名称 *</label>
            <UInput
              v-model="costForm.level_name"
              required
              placeholder="请输入级别名称"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">日成本 (元) *</label>
            <UInput
              type="number"
              v-model="costForm.daily_cost"
              required
              step="0.01"
              placeholder="请输入日成本"
            />
          </div>
        </div>
        <div class="mt-6 flex justify-end space-x-3">
          <UButton
            type="button"
            @click="showAddCostModal = false"
            variant="outline"
            size="sm"
          >
            取消
          </UButton>
          <UButton
            type="submit"
            color="blue"
            size="sm"
          >
            新增
          </UButton>
        </div>
      </form>
    </UModal>

    <!-- 编辑员工成本配置模态框 -->
    <UModal v-model="showEditCostModal" title="编辑员工成本配置" :close-button="true">
      <form @submit.prevent="updateEmployeeCost">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">级别标识 *</label>
            <UInput
              v-model="costForm.level_key"
              required
              placeholder="请输入级别标识"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">级别名称 *</label>
            <UInput
              v-model="costForm.level_name"
              required
              placeholder="请输入级别名称"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">日成本 (元) *</label>
            <UInput
              type="number"
              v-model="costForm.daily_cost"
              required
              step="0.01"
              placeholder="请输入日成本"
            />
          </div>
        </div>
        <div class="mt-6 flex justify-end space-x-3">
          <UButton
            type="button"
            @click="showEditCostModal = false"
            variant="outline"
            size="sm"
          >
            取消
          </UButton>
          <UButton
            type="submit"
            color="blue"
            size="sm"
          >
            保存修改
          </UButton>
        </div>
      </form>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const activeTab = ref('expense-categories')
const expenseCategories = ref<any[]>([])
const purchaseContents = ref<any[]>([])
const employeeCosts = ref<any[]>([])

const configTabs = [
  { key: 'expense-categories', label: '费用类别' },
  { key: 'purchase-contents', label: '采购内容' },
  { key: 'employee-costs', label: '员工成本配置' }
]

// 模态框状态
const showAddCategoryModal = ref(false)
const showAddPurchaseModal = ref(false)
const showAddCostModal = ref(false)
const showEditCategoryModal = ref(false)
const showEditPurchaseModal = ref(false)
const showEditCostModal = ref(false)

// 表单数据
const categoryForm = ref({
  name: '',
  sort_order: 0,
  is_income: false
})

const purchaseForm = ref({
  name: '',
  sort_order: 0
})

const costForm = ref({
  level_key: '',
  level_name: '',
  daily_cost: 0
})

// 编辑时的当前数据
const currentCategory = ref<any>(null)
const currentPurchaseContent = ref<any>(null)
const currentEmployeeCost = ref<any>(null)

const formatDate = (date: string | Date) => {
  const d = new Date(date)
  return d.toLocaleDateString('zh-CN')
}

// 获取数据
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

const fetchEmployeeCosts = async () => {
  try {
    const response = await $fetch('/api/config/employee-costs')
    if (response.code === 0) {
      employeeCosts.value = response.data || []
    }
  } catch (error) {
    console.error('获取员工成本配置失败:', error)
  }
}

// 删除费用类别
const deleteCategory = async (id: string) => {
  if (!confirm('确定要删除此费用类别吗？')) return

  try {
    const response = await $fetch(`/api/dict/expense-categories/${id}`, {
      method: 'DELETE'
    })
    if (response.code === 0) {
      await fetchExpenseCategories()
    }
  } catch (error) {
    console.error('删除费用类别失败:', error)
  }
}

// 删除采购内容
const deletePurchaseContent = async (id: string) => {
  if (!confirm('确定要删除此采购内容吗？')) return

  try {
    const response = await $fetch(`/api/dict/purchase-contents/${id}`, {
      method: 'DELETE'
    })
    if (response.code === 0) {
      await fetchPurchaseContents()
    }
  } catch (error) {
    console.error('删除采购内容失败:', error)
  }
}

// 删除员工成本配置
const deleteEmployeeCost = async (id: string) => {
  if (!confirm('确定要删除此员工成本配置吗？')) return

  try {
    const response = await $fetch(`/api/config/employee-costs/${id}`, {
      method: 'DELETE'
    })
    if (response.code === 0) {
      await fetchEmployeeCosts()
    }
  } catch (error) {
    console.error('删除员工成本配置失败:', error)
  }
}

// 新增费用类别
const addCategory = async () => {
  try {
    const response = await $fetch('/api/dict/expense-categories', {
      method: 'POST',
      body: categoryForm.value
    })
    if (response.code === 0) {
      await fetchExpenseCategories()
      showAddCategoryModal.value = false
      categoryForm.value = {
        name: '',
        sort_order: 0,
        is_income: false
      }
    }
  } catch (error) {
    console.error('新增费用类别失败:', error)
  }
}

// 编辑费用类别
const editCategory = (category: any) => {
  currentCategory.value = category
  categoryForm.value = {
    name: category.name,
    sort_order: category.sort_order,
    is_income: category.is_income
  }
  showEditCategoryModal.value = true
}

// 更新费用类别
const updateCategory = async () => {
  if (!currentCategory.value) return

  try {
    const response = await $fetch(`/api/dict/expense-categories/${currentCategory.value.id}`, {
      method: 'PUT',
      body: categoryForm.value
    })
    if (response.code === 0) {
      await fetchExpenseCategories()
      showEditCategoryModal.value = false
      currentCategory.value = null
      categoryForm.value = {
        name: '',
        sort_order: 0,
        is_income: false
      }
    }
  } catch (error) {
    console.error('更新费用类别失败:', error)
  }
}

// 新增采购内容
const addPurchaseContent = async () => {
  try {
    const response = await $fetch('/api/dict/purchase-contents', {
      method: 'POST',
      body: purchaseForm.value
    })
    if (response.code === 0) {
      await fetchPurchaseContents()
      showAddPurchaseModal.value = false
      purchaseForm.value = {
        name: '',
        sort_order: 0
      }
    }
  } catch (error) {
    console.error('新增采购内容失败:', error)
  }
}

// 编辑采购内容
const editPurchaseContent = (content: any) => {
  currentPurchaseContent.value = content
  purchaseForm.value = {
    name: content.name,
    sort_order: content.sort_order
  }
  showEditPurchaseModal.value = true
}

// 更新采购内容
const updatePurchaseContent = async () => {
  if (!currentPurchaseContent.value) return

  try {
    const response = await $fetch(`/api/dict/purchase-contents/${currentPurchaseContent.value.id}`, {
      method: 'PUT',
      body: purchaseForm.value
    })
    if (response.code === 0) {
      await fetchPurchaseContents()
      showEditPurchaseModal.value = false
      currentPurchaseContent.value = null
      purchaseForm.value = {
        name: '',
        sort_order: 0
      }
    }
  } catch (error) {
    console.error('更新采购内容失败:', error)
  }
}

// 新增员工成本配置
const addEmployeeCost = async () => {
  try {
    const response = await $fetch('/api/config/employee-costs', {
      method: 'POST',
      body: costForm.value
    })
    if (response.code === 0) {
      await fetchEmployeeCosts()
      showAddCostModal.value = false
      costForm.value = {
        level_key: '',
        level_name: '',
        daily_cost: 0
      }
    }
  } catch (error) {
    console.error('新增员工成本配置失败:', error)
  }
}

// 编辑员工成本配置
const editEmployeeCost = (config: any) => {
  currentEmployeeCost.value = config
  costForm.value = {
    level_key: config.level_key,
    level_name: config.level_name,
    daily_cost: config.daily_cost
  }
  showEditCostModal.value = true
}

// 更新员工成本配置
const updateEmployeeCost = async () => {
  if (!currentEmployeeCost.value) return

  try {
    const response = await $fetch(`/api/config/employee-costs/${currentEmployeeCost.value.id}`, {
      method: 'PUT',
      body: costForm.value
    })
    if (response.code === 0) {
      await fetchEmployeeCosts()
      showEditCostModal.value = false
      currentEmployeeCost.value = null
      costForm.value = {
        level_key: '',
        level_name: '',
        daily_cost: 0
      }
    }
  } catch (error) {
    console.error('更新员工成本配置失败:', error)
  }
}

onMounted(async () => {
  await fetchExpenseCategories()
  await fetchPurchaseContents()
  await fetchEmployeeCosts()
})
</script>
