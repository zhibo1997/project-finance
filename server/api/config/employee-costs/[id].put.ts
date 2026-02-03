import { success, error } from '~/server/utils/response'
import prisma from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  try {
    const id = event.context.params?.id
    const body = await readBody(event)
    const { levelKey, levelName, dailyCost } = body

    const config = await prisma.employeeCostConfig.findUnique({
      where: { id }
    })

    if (!config) {
      return error('员工成本配置不存在')
    }

    const updated = await prisma.employeeCostConfig.update({
      where: { id },
      data: {
        levelKey: levelKey || config.levelKey,
        levelName: levelName || config.levelName,
        dailyCost: dailyCost !== undefined ? parseFloat(dailyCost) : config.dailyCost
      }
    })

    return success(updated)
  } catch (err) {
    console.error('更新员工成本配置失败:', err)
    return error('更新员工成本配置失败')
  }
})
