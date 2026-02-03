export type ProjectStatus = 'draft' | 'submitted' | 'completed' | 'closed'

export interface Project {
  id: string
  projectName: string
  projectLeader: string
  clientName: string
  projectType: string
  serviceStartDate: string
  serviceEndDate: string
  serviceAmount: number
  status: ProjectStatus
  formData: ProjectFormData
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface ProjectFormData {
  basicInfo: {
    projectName: string
    projectLeader: string
    clientName: string
    projectType: string
    serviceStartDate: string
    serviceEndDate: string
    projectMembers: string[]
    projectBackground: string
    clientDemand: string
    serviceContent: string
  }
  serviceIncome: ServiceIncomeItem[]
  outsourcingCost: OutsourcingCostItem[]
  laborCost: LaborCostItem[]
  otherExpenses: OtherExpenseItem[]
}

export interface ServiceIncomeItem {
  id: string
  purchaseContent: string
  necessityDesc: string
  amount: number
  taxRate: number
}

export interface OutsourcingCostItem {
  id: string
  content: string
  unitPrice: number
  quantity: number
}

export interface LaborCostItem {
  id: string
  employeeId: string
  employeeName: string
  level: string
  dailyCost: number
  days: number
}

export interface OtherExpenseItem {
  id: string
  category: string
  amount: number
}

export interface CreateProjectDTO {
  formData: ProjectFormData
  createdBy: string
}

export interface UpdateProjectDTO {
  formData: ProjectFormData
}

export interface ChangeStatusDTO {
  status: ProjectStatus
}