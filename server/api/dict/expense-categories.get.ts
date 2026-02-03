import { success, error } from '~/server/utils/response'
import prisma from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  try {
    const categories = await prisma.expenseCategory.findMany({
      orderBy: { sortOrder: 'asc' }
    })

    return success(categories)
  } catch (err) {
    console.error('获取费用类别失败:', err)
    return error('获取费用类别失败')
  }
})
