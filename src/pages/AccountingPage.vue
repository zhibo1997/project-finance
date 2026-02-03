<script setup lang="ts">
import { ref, computed } from 'vue'
import { Plus, Filter, Search, Edit2, Trash2, Eye, FileText, CreditCard, DollarSign } from 'lucide-vue-next'
import type { AccountingRecord, AccountingType } from '@/types/accounting'
import { getAccountingRecords } from '@/api/accounting'
import { useAuth } from '@/composables/useAuth'
import IncomeForm from '@/components/accounting/IncomeForm.vue'
import ExpenseForm from '@/components/accounting/ExpenseForm.vue'
import RecordList from '@/components/accounting/RecordList.vue'
import ViewRecord from '@/components/accounting/ViewRecord.vue'

const { currentUser, canBookkeepingIncome, canBookkeepingExpense, currentRoleConfig } = useAuth()

// 状态管理
const activeTab = ref<AccountingType>('income')
const searchKeyword = ref('')
const isModalOpen = ref(false)
const modalMode = ref<'create' | 'edit' | 'view'>('create')
const selectedRecord = ref<AccountingRecord | null>(null)
const records = ref<AccountingRecord[]>([])
const isLoading = ref(false)

// 加载数据
const loadData = async () => {
  isLoading.value = true
  try {
    records.value = await getAccountingRecords(activeTab.value)
  } catch (error) {
    console.error('加载数据失败:', error)
  } finally {
    isLoading.value = false
  }
}

// 过滤后的记录
const filteredRecords = computed(() => {
  if (!searchKeyword.value) return records.value

  return records.value.filter(record =>
    record.approvalId.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
    record.description.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
    (record.invoiceNumber && record.invoiceNumber.toLowerCase().includes(searchKeyword.value.toLowerCase())) ||
    (record.payer && record.payer.toLowerCase().includes(searchKeyword.value.toLowerCase()))
  )
})

// 打开创建/编辑模态框
const openModal = (mode: 'create' | 'edit' | 'view', record?: AccountingRecord) => {
  modalMode.value = mode
  selectedRecord.value = record || null
  isModalOpen.value = true
}

// 关闭模态框
const closeModal = () => {
  isModalOpen.value = false
  selectedRecord.value = null
}

// 保存成功后的处理
const handleSaveSuccess = () => {
  closeModal()
  loadData()
}

// 删除记录
const handleDelete = (id: string) => {
  if (confirm('确定要删除这条记账记录吗？')) {
    // 这里应该调用删除API
    records.value = records.value.filter(record => record.id !== id)
  }
}

// 页面加载时获取数据
loadData()
</script>

<template>
  <div class="min-h-screen bg-[#F5F5F7] text-[#1D1D1F] font-sans pb-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      <!-- 页面标题 -->
      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <FileText :size="24" class="text-blue-600" />
            <div>
              <h1 class="text-2xl font-bold text-gray-900">记账管理</h1>
              <p class="mt-2 text-gray-500">管理项目的收入和支出记账记录</p>
            </div>
          </div>
          <div class="flex gap-3">
            <button
              v-if="canBookkeepingIncome"
              @click="openModal('create')"
              class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus :size="18" />
              <span>收入记账</span>
            </button>
            <button
              v-if="canBookkeepingExpense"
              @click="openModal('create')"
              class="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus :size="18" />
              <span>支出记账</span>
            </button>
          </div>
        </div>
      </div>

      <!-- 标签页导航 -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100">
        <div class="border-b border-gray-100 px-6">
          <nav class="flex space-x-8" aria-label="Tabs">
            <button
              v-if="canBookkeepingIncome"
              @click="activeTab = 'income'; loadData()"
              class="py-4 px-1 border-b-2 font-medium text-sm transition-colors"
              :class="
                activeTab === 'income'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              "
            >
              <div class="flex items-center gap-2">
                <CreditCard :size="16" />
                收入记账
              </div>
            </button>
            <button
              v-if="canBookkeepingExpense"
              @click="activeTab = 'expense'; loadData()"
              class="py-4 px-1 border-b-2 font-medium text-sm transition-colors"
              :class="
                activeTab === 'expense'
                  ? 'border-green-600 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              "
            >
              <div class="flex items-center gap-2">
                <DollarSign :size="16" />
                支出记账
              </div>
            </button>
          </nav>
        </div>

        <!-- 搜索和筛选 -->
        <div class="p-6 border-b border-gray-100">
          <div class="flex flex-col sm:flex-row gap-4">
            <div class="flex-1 relative">
              <Search :size="18" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                v-model="searchKeyword"
                type="text"
                placeholder="搜索审批单号、描述、发票号或付款方..."
                class="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <!-- 数据列表 -->
        <div class="p-6">
          <RecordList
            :records="filteredRecords"
            :loading="isLoading"
            :type="activeTab"
            @view="openModal('view', $event)"
            @edit="openModal('edit', $event)"
            @delete="handleDelete"
          />
        </div>
      </div>
    </div>

    <!-- 记账表单模态框 -->
    <IncomeForm
      v-if="isModalOpen && activeTab === 'income' && (modalMode === 'create' || modalMode === 'edit')"
      :mode="modalMode"
      :record="selectedRecord"
      @save="handleSaveSuccess"
      @cancel="closeModal"
    />

    <ExpenseForm
      v-if="isModalOpen && activeTab === 'expense' && (modalMode === 'create' || modalMode === 'edit')"
      :mode="modalMode"
      :record="selectedRecord"
      @save="handleSaveSuccess"
      @cancel="closeModal"
    />

    <!-- 查看详情模态框 -->
    <ViewRecord
      v-if="isModalOpen && modalMode === 'view'"
      :record="selectedRecord"
      @close="closeModal"
    />
  </div>
</template>
