import prisma from '../../utils/db'
import { success, error } from '../../utils/response'

export default defineEventHandler(async (event) => {
  try {
    const contents = await prisma.purchase_contents.findMany({
      orderBy: { sort_order: 'asc' }
    })

    return success(contents)
  } catch (error: any) {
    console.error('获取采购内容失败:', error)
    return error('获取采购内容失败: ' + error.message)
  }
})
