import { success, error } from '~/server/utils/response'
import prisma from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { name, sortOrder = 0 } = body

    if (!name) {
      return error('采购内容名称不能为空')
    }

    const content = await prisma.purchaseContent.create({
      data: {
        name,
        sortOrder
      }
    })

    return success(content)
  } catch (err) {
    console.error('创建采购内容失败:', err)
    return error('创建采购内容失败')
  }
})
