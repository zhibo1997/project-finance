// 数据库连接工具
// 由于当前项目使用 Vue 3 + Vite 架构，我们使用模拟数据代替真实数据库连接
// 实际项目中应使用 Prisma 或其他 ORM 连接 MySQL 数据库

// 模拟数据库连接
export class MockDatabase {
  private static instance: MockDatabase
  private data: Record<string, any[]> = {}

  private constructor() {
    // 初始化模拟数据
    this.data = {
      projects: [],
      project_members: [],
      accounting_records: [],
      expense_categories: [],
      purchase_contents: [],
      employee_cost_config: []
    }
  }

  public static getInstance(): MockDatabase {
    if (!MockDatabase.instance) {
      MockDatabase.instance = new MockDatabase()
    }
    return MockDatabase.instance
  }

  // 查询数据
  public findMany(table: string, options?: any): any[] {
    let data = this.data[table] || []

    if (options?.where) {
      data = data.filter(item => {
        return Object.entries(options.where).every(([key, value]) => {
          if (key === 'OR') {
            return (value as any[]).some((orCondition: any) => {
              return Object.entries(orCondition).every(([orKey, orValue]: [string, any]) => {
                if (orValue && typeof orValue === 'object' && 'contains' in orValue) {
                  return (item[orKey] as string).includes(orValue.contains as string)
                }
                return item[orKey] === orValue
              })
            })
          }
          if (value && typeof value === 'object' && 'contains' in value) {
            return (item[key] as string).includes(value.contains as string)
          }
          return item[key] === value
        })
      })
    }

    if (options?.orderBy) {
      const [key, order] = Object.entries(options.orderBy)[0]
      data.sort((a, b) => {
        if (order === 'desc') {
          return b[key] > a[key] ? 1 : -1
        }
        return a[key] > b[key] ? 1 : -1
      })
    }

    if (options?.skip !== undefined && options?.take !== undefined) {
      data = data.slice(options.skip, options.skip + options.take)
    }

    return data
  }

  // 查询单条数据
  public findUnique(table: string, options: any): any {
    const data = this.data[table] || []
    return data.find(item => {
      return Object.entries(options.where).every(([key, value]) => {
        return item[key] === value
      })
    })
  }

  // 创建数据
  public create(table: string, options: any): any {
    const newItem = {
      id: `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...options.data
    }
    this.data[table].push(newItem)
    return newItem
  }

  // 更新数据
  public update(table: string, options: any): any {
    const index = this.data[table].findIndex(item => {
      return Object.entries(options.where).every(([key, value]) => {
        return item[key] === value
      })
    })
    if (index !== -1) {
      this.data[table][index] = {
        ...this.data[table][index],
        ...options.data,
        updatedAt: new Date().toISOString()
      }
      return this.data[table][index]
    }
    return null
  }

  // 删除数据
  public delete(table: string, options: any): any {
    const index = this.data[table].findIndex(item => {
      return Object.entries(options.where).every(([key, value]) => {
        return item[key] === value
      })
    })
    if (index !== -1) {
      const deletedItem = this.data[table][index]
      this.data[table].splice(index, 1)
      return deletedItem
    }
    return null
  }

  // 计数
  public count(table: string, options?: any): number {
    return this.findMany(table, options).length
  }

  // 事务
  public async $transaction(callback: () => Promise<any>): Promise<any> {
    return callback()
  }
}

// 导出数据库实例
export const prisma = MockDatabase.getInstance()
