import { ref, computed } from 'vue'
import type { AccountingRecord, AccountingType } from '@/types/accounting'
import { getAccountingRecords, createAccountingRecord, updateAccountingRecord, deleteAccountingRecord } from '@/api/accounting'
import { useAuth } from '@/composables/useAuth'

export function useAccounting() {
  const { currentUser } = useAuth()
  const records = ref<AccountingRecord[]>([])
  const isLoading = ref(false)

  // 加载记录
  const loadRecords = async (type?: AccountingType) => {
    isLoading.value = true
    try {
      records.value = await getAccountingRecords(type)
    } catch (error) {
      console.error('加载记账记录失败:', error)
      records.value = []
    } finally {
      isLoading.value = false
    }
  }

  // 创建记录
  const createRecord = async (data: any) => {
    const accountingData = {
      ...data,
      createdBy: currentUser.value.name
    }
    const newRecord = await createAccountingRecord(accountingData)
    records.value.unshift(newRecord)
    return newRecord
  }

  // 更新记录
  const updateRecord = async (id: string, data: any) => {
    const updatedRecord = await updateAccountingRecord(id, data)
    const index = records.value.findIndex(record => record.id === id)
    if (index !== -1) {
      records.value[index] = updatedRecord
    }
    return updatedRecord
  }

  // 删除记录
  const removeRecord = async (id: string) => {
    await deleteAccountingRecord(id)
    records.value = records.value.filter(record => record.id !== id)
  }

  // 计算属性
  const incomeRecords = computed(() => {
    return records.value.filter(record => record.type === 'income')
  })

  const expenseRecords = computed(() => {
    return records.value.filter(record => record.type === 'expense')
  })

  const totalIncome = computed(() => {
    return incomeRecords.value.reduce((sum, record) => sum + record.amount, 0)
  })

  const totalExpense = computed(() => {
    return expenseRecords.value.reduce((sum, record) => sum + record.amount, 0)
  })

  const netAmount = computed(() => {
    return totalIncome.value - totalExpense.value
  })

  // 权限检查
  const canViewCreator = () => {
    return currentUser.value.role === 'admin' || currentUser.value.role === 'project_manager'
  }

  const canEditRecord = (record: AccountingRecord) => {
    if (currentUser.value.role === 'admin' || currentUser.value.role === 'project_manager') {
      return true
    }
    return record.createdBy === currentUser.value.name
  }

  const canDeleteRecord = () => {
    return currentUser.value.role === 'admin' || currentUser.value.role === 'project_manager'
  }

  return {
    records,
    isLoading,
    loadRecords,
    createRecord,
    updateRecord,
    removeRecord,
    incomeRecords,
    expenseRecords,
    totalIncome,
    totalExpense,
    netAmount,
    canViewCreator,
    canEditRecord,
    canDeleteRecord
  }
}
