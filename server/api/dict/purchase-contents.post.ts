import prisma from '../../utils/db'
import { success, error } from '../../utils/response'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { name, sortOrder = 0 } = body

    if (!name) {
      return error('采购内容名称不能为空')
    }

    const content = await prisma.purchase_contents.create({
      data: {
        name,
        sort_order: sortOrder
      }
    })

    return success({
      id: content.id,
      name: content.name,
      sortOrder: content.sort_order
    })
  } catch (err: any) {
    console.error('创建采购内容失败:', err)
    return error(err.message || '创建采购内容失败')
  }
})
