export interface BudgetItem {
  id: string
  category: string
  description: string
  amount: number
  actual?: number
}

export interface Category {
  id: string
  name: string
  icon: string
  budget: number
  expenses: BudgetItem[]
}

export interface Summary {
  income: {
    amount: number
    taxRate: number
  }
  budget: {
    amount: number
  }
  recordedIncome: number
}

export interface BasicInfo {
  status: string
  projectId: string
  projectName: string
  clientName: string
  clientContact: string
  updateDate: string
  projectLead: string
  teamMembers: string[]
}

export interface ProjectData {
  basicInfo: BasicInfo
  summary: Summary
  categories: Category[]
}

export const PROJECT_DATA: ProjectData = {
  basicInfo: {
    status: '进行中',
    projectId: 'PROJ-2024-001',
    projectName: '企业数字化转型平台建设项目',
    clientName: '某大型国有企业集团',
    clientContact: '张经理',
    updateDate: '2024-05-15',
    projectLead: '李总工程师',
    teamMembers: ['张三', '李四', '王五', '赵六']
  },
  summary: {
    income: {
      amount: 5000000,
      taxRate: 0.06
    },
    budget: {
      amount: 3500000
    },
    recordedIncome: 4500000
  },
  categories: [
    {
      id: '1',
      name: '人力资源成本',
      icon: '👥',
      budget: 1500000,
      expenses: [
        { id: '1-1', category: '工资', description: '团队成员工资', amount: 800000, actual: 850000 },
        { id: '1-2', category: '福利', description: '员工福利', amount: 200000, actual: 180000 },
        { id: '1-3', category: '培训', description: '技能培训', amount: 100000, actual: 90000 },
        { id: '1-4', category: '差旅', description: '出差费用', amount: 150000, actual: 160000 }
      ]
    },
    {
      id: '2',
      name: '设备采购',
      icon: '💻',
      budget: 1000000,
      expenses: [
        { id: '2-1', category: '硬件', description: '服务器采购', amount: 600000, actual: 550000 },
        { id: '2-2', category: '软件', description: '软件许可证', amount: 250000, actual: 250000 },
        { id: '2-3', category: '配件', description: '外设配件', amount: 150000, actual: 140000 }
      ]
    },
    {
      id: '3',
      name: '服务采购',
      icon: '🚀',
      budget: 500000,
      expenses: [
        { id: '3-1', category: '云服务', description: 'AWS云服务', amount: 200000, actual: 190000 },
        { id: '3-2', category: '咨询', description: '技术咨询', amount: 150000, actual: 160000 },
        { id: '3-3', category: '运维', description: '系统运维', amount: 150000, actual: 140000 }
      ]
    },
    {
      id: '4',
      name: '运营费用',
      icon: '📊',
      budget: 500000,
      expenses: [
        { id: '4-1', category: '市场', description: '市场推广', amount: 250000, actual: 230000 },
        { id: '4-2', category: '办公', description: '办公费用', amount: 100000, actual: 95000 },
        { id: '4-3', category: '通信', description: '通信费用', amount: 50000, actual: 55000 },
        { id: '4-4', category: '其他', description: '其他费用', amount: 100000, actual: 90000 }
      ]
    }
  ]
}

export const calculateCategoryTotal = (expenses: BudgetItem[]): number => {
  return expenses.reduce((sum, item) => sum + (item.actual || 0), 0)
}

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}
