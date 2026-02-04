import prisma from '../../utils/db'
import { success, error } from '../../utils/response'

export default defineEventHandler(async (event) => {
  try {
    const categories = await prisma.expense_categories.findMany({
      orderBy: { sort_order: 'asc' }
    })

    return success(categories)
  } catch (error: any) {
    console.error('获取费用类别失败:', error)
    return error('获取费用类别失败: ' + error.message)
  }
})
