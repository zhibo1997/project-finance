import prisma from '../../utils/db'
import { success, error } from '../../utils/response'

export default defineEventHandler(async (event) => {
  try {
    const id = event.context.params?.id
    const body = await readBody(event)
    const { name, sortOrder } = body

    if (!id) {
      return error('缺少采购内容ID')
    }

    const content = await prisma.purchase_contents.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(sortOrder !== undefined && { sort_order: sortOrder })
      }
    })

    return success({
      id: content.id,
      name: content.name,
      sortOrder: content.sort_order
    })
  } catch (err: any) {
    console.error('更新采购内容失败:', err)
    return error(err.message || '更新采购内容失败')
  }
})
