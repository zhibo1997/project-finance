import prisma from '../../../utils/prisma'
import { successResponse, errorResponse } from '../../../utils/response'

export default defineEventHandler(async () => {
  try {
    const expenseCategories = await prisma.expense_categories.findMany({
      orderBy: {
        sort_order: 'asc'
      }
    })

    return successResponse(expenseCategories)
  } catch (error) {
    console.error('获取费用类别列表失败:', error)
    return errorResponse('获取费用类别列表失败')
  }
})
