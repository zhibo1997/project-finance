import prisma from '../../../utils/db'
import { success, error } from '../../../utils/response'

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id

  if (!id) {
    return error('采购内容ID不能为空')
  }

  try {
    const body = await readBody(event)
    const { name, sort_order } = body

    const updatedContent = await prisma.purchase_contents.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(sort_order !== undefined && { sort_order })
      }
    })

    return success(updatedContent)
  } catch (error: any) {
    console.error('更新采购内容失败:', error)
    return error('更新采购内容失败: ' + error.message)
  }
})
