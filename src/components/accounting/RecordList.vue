<script setup lang="ts">
import { formatCurrency } from '@/utils'
import { useAuth } from '@/composables/useAuth'
import type { AccountingRecord, AccountingType } from '@/types/accounting'
import { Calendar, User, FileText, Building, Tag, Eye, Edit2, Trash2 } from 'lucide-vue-next'

const props = defineProps<{
  records: AccountingRecord[]
  loading: boolean
  type: AccountingType
}>()

const emit = defineEmits<{
  view: [record: AccountingRecord]
  edit: [record: AccountingRecord]
  delete: [id: string]
}>()

const { currentUser, currentRoleConfig } = useAuth()

// 权限检查
const canViewCreator = () => {
  return currentUser.value.role === 'admin' || currentUser.value.role === 'project_manager'
}

const canEdit = (record: AccountingRecord) => {
  if (currentUser.value.role === 'admin' || currentUser.value.role === 'project_manager') {
    return true
  }
  return record.createdBy === currentUser.value.name
}

const canDelete = () => {
  return currentUser.value.role === 'admin' || currentUser.value.role === 'project_manager'
}

// 格式化日期
const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

// 费用类别显示
const getExpenseCategoryName = (category: string | undefined) => {
  const categories: Record<string, string> = {
    'travel': '差旅费',
    'office': '办公费',
    'advertising': '广告宣传',
    'meeting': '会议费',
    'entertainment': '招待费',
    'transport': '运输费',
    'other': '其他'
  }
  return categories[category || 'other'] || '其他'
}
</script>

<template>
  <div class="space-y-4">
    <!-- 加载状态 -->
    <div v-if="loading" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>

    <!-- 空状态 -->
    <div v-else-if="records.length === 0" class="text-center py-12">
      <FileText :size="48" class="mx-auto text-gray-300 mb-4" />
      <p class="text-gray-500">暂无记账记录</p>
    </div>

    <!-- 记录列表 -->
    <div v-else class="space-y-3">
      <div
        v-for="record in records"
        :key="record.id"
        class="border border-gray-200 rounded-lg p-4 hover:border-blue-400 hover:shadow-md transition-all"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div class="flex-1">
              <div class="flex items-center gap-2">
                <span
                  class="px-2 py-1 text-xs font-medium rounded-full"
                  :class="
                    type === 'income'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-green-100 text-green-800'
                  "
                >
                  {{ type === 'income' ? '收入' : '支出' }}
                </span>
                <span class="text-sm text-gray-500">{{ record.approvalId }}</span>
              </div>

              <h3 class="mt-1 text-lg font-medium text-gray-900">{{ record.description }}</h3>

              <div class="mt-2 flex flex-wrap gap-4 text-sm text-gray-500">
                <span>
                  <Calendar :size="14" class="inline mr-1" />
                  {{ formatDate(record.date) }}
                </span>

                <span v-if="canViewCreator">
                  <User :size="14" class="inline mr-1" />
                  {{ record.createdBy }}
                </span>

                <span v-if="type === 'income' && record.invoiceNumber">
                  <FileText :size="14" class="inline mr-1" />
                  {{ record.invoiceNumber }}
                </span>

                <span v-if="type === 'income' && record.payer">
                  <Building :size="14" class="inline mr-1" />
                  {{ record.payer }}
                </span>

                <span v-if="type === 'expense' && record.expenseCategory">
                  <Tag :size="14" class="inline mr-1" />
                  {{ getExpenseCategoryName(record.expenseCategory) }}
                </span>

                <span v-if="type === 'expense' && record.applicant">
                  <User :size="14" class="inline mr-1" />
                  {{ record.applicant }}
                </span>
              </div>
            </div>

            <div class="text-right">
              <div class="text-2xl font-bold" :class="type === 'income' ? 'text-blue-600' : 'text-green-600'">
                {{ type === 'income' ? '+' : '-' }} {{ formatCurrency(record.amount) }}
              </div>

              <div class="mt-4 flex gap-2">
                <button
                  @click="$emit('view', record)"
                  class="px-3 py-1 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  查看
                </button>

                <button
                  v-if="canEdit(record)"
                  @click="$emit('edit', record)"
                  class="px-3 py-1 text-sm text-gray-600 hover:text-green-600 transition-colors"
                >
                  编辑
                </button>

                <button
                  v-if="canDelete()"
                  @click="$emit('delete', record.id)"
                  class="px-3 py-1 text-sm text-gray-600 hover:text-red-600 transition-colors"
                >
                  删除
                </button>
              </div>
            </div>
          </div>
        </div>

        <div v-if="record.remarks" class="mt-3 pt-3 border-t border-gray-100">
          <p class="text-sm text-gray-600">备注: {{ record.remarks }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 组件样式 */
</style>
