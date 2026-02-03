export type AccountingType = 'income' | 'expense'

export interface AccountingRecord {
  id: string
  type: AccountingType
  approvalId: string
  date: string
  amount: number
  description: string
  createdBy: string
  createdAt: string
  updatedAt: string

  // 收入记账专用字段
  invoiceNumber?: string
  payer?: string

  // 支出记账专用字段
  expenseCategory?: string
  applicant?: string

  // 通用附件字段
  attachments?: string[]
  remarks?: string
}

export interface CreateAccountingRecordDTO {
  type: AccountingType
  approvalId: string
  date: string
  amount: number
  description: string
  createdBy: string

  // 收入记账专用字段
  invoiceNumber?: string
  payer?: string

  // 支出记账专用字段
  expenseCategory?: string
  applicant?: string

  // 通用附件字段
  attachments?: string[]
  remarks?: string
}

export interface UpdateAccountingRecordDTO {
  approvalId?: string
  date?: string
  amount?: number
  description?: string

  // 收入记账专用字段
  invoiceNumber?: string
  payer?: string

  // 支出记账专用字段
  expenseCategory?: string
  applicant?: string

  // 通用附件字段
  attachments?: string[]
  remarks?: string
}
