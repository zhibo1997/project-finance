import prisma from '../../utils/db'
import { success, error } from '../../utils/response'

export default defineEventHandler(async (event) => {
  try {
    const configs = await prisma.employee_cost_config.findMany({
      orderBy: { level_key: 'asc' }
    })

    return success(configs)
  } catch (error: any) {
    console.error('获取员工成本配置失败:', error)
    return error('获取员工成本配置失败: ' + error.message)
  }
})
