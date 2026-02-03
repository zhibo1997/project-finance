<script setup lang="ts">
import { ref, reactive } from 'vue'
import { X, Upload } from 'lucide-vue-next'
import type { AccountingRecord } from '@/types/accounting'
import { createAccountingRecord, updateAccountingRecord } from '@/api/accounting'
import { useAuth } from '@/composables/useAuth'

const props = defineProps<{
  mode: 'create' | 'edit'
  record?: AccountingRecord | null
}>()

const emit = defineEmits<{
  save: []
  cancel: []
}>()

const { currentUser } = useAuth()

// 费用类别选项
const expenseCategories = [
  { value: 'travel', label: '差旅费' },
  { value: 'office', label: '办公费' },
  { value: 'advertising', label: '广告宣传' },
  { value: 'meeting', label: '会议费' },
  { value: 'entertainment', label: '招待费' },
  { value: 'transport', label: '运输费' },
  { value: 'other', label: '其他' }
]

// 表单数据
const form = reactive({
  approvalId: '',
  date: new Date().toISOString().split('T')[0],
  amount: 0,
  expenseCategory: '',
  applicant: currentUser.value.name,
  description: '',
  remarks: '',
  attachments: [] as string[]
})

// 上传附件
const attachments = ref<File[]>([])

// 初始化表单数据
if (props.record) {
  Object.assign(form, props.record)
}

// 提交表单
const submitForm = async () => {
  try {
    const accountingData = {
      type: 'expense' as const,
      createdBy: currentUser.value.name,
      ...form
    }

    if (props.mode === 'create') {
      await createAccountingRecord(accountingData)
    } else if (props.record) {
      await updateAccountingRecord(props.record.id, accountingData)
    }

    emit('save')
  } catch (error) {
    console.error('保存失败:', error)
    alert('保存失败，请重试')
  }
}

// 处理文件上传
const handleFileChange = (event: Event) => {
  const files = (event.target as HTMLInputElement).files
  if (files) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      form.attachments.push(file.name)
    }
  }
}

// 移除附件
const removeAttachment = (index: number) => {
  form.attachments.splice(index, 1)
}
</script>

<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <!-- 头部 -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200">
        <div>
          <h2 class="text-xl font-bold text-gray-900">
            {{ mode === 'create' ? '新建支出记账' : '编辑支出记账' }}
          </h2>
          <p class="mt-1 text-sm text-gray-500">
            {{ mode === 'create' ? '添加新的支出记录' : '编辑支出记录信息' }}
          </p>
        </div>
        <button
          @click="$emit('cancel')"
          class="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X :size="24" />
        </button>
      </div>

      <!-- 表单内容 -->
      <div class="p-6 space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- 审批流程单ID -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              审批流程单ID <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.approvalId"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <!-- 支出日期 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              支出日期 <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.date"
              type="date"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <!-- 费用类别 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              费用类别 <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.expenseCategory"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">请选择费用类别</option>
              <option
                v-for="category in expenseCategories"
                :key="category.value"
                :value="category.value"
              >
                {{ category.label }}
              </option>
            </select>
          </div>

          <!-- 金额 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              金额 <span class="text-red-500">*</span>
            </label>
            <input
              v-model.number="form.amount"
              type="number"
              required
              min="0"
              step="0.01"
              placeholder="0.00"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <!-- 申请人 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              申请人 <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.applicant"
              type="text"
              required
              readonly
              class="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
            />
          </div>

          <!-- 描述 -->
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              用途说明
            </label>
            <textarea
              v-model="form.description"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            ></textarea>
          </div>

          <!-- 备注 -->
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              备注
            </label>
            <textarea
              v-model="form.remarks"
              rows="2"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            ></textarea>
          </div>

          <!-- 附件 -->
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              附件
            </label>
            <div class="space-y-2">
              <!-- 已上传的附件 -->
              <div
                v-for="(attachment, index) in form.attachments"
                :key="index"
                class="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
              >
                <span class="text-sm text-gray-700">{{ attachment }}</span>
                <button
                  @click="removeAttachment(index)"
                  class="text-red-500 hover:text-red-700 transition-colors"
                >
                  <X :size="16" />
                </button>
              </div>

              <!-- 上传新附件 -->
              <div
                class="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors cursor-pointer"
              >
                <label class="flex items-center gap-2 cursor-pointer">
                  <Upload :size="18" class="text-gray-400" />
                  <span class="text-sm text-gray-500">点击上传文件</span>
                  <input
                    type="file"
                    multiple
                    class="hidden"
                    @change="handleFileChange"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 底部按钮 -->
      <div class="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
        <button
          @click="$emit('cancel')"
          class="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
        >
          取消
        </button>
        <button
          @click="submitForm"
          class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          {{ mode === 'create' ? '创建' : '保存' }}
        </button>
      </div>
    </div>
  </div>
</template>
