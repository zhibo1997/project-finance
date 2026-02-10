import prisma from '../../utils/prisma'
import { successResponse, errorResponse } from '../../utils/response'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const keyword = query.keyword || ''
    const status = query.status || ''
    const page = parseInt(query.page as string) || 1
    const size = parseInt(query.size as string) || 20

    const where: any = {}

    if (keyword) {
      where.OR = [
        { project_name: { contains: keyword } },
        { client_name: { contains: keyword } },
        { project_leader: { contains: keyword } }
      ]
    }

    if (status) {
      where.status = status
    }

    const [projects, total] = await Promise.all([
      prisma.projects.findMany({
        where,
        include: {
          project_members: true,
          accounting_records: true
        },
        orderBy: {
          created_at: 'desc'
        },
        skip: (page - 1) * size,
        take: size
      }),
      prisma.projects.count({ where })
    ])

    // 计算财务汇总信息
    const processedProjects = projects.map(project => {
      const incomeRecords = project.accounting_records.filter(record => record.record_type === 'INCOME')
      const expenseRecords = project.accounting_records.filter(record => record.record_type === 'EXPENSE')

      const incomeAmount = incomeRecords.reduce((sum, record) => sum + Number(record.amount), 0)
      const expenseAmount = expenseRecords.reduce((sum, record) => sum + Number(record.amount), 0)

      return {
        ...project,
        incomeAmount,
        expenseAmount,
        profitAmount: incomeAmount - expenseAmount
      }
    })

    return successResponse({
      list: processedProjects,
      total,
      page,
      size
    })
  } catch (error) {
    console.error('获取项目列表失败:', error)
    return errorResponse('获取项目列表失败')
  }
})
