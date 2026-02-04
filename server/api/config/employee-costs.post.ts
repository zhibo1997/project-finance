import prisma from '../../utils/db'
import { success, error } from '../../utils/response'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { level_key, level_name, daily_cost } = body

    if (!level_key || !level_name || daily_cost == null) {
      return error('级别标识、级别名称和日成本不能为空')
    }

    const newConfig = await prisma.employee_cost_config.create({
      data: {
        level_key,
        level_name,
        daily_cost: parseFloat(daily_cost)
      }
    })

    return success(newConfig)
  } catch (error: any) {
    console.error('创建员工成本配置失败:', error)
    return error('创建员工成本配置失败: ' + error.message)
  }
})
