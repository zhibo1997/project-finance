import { success, error } from '~/server/utils/response'
import prisma from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { name, sortOrder = 0 } = body

    if (!name) {
      return error('费用类别名称不能为空')
    }

    const category = await prisma.expenseCategory.create({
      data: {
        name,
        sortOrder
      }
    })

    return success(category)
  } catch (err) {
    console.error('创建费用类别失败:', err)
    return error('创建费用类别失败')
  }
})
