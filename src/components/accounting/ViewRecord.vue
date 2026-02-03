<script setup lang="ts">
import { formatCurrency } from '@/utils'
import type { AccountingRecord } from '@/types/accounting'
import { X, FileText } from 'lucide-vue-next'

const props = defineProps<{
  record: AccountingRecord | null
}>()

const emit = defineEmits<{
  close: []
}>()

// 格式化日期
const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
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
  <div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <!-- 头部 -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200">
        <div>
          <h2 class="text-xl font-bold text-gray-900">记账记录详情</h2>
          <p class="mt-1 text-sm text-gray-500">
            {{ record?.createdBy }} 创建于 {{ formatDate(record?.createdAt || '') }}
          </p>
        </div>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X :size="24" />
        </button>
      </div>

      <!-- 记录详情 -->
      <div class="p-6 space-y-4">
        <!-- 基本信息 -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">类型</label>
            <p class="text-gray-900">
              <span
                class="px-2 py-1 text-xs font-medium rounded-full"
                :class="
                  record?.type === 'income'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-green-100 text-green-800'
                "
              >
                {{ record?.type === 'income' ? '收入' : '支出' }}
              </span>
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">审批流程单ID</label>
            <p class="text-gray-900">{{ record?.approvalId }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">日期</label>
            <p class="text-gray-900">{{ formatDate(record?.date || '') }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">金额</label>
            <p class="text-2xl font-bold" :class="record?.type === 'income' ? 'text-blue-600' : 'text-green-600'">
              {{ record?.type === 'income' ? '+' : '-' }} {{ formatCurrency(record?.amount || 0) }}
            </p>
          </div>

          <!-- 收入记录专用字段 -->
          <div v-if="record?.type === 'income'">
            <label class="block text-sm font-medium text-gray-700 mb-1">发票号</label>
            <p class="text-gray-900">{{ record.invoiceNumber }}</p>
          </div>

          <div v-if="record?.type === 'income'">
            <label class="block text-sm font-medium text-gray-700 mb-1">付款方</label>
            <p class="text-gray-900">{{ record.payer }}</p>
          </div>

          <!-- 支出记录专用字段 -->
          <div v-if="record?.type === 'expense'">
            <label class="block text-sm font-medium text-gray-700 mb-1">费用类别</label>
            <p class="text-gray-900">{{ getExpenseCategoryName(record.expenseCategory) }}</p>
          </div>

          <div v-if="record?.type === 'expense'">
            <label class="block text-sm font-medium text-gray-700 mb-1">申请人</label>
            <p class="text-gray-900">{{ record.applicant }}</p>
          </div>
        </div>

        <!-- 描述 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">用途说明</label>
          <p class="text-gray-900">{{ record?.description }}</p>
        </div>

        <!-- 备注 -->
        <div v-if="record?.remarks">
          <label class="block text-sm font-medium text-gray-700 mb-1">备注</label>
          <p class="text-gray-900">{{ record.remarks }}</p>
        </div>

        <!-- 附件 -->
        <div v-if="record?.attachments && record.attachments.length > 0">
          <label class="block text-sm font-medium text-gray-700 mb-1">附件</label>
          <div class="space-y-2">
            <div
              v-for="(attachment, index) in record.attachments"
              :key="index"
              class="flex items-center gap-2 p-2 bg-gray-50 rounded-lg"
            >
              <FileText :size="16" class="text-gray-400" />
              <span class="text-sm text-gray-700">{{ attachment }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 底部按钮 -->
      <div class="flex items-center justify-end p-6 border-t border-gray-200">
        <button
          @click="$emit('close')"
          class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          关闭
        </button>
      </div>
    </div>
  </div>
</template>
