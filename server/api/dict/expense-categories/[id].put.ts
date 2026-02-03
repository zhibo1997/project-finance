import { success, error } from '~/server/utils/response'
import prisma from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  try {
    const id = event.context.params?.id
    const body = await readBody(event)
    const { name, sortOrder } = body

    const category = await prisma.expenseCategory.findUnique({
      where: { id }
    })

    if (!category) {
      return error('费用类别不存在')
    }

    const updated = await prisma.expenseCategory.update({
      where: { id },
      data: {
        name: name || category.name,
        sortOrder: sortOrder !== undefined ? sortOrder : category.sortOrder
      }
    })

    return success(updated)
  } catch (err) {
    console.error('更新费用类别失败:', err)
    return error('更新费用类别失败')
  }
})
