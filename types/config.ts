export interface ExpenseCategory {
  id: string
  name: string
  sortOrder: number
}

export interface PurchaseContent {
  id: string
  name: string
  sortOrder: number
}

export interface EmployeeCostConfig {
  id: string
  levelKey: string
  levelName: string
  dailyCost: number
}
