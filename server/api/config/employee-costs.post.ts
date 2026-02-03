import { success, error } from '~/server/utils/response'
import prisma from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { levelKey, levelName, dailyCost } = body

    if (!levelKey || !levelName || dailyCost === undefined) {
      return error('级别标识、级别名称和日成本不能为空')
    }

    const config = await prisma.employeeCostConfig.create({
      data: {
        levelKey,
        levelName,
        dailyCost: parseFloat(dailyCost)
      }
    })

    return success(config)
  } catch (err) {
    console.error('创建员工成本配置失败:', err)
    return error('创建员工成本配置失败')
  }
})
