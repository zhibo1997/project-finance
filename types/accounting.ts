export type RecordType = 'income' | 'expense'

export interface AccountingRecord {
  id: string
  projectId: string
  recordType: RecordType
  approvalId: string
  recordDate: string
  amount: number
  categoryId?: string
  categoryName?: string
  description?: string
  applicant?: string
  invoiceNo?: string
  payer?: string
  attachments?: string[]
  remark?: string
  createdBy: string
  createdByName?: string
  createdAt: string
  updatedAt: string
}

export interface CreateIncomeRecordDTO {
  approvalId: string
  recordDate: string
  amount: number
  invoiceNo?: string
  payer?: string
  attachments?: string[]
  remark?: string
}

export interface CreateExpenseRecordDTO {
  approvalId: string
  recordDate: string
  categoryId: string
  amount: number
  description: string
  applicant: string
  attachments?: string[]
  remark?: string
}
