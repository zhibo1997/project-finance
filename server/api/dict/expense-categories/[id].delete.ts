import prisma from '~/server/utils/db'
import { success, error } from '~/server/utils/response'

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id

  if (!id) {
    return error('类别ID不能为空')
  }

  try {
    await prisma.expense_categories.delete({
      where: { id }
    })

    return success(null, '删除成功')
  } catch (error: any) {
    console.error('删除费用类别失败:', error)
    return error('删除费用类别失败: ' + error.message)
  }
})
