import prisma from '../../../utils/prisma'
import { successResponse, errorResponse } from '../../../utils/response'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    if (!body.name) {
      return errorResponse('采购内容名称不能为空')
    }

    const purchaseContent = await prisma.purchase_contents.create({
      data: {
        name: body.name,
        sort_order: body.sort_order || 0
      }
    })

    return successResponse(purchaseContent)
  } catch (error) {
    console.error('创建采购内容失败:', error)
    return errorResponse('创建采购内容失败')
  }
})
