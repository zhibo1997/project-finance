import prisma from '../../utils/db'
import { success, error } from '../../utils/response'

export default defineEventHandler(async (event) => {
  try {
    const contents = await prisma.purchase_contents.findMany({
      orderBy: { sort_order: 'asc' }
    })

    const formatted = contents.map(content => ({
      id: content.id,
      name: content.name,
      sortOrder: content.sort_order
    }))

    return success(formatted)
  } catch (err: any) {
    console.error('获取采购内容失败:', err)
    return error(err.message || '获取采购内容失败')
  }
})
