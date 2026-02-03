import { success, error } from '~/server/utils/response'
import prisma from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  try {
    const id = event.context.params?.id

    const content = await prisma.purchaseContent.findUnique({
      where: { id }
    })

    if (!content) {
      return error('采购内容不存在')
    }

    await prisma.purchaseContent.delete({
      where: { id }
    })

    return success(null, '删除成功')
  } catch (err) {
    console.error('删除采购内容失败:', err)
    return error('删除采购内容失败')
  }
})
