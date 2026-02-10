import prisma from '../../../utils/prisma'
import { successResponse, errorResponse } from '../../../utils/response'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')

    await prisma.expense_categories.delete({
      where: {
        id
      }
    })

    return successResponse(null, '删除成功')
  } catch (error) {
    console.error('删除费用类别失败:', error)
    return errorResponse('删除费用类别失败')
  }
})
