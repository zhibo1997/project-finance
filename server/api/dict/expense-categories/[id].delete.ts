import prisma from '../../utils/db'
import { success, error } from '../../utils/response'

export default defineEventHandler(async (event) => {
  try {
    const id = event.context.params?.id

    if (!id) {
      return error('缺少费用类别ID')
    }

    await prisma.expense_categories.delete({
      where: { id }
    })

    return success(null, '删除成功')
  } catch (err: any) {
    console.error('删除费用类别失败:', err)
    return error(err.message || '删除费用类别失败')
  }
})
