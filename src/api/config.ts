import type {
  ExpenseCategory,
  PurchaseContent,
  EmployeeCostConfig,
  CreateExpenseCategoryDTO,
  UpdateExpenseCategoryDTO,
  CreatePurchaseContentDTO,
  UpdatePurchaseContentDTO,
  CreateEmployeeCostConfigDTO,
  UpdateEmployeeCostConfigDTO
} from '@/types/config'

// 模拟费用类别数据
const mockExpenseCategories: ExpenseCategory[] = [
  { id: '1', name: '差旅费', sortOrder: 1, createdAt: '2026-01-01', updatedAt: '2026-01-01' },
  { id: '2', name: '办公费', sortOrder: 2, createdAt: '2026-01-01', updatedAt: '2026-01-01' },
  { id: '3', name: '广告宣传', sortOrder: 3, createdAt: '2026-01-01', updatedAt: '2026-01-01' },
  { id: '4', name: '会议费', sortOrder: 4, createdAt: '2026-01-01', updatedAt: '2026-01-01' },
  { id: '5', name: '招待费', sortOrder: 5, createdAt: '2026-01-01', updatedAt: '2026-01-01' },
  { id: '6', name: '运输费', sortOrder: 6, createdAt: '2026-01-01', updatedAt: '2026-01-01' },
  { id: '7', name: '公司经费', sortOrder: 7, createdAt: '2026-01-01', updatedAt: '2026-01-01' },
  { id: '8', name: '其他', sortOrder: 8, createdAt: '2026-01-01', updatedAt: '2026-01-01' }
]

// 模拟采购内容数据
const mockPurchaseContents: PurchaseContent[] = [
  { id: '1', name: '软件定制开发', sortOrder: 1, createdAt: '2026-01-01', updatedAt: '2026-01-01' },
  { id: '2', name: '系统集成服务', sortOrder: 2, createdAt: '2026-01-01', updatedAt: '2026-01-01' },
  { id: '3', name: '技术咨询服务', sortOrder: 3, createdAt: '2026-01-01', updatedAt: '2026-01-01' },
  { id: '4', name: '硬件设备采购', sortOrder: 4, createdAt: '2026-01-01', updatedAt: '2026-01-01' },
  { id: '5', name: '云服务订阅', sortOrder: 5, createdAt: '2026-01-01', updatedAt: '2026-01-01' }
]

// 模拟员工成本配置数据
const mockEmployeeCostConfigs: EmployeeCostConfig[] = [
  { id: '1', levelKey: 'junior', levelName: '初级工程师', dailyCost: 500, createdAt: '2026-01-01', updatedAt: '2026-01-01' },
  { id: '2', levelKey: 'middle', levelName: '中级工程师', dailyCost: 800, createdAt: '2026-01-01', updatedAt: '2026-01-01' },
  { id: '3', levelKey: 'senior', levelName: '高级工程师', dailyCost: 1200, createdAt: '2026-01-01', updatedAt: '2026-01-01' },
  { id: '4', levelKey: 'architect', levelName: '架构师', dailyCost: 1800, createdAt: '2026-01-01', updatedAt: '2026-01-01' }
]

// 模拟延迟
const delay = (ms: number = 500) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// 生成唯一ID
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// 费用类别API
export const getExpenseCategories = async (): Promise<ExpenseCategory[]> => {
  await delay()
  return [...mockExpenseCategories].sort((a, b) => a.sortOrder - b.sortOrder)
}

export const createExpenseCategory = async (data: CreateExpenseCategoryDTO): Promise<ExpenseCategory> => {
  await delay()
  const newCategory: ExpenseCategory = {
    id: generateId(),
    name: data.name,
    sortOrder: data.sortOrder ?? mockExpenseCategories.length + 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  mockExpenseCategories.push(newCategory)
  return newCategory
}

export const updateExpenseCategory = async (id: string, data: UpdateExpenseCategoryDTO): Promise<ExpenseCategory> => {
  await delay()
  const index = mockExpenseCategories.findIndex(c => c.id === id)
  if (index === -1) {
    throw new Error('费用类别不存在')
  }
  mockExpenseCategories[index] = {
    ...mockExpenseCategories[index],
    ...data,
    updatedAt: new Date().toISOString()
  }
  return mockExpenseCategories[index]
}

export const deleteExpenseCategory = async (id: string): Promise<void> => {
  await delay()
  const index = mockExpenseCategories.findIndex(c => c.id === id)
  if (index === -1) {
    throw new Error('费用类别不存在')
  }
  mockExpenseCategories.splice(index, 1)
}

// 采购内容API
export const getPurchaseContents = async (): Promise<PurchaseContent[]> => {
  await delay()
  return [...mockPurchaseContents].sort((a, b) => a.sortOrder - b.sortOrder)
}

export const createPurchaseContent = async (data: CreatePurchaseContentDTO): Promise<PurchaseContent> => {
  await delay()
  const newContent: PurchaseContent = {
    id: generateId(),
    name: data.name,
    sortOrder: data.sortOrder ?? mockPurchaseContents.length + 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  mockPurchaseContents.push(newContent)
  return newContent
}

export const updatePurchaseContent = async (id: string, data: UpdatePurchaseContentDTO): Promise<PurchaseContent> => {
  await delay()
  const index = mockPurchaseContents.findIndex(c => c.id === id)
  if (index === -1) {
    throw new Error('采购内容不存在')
  }
  mockPurchaseContents[index] = {
    ...mockPurchaseContents[index],
    ...data,
    updatedAt: new Date().toISOString()
  }
  return mockPurchaseContents[index]
}

export const deletePurchaseContent = async (id: string): Promise<void> => {
  await delay()
  const index = mockPurchaseContents.findIndex(c => c.id === id)
  if (index === -1) {
    throw new Error('采购内容不存在')
  }
  mockPurchaseContents.splice(index, 1)
}

// 员工成本配置API
export const getEmployeeCostConfigs = async (): Promise<EmployeeCostConfig[]> => {
  await delay()
  return [...mockEmployeeCostConfigs].sort((a, b) => a.levelKey.localeCompare(b.levelKey))
}

export const createEmployeeCostConfig = async (data: CreateEmployeeCostConfigDTO): Promise<EmployeeCostConfig> => {
  await delay()
  const newConfig: EmployeeCostConfig = {
    id: generateId(),
    levelKey: data.levelKey,
    levelName: data.levelName,
    dailyCost: data.dailyCost,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  mockEmployeeCostConfigs.push(newConfig)
  return newConfig
}

export const updateEmployeeCostConfig = async (id: string, data: UpdateEmployeeCostConfigDTO): Promise<EmployeeCostConfig> => {
  await delay()
  const index = mockEmployeeCostConfigs.findIndex(c => c.id === id)
  if (index === -1) {
    throw new Error('员工成本配置不存在')
  }
  mockEmployeeCostConfigs[index] = {
    ...mockEmployeeCostConfigs[index],
    ...data,
    updatedAt: new Date().toISOString()
  }
  return mockEmployeeCostConfigs[index]
}

export const deleteEmployeeCostConfig = async (id: string): Promise<void> => {
  await delay()
  const index = mockEmployeeCostConfigs.findIndex(c => c.id === id)
  if (index === -1) {
    throw new Error('员工成本配置不存在')
  }
  mockEmployeeCostConfigs.splice(index, 1)
}
