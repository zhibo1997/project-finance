import prisma from '../../utils/db'
import { success, error } from '../../utils/response'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { name, sortOrder = 0 } = body

    if (!name) {
      return error('费用类别名称不能为空')
    }

    const category = await prisma.expense_categories.create({
      data: {
        name,
        sort_order: sortOrder
      }
    })

    return success({
      id: category.id,
      name: category.name,
      sortOrder: category.sort_order
    })
  } catch (err: any) {
    console.error('创建费用类别失败:', err)
    return error(err.message || '创建费用类别失败')
  }
})
