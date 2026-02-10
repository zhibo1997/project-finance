import prisma from '../../../utils/prisma'
import { successResponse, errorResponse } from '../../../utils/response'

export default defineEventHandler(async () => {
  try {
    const purchaseContents = await prisma.purchase_contents.findMany({
      orderBy: {
        sort_order: 'asc'
      }
    })

    return successResponse(purchaseContents)
  } catch (error) {
    console.error('获取采购内容列表失败:', error)
    return errorResponse('获取采购内容列表失败')
  }
})
