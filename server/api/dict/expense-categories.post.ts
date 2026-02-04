import prisma from '../../utils/db'
import { success, error } from '../../utils/response'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { name, sort_order = 0 } = body

    if (!name) {
      return error('类别名称不能为空')
    }

    const newCategory = await prisma.expense_categories.create({
      data: {
        name,
        sort_order
      }
    })

    return success(newCategory)
  } catch (error: any) {
    console.error('创建费用类别失败:', error)
    return error('创建费用类别失败: ' + error.message)
  }
})
