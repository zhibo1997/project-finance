<template>
  <div class="max-w-6xl mx-auto space-y-8">
    <!-- 页面标题 -->
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold text-gray-800">配置管理</h1>
    </div>

    <!-- 配置导航 -->
    <div class="bg-white rounded-lg shadow-sm p-4">
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
        <button
          @click="showAddCategoryModal = true"
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          新增类别
        </button>
      </div>

      <div class="bg-white rounded-lg shadow-sm overflow-hidden">
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
            <tr v-for="category in expenseCategories" :key="category.id">
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
                <button
                  @click="editCategory(category)"
                  class="text-green-600 hover:text-green-900"
                >
                  编辑
                </button>
                <button
                  @click="deleteCategory(category.id)"
                  class="text-red-600 hover:text-red-900"
                >
                  删除
                </button>
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
        <button
          @click="showAddPurchaseModal = true"
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          新增内容
        </button>
      </div>

      <div class="bg-white rounded-lg shadow-sm overflow-hidden">
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
            <tr v-for="content in purchaseContents" :key="content.id">
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
                <button
                  @click="editPurchaseContent(content)"
                  class="text-green-600 hover:text-green-900"
                >
                  编辑
                </button>
                <button
                  @click="deletePurchaseContent(content.id)"
                  class="text-red-600 hover:text-red-900"
                >
                  删除
                </button>
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
        <button
          @click="showAddCostModal = true"
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          新增配置
        </button>
      </div>

      <div class="bg-white rounded-lg shadow-sm overflow-hidden">
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
            <tr v-for="config in employeeCosts" :key="config.id">
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
                <button
                  @click="editEmployeeCost(config)"
                  class="text-green-600 hover:text-green-900"
                >
                  编辑
                </button>
                <button
                  @click="deleteEmployeeCost(config.id)"
                  class="text-red-600 hover:text-red-900"
                >
                  删除
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <!-- 新增费用类别模态框 -->
    <div v-if="showAddCategoryModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div class="flex justify-between items-center p-6 border-b">
          <h2 class="text-xl font-semibold text-gray-800">新增费用类别</h2>
          <button
            @click="showAddCategoryModal = false"
            class="text-gray-400 hover:text-gray-600"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="p-6">
          <form @submit.prevent="addCategory">
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">名称 *</label>
              <input
                v-model="categoryForm.name"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">排序号</label>
              <input
                type="number"
                v-model="categoryForm.sort_order"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">类型</label>
              <div class="flex items-center space-x-4">
                <label class="flex items-center">
                  <input
                    type="radio"
                    v-model="categoryForm.is_income"
                    :value="true"
                    class="mr-2"
                  />
                  收入
                </label>
                <label class="flex items-center">
                  <input
                    type="radio"
                    v-model="categoryForm.is_income"
                    :value="false"
                    class="mr-2"
                  />
                  支出
                </label>
              </div>
            </div>
            <div class="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                @click="showAddCategoryModal = false"
                class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                type="submit"
                class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                新增
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- 编辑费用类别模态框 -->
    <div v-if="showEditCategoryModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div class="flex justify-between items-center p-6 border-b">
          <h2 class="text-xl font-semibold text-gray-800">编辑费用类别</h2>
          <button
            @click="showEditCategoryModal = false"
            class="text-gray-400 hover:text-gray-600"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="p-6">
          <form @submit.prevent="updateCategory">
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">名称 *</label>
              <input
                v-model="categoryForm.name"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">排序号</label>
              <input
                type="number"
                v-model="categoryForm.sort_order"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">类型</label>
              <div class="flex items-center space-x-4">
                <label class="flex items-center">
                  <input
                    type="radio"
                    v-model="categoryForm.is_income"
                    :value="true"
                    class="mr-2"
                  />
                  收入
                </label>
                <label class="flex items-center">
                  <input
                    type="radio"
                    v-model="categoryForm.is_income"
                    :value="false"
                    class="mr-2"
                  />
                  支出
                </label>
              </div>
            </div>
            <div class="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                @click="showEditCategoryModal = false"
                class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                type="submit"
                class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                保存修改
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- 新增采购内容模态框 -->
    <div v-if="showAddPurchaseModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div class="flex justify-between items-center p-6 border-b">
          <h2 class="text-xl font-semibold text-gray-800">新增采购内容</h2>
          <button
            @click="showAddPurchaseModal = false"
            class="text-gray-400 hover:text-gray-600"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="p-6">
          <form @submit.prevent="addPurchaseContent">
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">名称 *</label>
              <input
                v-model="purchaseForm.name"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">排序号</label>
              <input
                type="number"
                v-model="purchaseForm.sort_order"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div class="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                @click="showAddPurchaseModal = false"
                class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                type="submit"
                class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                新增
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- 编辑采购内容模态框 -->
    <div v-if="showEditPurchaseModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div class="flex justify-between items-center p-6 border-b">
          <h2 class="text-xl font-semibold text-gray-800">编辑采购内容</h2>
          <button
            @click="showEditPurchaseModal = false"
            class="text-gray-400 hover:text-gray-600"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="p-6">
          <form @submit.prevent="updatePurchaseContent">
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">名称 *</label>
              <input
                v-model="purchaseForm.name"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">排序号</label>
              <input
                type="number"
                v-model="purchaseForm.sort_order"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div class="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                @click="showEditPurchaseModal = false"
                class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                type="submit"
                class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                保存修改
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- 新增员工成本配置模态框 -->
    <div v-if="showAddCostModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div class="flex justify-between items-center p-6 border-b">
          <h2 class="text-xl font-semibold text-gray-800">新增员工成本配置</h2>
          <button
            @click="showAddCostModal = false"
            class="text-gray-400 hover:text-gray-600"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="p-6">
          <form @submit.prevent="addEmployeeCost">
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">级别标识 *</label>
              <input
                v-model="costForm.level_key"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">级别名称 *</label>
              <input
                v-model="costForm.level_name"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">日成本 (元) *</label>
              <input
                type="number"
                v-model="costForm.daily_cost"
                required
                step="0.01"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div class="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                @click="showAddCostModal = false"
                class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                type="submit"
                class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                新增
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- 编辑员工成本配置模态框 -->
    <div v-if="showEditCostModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div class="flex justify-between items-center p-6 border-b">
          <h2 class="text-xl font-semibold text-gray-800">编辑员工成本配置</h2>
          <button
            @click="showEditCostModal = false"
            class="text-gray-400 hover:text-gray-600"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="p-6">
          <form @submit.prevent="updateEmployeeCost">
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">级别标识 *</label>
              <input
                v-model="costForm.level_key"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">级别名称 *</label>
              <input
                v-model="costForm.level_name"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">日成本 (元) *</label>
              <input
                type="number"
                v-model="costForm.daily_cost"
                required
                step="0.01"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div class="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                @click="showEditCostModal = false"
                class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                type="submit"
                class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                保存修改
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
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
