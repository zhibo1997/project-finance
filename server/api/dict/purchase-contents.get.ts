import { success, error } from '~/server/utils/response'
import prisma from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  try {
    const contents = await prisma.purchaseContent.findMany({
      orderBy: { sortOrder: 'asc' }
    })

    return success(contents)
  } catch (err) {
    console.error('获取采购内容失败:', err)
    return error('获取采购内容失败')
  }
})
