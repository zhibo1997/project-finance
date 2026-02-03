<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Plus, Edit2, Trash2, Save, X } from 'lucide-vue-next'
import type { ExpenseCategory, CreateExpenseCategoryDTO, UpdateExpenseCategoryDTO } from '@/types/config'
import {
  getExpenseCategories,
  createExpenseCategory,
  updateExpenseCategory,
  deleteExpenseCategory
} from '@/api/config'

const categories = ref<ExpenseCategory[]>([])
const loading = ref(false)
const editingId = ref<string | null>(null)
const editForm = ref<{ name: string; sortOrder: number }>({ name: '', sortOrder: 0 })
const createForm = ref<{ name: string; sortOrder: number }>({ name: '', sortOrder: 0 })
const showCreateForm = ref(false)
const deleteDialogVisible = ref(false)
const categoryToDelete = ref<string | null>(null)

// 获取费用类别列表
const fetchCategories = async () => {
  loading.value = true
  try {
    categories.value = await getExpenseCategories()
  } catch (error) {
    console.error('获取费用类别失败:', error)
  } finally {
    loading.value = false
  }
}

// 新增费用类别
const handleCreate = async () => {
  if (!createForm.value.name.trim()) {
    return
  }
  loading.value = true
  try {
    await createExpenseCategory(createForm.value as CreateExpenseCategoryDTO)
    createForm.value = { name: '', sortOrder: 0 }
    showCreateForm.value = false
    await fetchCategories()
  } catch (error) {
    console.error('新增费用类别失败:', error)
  } finally {
    loading.value = false
  }
}

// 开始编辑
const startEdit = (category: ExpenseCategory) => {
  editingId.value = category.id
  editForm.value = {
    name: category.name,
    sortOrder: category.sortOrder
  }
}

// 保存编辑
const handleSaveEdit = async () => {
  if (!editingId.value || !editForm.value.name.trim()) {
    return
  }
  loading.value = true
  try {
    await updateExpenseCategory(editingId.value, editForm.value as UpdateExpenseCategoryDTO)
    editingId.value = null
    await fetchCategories()
  } catch (error) {
    console.error('更新费用类别失败:', error)
  } finally {
    loading.value = false
  }
}

// 取消编辑
const cancelEdit = () => {
  editingId.value = null
  editForm.value = { name: '', sortOrder: 0 }
}

// 确认删除
const confirmDelete = (id: string) => {
  categoryToDelete.value = id
  deleteDialogVisible.value = true
}

// 删除费用类别
const handleDelete = async () => {
  if (!categoryToDelete.value) {
    return
  }
  loading.value = true
  try {
    await deleteExpenseCategory(categoryToDelete.value)
    categoryToDelete.value = null
    deleteDialogVisible.value = false
    await fetchCategories()
  } catch (error) {
    console.error('删除费用类别失败:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchCategories()
})
</script>

<template>
  <div class="space-y-6">
    <!-- 操作栏 -->
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-semibold text-gray-900">费用类别管理</h2>
      <button
        @click="showCreateForm = true"
        class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        :disabled="loading"
      >
        <Plus :size="16" />
        新增类别
      </button>
    </div>

    <!-- 新增表单 -->
    <div
      v-if="showCreateForm"
      class="bg-blue-50 border border-blue-100 rounded-lg p-4"
    >
      <div class="flex items-end gap-3">
        <div class="flex-1">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            类别名称
          </label>
          <input
            v-model="createForm.name"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="请输入类别名称"
            @keyup.enter="handleCreate"
          />
        </div>
        <div class="w-32">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            排序号
          </label>
          <input
            v-model.number="createForm.sortOrder"
            type="number"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="排序号"
          />
        </div>
        <div class="flex gap-2">
          <button
            @click="handleCreate"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            :disabled="loading"
          >
            <Save :size="16" class="inline mr-1" />
            保存
          </button>
          <button
            @click="showCreateForm = false; createForm = { name: '', sortOrder: 0 }"
            class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
            :disabled="loading"
          >
            <X :size="16" class="inline mr-1" />
            取消
          </button>
        </div>
      </div>
    </div>

    <!-- 费用类别列表 -->
    <div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                排序号
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                类别名称
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                创建时间
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                更新时间
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="category in categories" :key="category.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ category.sortOrder }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div v-if="editingId === category.id" class="flex items-center gap-2">
                  <input
                    v-model="editForm.name"
                    type="text"
                    class="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    @keyup.enter="handleSaveEdit"
                  />
                </div>
                <span v-else class="text-sm text-gray-900">{{ category.name }}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ new Date(category.createdAt!).toLocaleDateString() }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ new Date(category.updatedAt!).toLocaleDateString() }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <div v-if="editingId === category.id">
                  <button
                    @click="handleSaveEdit"
                    class="text-blue-600 hover:text-blue-900 mr-2"
                    :disabled="loading"
                  >
                    <Save :size="16" />
                  </button>
                  <button
                    @click="cancelEdit"
                    class="text-gray-600 hover:text-gray-900"
                    :disabled="loading"
                  >
                    <X :size="16" />
                  </button>
                </div>
                <div v-else>
                  <button
                    @click="startEdit(category)"
                    class="text-blue-600 hover:text-blue-900 mr-2"
                    :disabled="loading"
                  >
                    <Edit2 :size="16" />
                  </button>
                  <button
                    @click="confirmDelete(category.id)"
                    class="text-red-600 hover:text-red-900"
                    :disabled="loading"
                  >
                    <Trash2 :size="16" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="categories.length === 0" class="text-center py-12">
        <div class="text-gray-400">暂无费用类别数据</div>
      </div>
    </div>

    <!-- 删除确认对话框 -->
    <div
      v-if="deleteDialogVisible"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg p-6 max-w-sm w-full">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <Trash2 :size="20" class="text-red-600" />
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900">确认删除</h3>
            <p class="text-gray-500 text-sm mt-1">确定要删除该费用类别吗？</p>
          </div>
        </div>
        <div class="flex justify-end gap-3 mt-6">
          <button
            @click="deleteDialogVisible = false; categoryToDelete = null"
            class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
            :disabled="loading"
          >
            取消
          </button>
          <button
            @click="handleDelete"
            class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            :disabled="loading"
          >
            删除
          </button>
        </div>
      </div>
    </div>

    <!-- 加载状态 -->
    <div
      v-if="loading"
      class="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg p-4">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <div class="mt-2 text-sm text-gray-600">加载中...</div>
      </div>
    </div>
  </div>
</template>
