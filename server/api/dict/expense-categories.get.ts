import prisma from '../../utils/db'
import { success, error } from '../../utils/response'

export default defineEventHandler(async (event) => {
  try {
    const categories = await prisma.expense_categories.findMany({
      orderBy: { sort_order: 'asc' }
    })

    const formatted = categories.map(cat => ({
      id: cat.id,
      name: cat.name,
      sortOrder: cat.sort_order
    }))

    return success(formatted)
  } catch (err: any) {
    console.error('获取费用类别失败:', err)
    return error(err.message || '获取费用类别失败')
  }
})
