import prisma from '~/server/utils/db'
import { success, error } from '~/server/utils/response'

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id

  if (!id) {
    return error('类别ID不能为空')
  }

  try {
    const body = await readBody(event)
    const { name, sort_order } = body

    const updatedCategory = await prisma.expense_categories.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(sort_order !== undefined && { sort_order })
      }
    })

    return success(updatedCategory)
  } catch (error: any) {
    console.error('更新费用类别失败:', error)
    return error('更新费用类别失败: ' + error.message)
  }
})
