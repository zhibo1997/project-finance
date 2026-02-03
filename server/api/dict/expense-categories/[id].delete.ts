import { success, error } from '~/server/utils/response'
import prisma from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  try {
    const id = event.context.params?.id

    const category = await prisma.expenseCategory.findUnique({
      where: { id }
    })

    if (!category) {
      return error('费用类别不存在')
    }

    await prisma.expenseCategory.delete({
      where: { id }
    })

    return success(null, '删除成功')
  } catch (err) {
    console.error('删除费用类别失败:', err)
    return error('删除费用类别失败')
  }
})
