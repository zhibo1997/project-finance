import type { Project, ProjectFormData, ProjectStatus } from '../types/project'
import { generateId, calculateTotalAmount } from '../utils'

// 模拟项目数据
export const MOCK_PROJECTS: Project[] = [
  {
    id: 'P001',
    projectName: '社招新人文化融入项目',
    projectLeader: '任志祥',
    clientName: '集团各组织',
    projectType: '培训项目',
    serviceStartDate: '2025-04-01',
    serviceEndDate: '2025-12-31',
    serviceAmount: 254400,
    status: 'completed',
    formData: {
      basicInfo: {
        projectName: '社招新人文化融入项目',
        projectLeader: '任志祥',
        clientName: '集团各组织',
        projectType: '培训项目',
        serviceStartDate: '2025-04-01',
        serviceEndDate: '2025-12-31',
        projectMembers: ['E001', 'E002', 'E003'],
        projectBackground: '通过组织新入司伙伴文化融入项目，帮助新入司伙伴快速理解认知新奥文化。',
        clientDemand: '集团各组织需要为新入司员工提供文化培训',
        serviceContent: '线下学习：参观体验、发展史介绍、座谈会'
      },
      serviceIncome: [
        {
          id: 'S1',
          purchaseContent: '线下学习服务',
          necessityDesc: '帮助新员工快速融入企业文化',
          amount: 254400,
          taxRate: 6
        }
      ],
      outsourcingCost: [
        {
          id: 'O1',
          content: '场地费',
          unitPrice: 1500,
          quantity: 16
        },
        {
          id: 'O2',
          content: '参观车辆费用',
          unitPrice: 2000,
          quantity: 8
        }
      ],
      laborCost: [
        {
          id: 'L1',
          employeeId: 'E001',
          employeeName: '任志祥',
          level: '高级',
          dailyCost: 5000,
          days: 5
        }
      ],
      otherExpenses: [
        {
          id: 'Misc1',
          category: '差旅费',
          amount: 5000
        }
      ]
    },
    createdBy: '2',
    createdAt: '2025-03-15T09:00:00',
    updatedAt: '2025-04-01T14:30:00'
  },
  {
    id: 'P002',
    projectName: '数字化转型咨询项目',
    projectLeader: '赵六',
    clientName: '某科技公司',
    projectType: '咨询项目',
    serviceStartDate: '2025-01-01',
    serviceEndDate: '2025-12-31',
    serviceAmount: 500000,
    status: 'submitted',
    formData: {
      basicInfo: {
        projectName: '数字化转型咨询项目',
        projectLeader: '赵六',
        clientName: '某科技公司',
        projectType: '咨询项目',
        serviceStartDate: '2025-01-01',
        serviceEndDate: '2025-12-31',
        projectMembers: ['E004', 'E005'],
        projectBackground: '帮助客户进行数字化转型，提升企业效率',
        clientDemand: '需要专业的数字化转型咨询服务',
        serviceContent: '数字化转型规划、系统升级、人员培训'
      },
      serviceIncome: [
        {
          id: 'S2',
          purchaseContent: '数字化转型咨询服务',
          necessityDesc: '帮助企业提升竞争力',
          amount: 500000,
          taxRate: 6
        }
      ],
      outsourcingCost: [],
      laborCost: [
        {
          id: 'L2',
          employeeId: 'E004',
          employeeName: '钱七',
          level: '高级',
          dailyCost: 6000,
          days: 100
        },
        {
          id: 'L3',
          employeeId: 'E005',
          employeeName: '孙八',
          level: '中级',
          dailyCost: 4000,
          days: 80
        }
      ],
      otherExpenses: []
    },
    createdBy: '2',
    createdAt: '2025-02-20T10:00:00',
    updatedAt: '2025-03-10T16:45:00'
  },
  {
    id: 'P003',
    projectName: '员工技能提升培训项目',
    projectLeader: '王五',
    clientName: '内部培训',
    projectType: '培训项目',
    serviceStartDate: '2025-05-01',
    serviceEndDate: '2025-11-30',
    serviceAmount: 150000,
    status: 'draft',
    formData: {
      basicInfo: {
        projectName: '员工技能提升培训项目',
        projectLeader: '王五',
        clientName: '内部培训',
        projectType: '培训项目',
        serviceStartDate: '2025-05-01',
        serviceEndDate: '2025-11-30',
        projectMembers: ['E006'],
        projectBackground: '提升员工技能水平，满足业务发展需求',
        clientDemand: '需要为员工提供专业技能培训',
        serviceContent: '编程技能培训、项目管理培训'
      },
      serviceIncome: [
        {
          id: 'S3',
          purchaseContent: '员工技能培训服务',
          necessityDesc: '提升员工专业能力',
          amount: 150000,
          taxRate: 6
        }
      ],
      outsourcingCost: [
        {
          id: 'O3',
          content: '培训教材费',
          unitPrice: 50,
          quantity: 200
        }
      ],
      laborCost: [
        {
          id: 'L4',
          employeeId: 'E006',
          employeeName: '周九',
          level: '中级',
          dailyCost: 3500,
          days: 40
        }
      ],
      otherExpenses: []
    },
    createdBy: '3',
    createdAt: '2025-04-10T08:30:00',
    updatedAt: '2025-04-15T11:20:00'
  }
]

// 模拟员工数据
export const MOCK_EMPLOYEES = [
  { id: 'E001', name: '任志祥', role: '项目总监', standardCost: 5000 },
  { id: 'E002', name: '赵六', role: '高级顾问', standardCost: 3500 },
  { id: 'E003', name: '王五', role: '讲师', standardCost: 1500 },
  { id: 'E004', name: '钱七', role: '高级顾问', standardCost: 6000 },
  { id: 'E005', name: '孙八', role: '顾问', standardCost: 4000 },
  { id: 'E006', name: '周九', role: '讲师', standardCost: 3500 },
  { id: 'E007', name: '吴十', role: '助教', standardCost: 1000 }
]

// 模拟费用类别
export const MOCK_EXPENSE_CATEGORIES = ['差旅费', '招待费', '物料制作费', '场地租赁费', '专家咨询费', '其他杂费']

// 模拟采购内容
export const MOCK_PURCHASE_CONTENTS = ['线下学习服务', '数字化转型咨询服务', '员工技能培训服务', '技术支持服务']

// 数据存储类
class ProjectDataStore {
  private projects: Project[]

  constructor() {
    this.projects = [...MOCK_PROJECTS]
  }

  /**
   * 获取项目列表
   */
  getProjects(): Project[] {
    return this.projects
  }

  /**
   * 获取单个项目
   */
  getProjectById(id: string): Project | undefined {
    return this.projects.find(project => project.id === id)
  }

  /**
   * 创建项目
   */
  createProject(projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Project {
    const newProject: Project = {
      ...projectData,
      id: generateId(),
      serviceAmount: calculateTotalAmount(projectData.formData),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    this.projects.push(newProject)
    return newProject
  }

  /**
   * 更新项目
   */
  updateProject(id: string, updates: Partial<Project>): Project | undefined {
    const index = this.projects.findIndex(project => project.id === id)
    if (index !== -1) {
      this.projects[index] = {
        ...this.projects[index],
        ...updates,
        updatedAt: new Date().toISOString(),
        serviceAmount: updates.formData ? calculateTotalAmount(updates.formData) : this.projects[index].serviceAmount
      }
      return this.projects[index]
    }
    return undefined
  }

  /**
   * 删除项目
   */
  deleteProject(id: string): boolean {
    const index = this.projects.findIndex(project => project.id === id)
    if (index !== -1) {
      this.projects.splice(index, 1)
      return true
    }
    return false
  }

  /**
   * 复制项目
   */
  copyProject(id: string): Project | undefined {
    const original = this.getProjectById(id)
    if (original) {
      const newProject: Project = {
        ...original,
        id: generateId(),
        projectName: `${original.projectName} copy`,
        status: 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        formData: {
          ...original.formData,
          basicInfo: {
            ...original.formData.basicInfo,
            projectName: `${original.projectName} copy`
          }
        }
      }
      this.projects.push(newProject)
      return newProject
    }
    return undefined
  }

  /**
   * 更改项目状态
   */
  changeProjectStatus(id: string, status: ProjectStatus): Project | undefined {
    const project = this.getProjectById(id)
    if (project) {
      project.status = status
      project.updatedAt = new Date().toISOString()
    }
    return project
  }

  /**
   * 搜索项目
   */
  searchProjects(keyword: string): Project[] {
    if (!keyword) {
      return this.getProjects()
    }
    const lowerKey = keyword.toLowerCase()
    return this.projects.filter(project =>
      project.projectName.toLowerCase().includes(lowerKey) ||
      project.clientName.toLowerCase().includes(lowerKey) ||
      project.projectLeader.toLowerCase().includes(lowerKey)
    )
  }

  /**
   * 按状态筛选项目
   */
  filterProjectsByStatus(status: ProjectStatus | 'all'): Project[] {
    if (status === 'all') {
      return this.getProjects()
    }
    return this.projects.filter(project => project.status === status)
  }
}

// 导出单例
export const projectDataStore = new ProjectDataStore()