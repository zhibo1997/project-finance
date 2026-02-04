import type { Project } from '~/types/project'
import type { AccountingRecord } from '~/types/accounting'
import type { EmployeeCostConfig } from '~/types/config'

// 响应数据类型
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

// 分页数据类型
export interface PaginatedResponse<T> {
  list: T[]
  total: number
  page: number
  size: number
}

// 统计数据类型
export interface StatsData {
  projectCount: number
  completedCount: number
  totalIncome: number
  totalExpense: number
}

// 统一请求函数
export const useApi = () => {
  const request = async <T>(url: string, options: RequestInit = {}) => {
    try {
      const response = await $fetch<ApiResponse<T>>(url, options)
      if (response.code === 0) {
        return response.data
      } else {
        console.error('API 请求失败:', response.message)
        throw new Error(response.message || '请求失败')
      }
    } catch (error) {
      console.error('API 请求错误:', error)
      throw error
    }
  }

  // 项目管理 API
  const projects = {
    list: (params: { page?: number; size?: number; keyword?: string; status?: string } = {}) => {
      const searchParams = new URLSearchParams()
      if (params.page) searchParams.append('page', params.page.toString())
      if (params.size) searchParams.append('size', params.size.toString())
      if (params.keyword) searchParams.append('keyword', params.keyword)
      if (params.status) searchParams.append('status', params.status)
      return request<PaginatedResponse<Project>>(`/api/projects?${searchParams.toString()}`)
    },
    get: (id: string) => request<Project>(`/api/projects/${id}`),
    create: (data: Partial<Project>) => request<Project>('/api/projects', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    update: (id: string, data: Partial<Project>) => request<Project>(`/api/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
    delete: (id: string) => request<void>(`/api/projects/${id}`, {
      method: 'DELETE'
    }),
    copy: (id: string) => request<Project>(`/api/projects/${id}/copy`, {
      method: 'POST'
    }),
    export: (id: string) => request<string>(`/api/projects/${id}/export`)
  }

  // 记账管理 API
  const records = {
    list: (params: { page?: number; size?: number; keyword?: string; projectId?: string; recordType?: string } = {}) => {
      const searchParams = new URLSearchParams()
      if (params.page) searchParams.append('page', params.page.toString())
      if (params.size) searchParams.append('size', params.size.toString())
      if (params.keyword) searchParams.append('keyword', params.keyword)
      if (params.projectId) searchParams.append('projectId', params.projectId)
      if (params.recordType) searchParams.append('recordType', params.recordType)
      return request<PaginatedResponse<AccountingRecord>>(`/api/records?${searchParams.toString()}`)
    },
    get: (id: string) => request<AccountingRecord>(`/api/records/${id}`),
    create: (data: Partial<AccountingRecord>) => request<AccountingRecord>('/api/records', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    update: (id: string, data: Partial<AccountingRecord>) => request<AccountingRecord>(`/api/records/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
    delete: (id: string) => request<void>(`/api/records/${id}`, {
      method: 'DELETE'
    })
  }

  // 统计数据 API
  const stats = {
    get: () => request<StatsData>('/api/stats')
  }

  // 配置管理 API
  const config = {
    employeeCosts: {
      list: () => request<EmployeeCostConfig[]>('/api/config/employee-costs'),
      get: (id: string) => request<EmployeeCostConfig>(`/api/config/employee-costs/${id}`),
      create: (data: Partial<EmployeeCostConfig>) => request<EmployeeCostConfig>('/api/config/employee-costs', {
        method: 'POST',
        body: JSON.stringify(data)
      }),
      update: (id: string, data: Partial<EmployeeCostConfig>) => request<EmployeeCostConfig>(`/api/config/employee-costs/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      }),
      delete: (id: string) => request<void>(`/api/config/employee-costs/${id}`, {
        method: 'DELETE'
      })
    }
  }

  // 字典数据 API
  const dict = {
    expenseCategories: {
      list: () => request<any[]>('/api/dict/expense-categories'),
      get: (id: string) => request<any>(`/api/dict/expense-categories/${id}`),
      create: (data: any) => request<any>('/api/dict/expense-categories', {
        method: 'POST',
        body: JSON.stringify(data)
      }),
      update: (id: string, data: any) => request<any>(`/api/dict/expense-categories/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      }),
      delete: (id: string) => request<void>(`/api/dict/expense-categories/${id}`, {
        method: 'DELETE'
      })
    },
    purchaseContents: {
      list: () => request<any[]>('/api/dict/purchase-contents'),
      get: (id: string) => request<any>(`/api/dict/purchase-contents/${id}`),
      create: (data: any) => request<any>('/api/dict/purchase-contents', {
        method: 'POST',
        body: JSON.stringify(data)
      }),
      update: (id: string, data: any) => request<any>(`/api/dict/purchase-contents/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      }),
      delete: (id: string) => request<void>(`/api/dict/purchase-contents/${id}`, {
        method: 'DELETE'
      })
    }
  }

  // 文件上传 API
  const upload = {
    file: (formData: FormData) => request<any>('/api/upload', {
      method: 'POST',
      body: formData
    }),
    delete: (filename: string) => request<void>(`/api/upload/${filename}`, {
      method: 'DELETE'
    })
  }

  return {
    projects,
    records,
    stats,
    config,
    dict,
    upload
  }
}
