import { success, error } from '~/server/utils/response'
import prisma from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  try {
    const id = event.context.params?.id
    const body = await readBody(event)
    const { name, sortOrder } = body

    const content = await prisma.purchaseContent.findUnique({
      where: { id }
    })

    if (!content) {
      return error('采购内容不存在')
    }

    const updated = await prisma.purchaseContent.update({
      where: { id },
      data: {
        name: name || content.name,
        sortOrder: sortOrder !== undefined ? sortOrder : content.sortOrder
      }
    })

    return success(updated)
  } catch (err) {
    console.error('更新采购内容失败:', err)
    return error('更新采购内容失败')
  }
})
