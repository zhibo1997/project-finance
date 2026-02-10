import prisma from '../../../utils/prisma'
import { successResponse, errorResponse } from '../../../utils/response'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    if (!body.name) {
      return errorResponse('费用类别名称不能为空')
    }

    const expenseCategory = await prisma.expense_categories.create({
      data: {
        name: body.name,
        sort_order: body.sort_order || 0
      }
    })

    return successResponse(expenseCategory)
  } catch (error) {
    console.error('创建费用类别失败:', error)
    return errorResponse('创建费用类别失败')
  }
})
