import prisma from '~/server/utils/db'
import { success, error } from '~/server/utils/response'

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id

  if (!id) {
    return error('配置ID不能为空')
  }

  try {
    const body = await readBody(event)
    const { level_key, level_name, daily_cost } = body

    const updatedConfig = await prisma.employee_cost_config.update({
      where: { id },
      data: {
        ...(level_key && { level_key }),
        ...(level_name && { level_name }),
        ...(daily_cost != null && { daily_cost: parseFloat(daily_cost) })
      }
    })

    return success(updatedConfig)
  } catch (error: any) {
    console.error('更新员工成本配置失败:', error)
    return error('更新员工成本配置失败: ' + error.message)
  }
})
