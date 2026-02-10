import prisma from '../../utils/db'
import { success, error } from '../../utils/response'

export default defineEventHandler(async (event) => {
  try {
    const id = event.context.params?.id

    if (!id) {
      return error('缺少采购内容ID')
    }

    await prisma.purchase_contents.delete({
      where: { id }
    })

    return success(null, '删除成功')
  } catch (err: any) {
    console.error('删除采购内容失败:', err)
    return error(err.message || '删除采购内容失败')
  }
})
