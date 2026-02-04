import prisma from '../../utils/db'
import { success, error } from '../../utils/response'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { name, sort_order = 0 } = body

    if (!name) {
      return error('采购内容名称不能为空')
    }

    const newContent = await prisma.purchase_contents.create({
      data: {
        name,
        sort_order
      }
    })

    return success(newContent)
  } catch (error: any) {
    console.error('创建采购内容失败:', error)
    return error('创建采购内容失败: ' + error.message)
  }
})
