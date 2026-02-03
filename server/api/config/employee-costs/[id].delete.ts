import { success, error } from '~/server/utils/response'
import prisma from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  try {
    const id = event.context.params?.id

    const config = await prisma.employeeCostConfig.findUnique({
      where: { id }
    })

    if (!config) {
      return error('员工成本配置不存在')
    }

    await prisma.employeeCostConfig.delete({
      where: { id }
    })

    return success(null, '删除成功')
  } catch (err) {
    console.error('删除员工成本配置失败:', err)
    return error('删除员工成本配置失败')
  }
})
