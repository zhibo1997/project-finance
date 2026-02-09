import prisma from '../../../utils/db'
import { success, error } from '../../../utils/response'

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id

  if (!id) {
    return error('采购内容ID不能为空')
  }

  try {
    await prisma.purchase_contents.delete({
      where: { id }
    })

    return success(null, '删除成功')
  } catch (error: any) {
    console.error('删除采购内容失败:', error)
    return error('删除采购内容失败: ' + error.message)
  }
})
