import type { AccountingRecord, CreateAccountingRecordDTO, UpdateAccountingRecordDTO } from '@/types/accounting'

// 模拟记账记录数据
const mockAccountingRecords: AccountingRecord[] = [
  {
    id: 'AR001',
    type: 'income',
    approvalId: 'AP001',
    date: '2025-01-15',
    amount: 150000,
    description: '项目预付款',
    createdBy: '张管理员',
    invoiceNumber: 'INV20250115001',
    payer: '某科技公司',
    attachments: ['invoice_20250115.pdf'],
    remarks: '项目启动预付款',
    createdAt: '2025-01-15T09:00:00',
    updatedAt: '2025-01-15T09:00:00'
  },
  {
    id: 'AR002',
    type: 'expense',
    approvalId: 'AP002',
    date: '2025-01-20',
    amount: 5000,
    description: '项目差旅费',
    createdBy: '王成员',
    expenseCategory: '差旅费',
    applicant: '王成员',
    attachments: ['travel_expense_20250120.jpg'],
    remarks: '客户现场调研差旅费',
    createdAt: '2025-01-20T14:30:00',
    updatedAt: '2025-01-20T14:30:00'
  }
]

// 模拟延迟
const delay = (ms: number = 500) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// 生成唯一ID
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// 获取记账记录列表
export const getAccountingRecords = async (type?: 'income' | 'expense'): Promise<AccountingRecord[]> => {
  await delay()
  let records = [...mockAccountingRecords]

  if (type) {
    records = records.filter(record => record.type === type)
  }

  return records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

// 获取单个记账记录
export const getAccountingRecordById = async (id: string): Promise<AccountingRecord | undefined> => {
  await delay()
  return mockAccountingRecords.find(record => record.id === id)
}

// 创建记账记录
export const createAccountingRecord = async (data: CreateAccountingRecordDTO): Promise<AccountingRecord> => {
  await delay()
  const newRecord: AccountingRecord = {
    id: generateId(),
    type: data.type,
    approvalId: data.approvalId,
    date: data.date,
    amount: data.amount,
    description: data.description,
    createdBy: data.createdBy,
    invoiceNumber: data.invoiceNumber,
    payer: data.payer,
    expenseCategory: data.expenseCategory,
    applicant: data.applicant,
    attachments: data.attachments,
    remarks: data.remarks,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  mockAccountingRecords.push(newRecord)
  return newRecord
}

// 更新记账记录
export const updateAccountingRecord = async (id: string, data: UpdateAccountingRecordDTO): Promise<AccountingRecord> => {
  await delay()
  const index = mockAccountingRecords.findIndex(record => record.id === id)
  if (index === -1) {
    throw new Error('记账记录不存在')
  }
  mockAccountingRecords[index] = {
    ...mockAccountingRecords[index],
    ...data,
    updatedAt: new Date().toISOString()
  }
  return mockAccountingRecords[index]
}

// 删除记账记录
export const deleteAccountingRecord = async (id: string): Promise<void> => {
  await delay()
  const index = mockAccountingRecords.findIndex(record => record.id === id)
  if (index === -1) {
    throw new Error('记账记录不存在')
  }
  mockAccountingRecords.splice(index, 1)
}
