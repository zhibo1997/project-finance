import { success, error } from '~/server/utils/response'
import prisma from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  try {
    const configs = await prisma.employeeCostConfig.findMany()

    return success(configs)
  } catch (err) {
    console.error('获取员工成本配置失败:', err)
    return error('获取员工成本配置失败')
  }
})
