import prisma from '../../../utils/prisma'
import { successResponse, errorResponse } from '../../../utils/response'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')

    await prisma.purchase_contents.delete({
      where: {
        id
      }
    })

    return successResponse(null, '删除成功')
  } catch (error) {
    console.error('删除采购内容失败:', error)
    return errorResponse('删除采购内容失败')
  }
})
