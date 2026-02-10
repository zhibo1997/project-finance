import prisma from '../../utils/db'
import { success, error } from '../../utils/response'

export default defineEventHandler(async (event) => {
  try {
    const id = event.context.params?.id
    const body = await readBody(event)
    const { name, sortOrder } = body

    if (!id) {
      return error('缺少费用类别ID')
    }

    const category = await prisma.expense_categories.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(sortOrder !== undefined && { sort_order: sortOrder })
      }
    })

    return success({
      id: category.id,
      name: category.name,
      sortOrder: category.sort_order
    })
  } catch (err: any) {
    console.error('更新费用类别失败:', err)
    return error(err.message || '更新费用类别失败')
  }
})
