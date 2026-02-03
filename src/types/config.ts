export interface ExpenseCategory {
  id: string
  name: string
  sortOrder: number
  createdAt?: string
  updatedAt?: string
}

export interface PurchaseContent {
  id: string
  name: string
  sortOrder: number
  createdAt?: string
  updatedAt?: string
}

export interface EmployeeCostConfig {
  id: string
  levelKey: string
  levelName: string
  dailyCost: number
  createdAt?: string
  updatedAt?: string
}

export interface CreateExpenseCategoryDTO {
  name: string
  sortOrder?: number
}

export interface UpdateExpenseCategoryDTO {
  name?: string
  sortOrder?: number
}

export interface CreatePurchaseContentDTO {
  name: string
  sortOrder?: number
}

export interface UpdatePurchaseContentDTO {
  name?: string
  sortOrder?: number
}

export interface CreateEmployeeCostConfigDTO {
  levelKey: string
  levelName: string
  dailyCost: number
}

export interface UpdateEmployeeCostConfigDTO {
  levelKey?: string
  levelName?: string
  dailyCost?: number
}
