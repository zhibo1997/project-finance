import prisma from '../../../utils/prisma'
import { successResponse, errorResponse } from '../../../utils/response'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')

    const project = await prisma.projects.findUnique({
      where: { id },
      include: {
        project_members: true,
        accounting_records: true
      }
    })

    if (!project) {
      return errorResponse('项目不存在')
    }

    // 计算财务汇总信息
    const incomeRecords = project.accounting_records.filter(record => record.record_type === 'INCOME')
    const expenseRecords = project.accounting_records.filter(record => record.record_type === 'EXPENSE')

    const incomeAmount = incomeRecords.reduce((sum, record) => sum + Number(record.amount), 0)
    const expenseAmount = expenseRecords.reduce((sum, record) => sum + Number(record.amount), 0)

    const processedProject = {
      ...project,
      form_data: project.form_data ? JSON.parse(project.form_data) : null,
      incomeAmount,
      expenseAmount,
      profitAmount: incomeAmount - expenseAmount,
      accounting_records: project.accounting_records.map(record => ({
        ...record,
        attachments: record.attachments ? JSON.parse(record.attachments) : null
      }))
    }

    return successResponse(processedProject)
  } catch (error) {
    console.error('获取项目详情失败:', error)
    return errorResponse('获取项目详情失败')
  }
})
