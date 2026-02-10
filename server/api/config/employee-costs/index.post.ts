import prisma from '../../../utils/prisma'
import { successResponse, errorResponse } from '../../../utils/response'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    if (!body.level_key) {
      return errorResponse('职级代码不能为空')
    }

    if (!body.level_name) {
      return errorResponse('职级名称不能为空')
    }

    if (!body.daily_cost) {
      return errorResponse('日成本不能为空')
    }

    const employeeCost = await prisma.employee_cost_config.create({
      data: {
        level_key: body.level_key,
        level_name: body.level_name,
        daily_cost: body.daily_cost
      }
    })

    return successResponse(employeeCost)
  } catch (error: any) {
    console.error('创建员工成本配置失败:', error)
    if (error.code === 'P2002') {
      return errorResponse('职级代码已存在')
    }
    return errorResponse('创建员工成本配置失败')
  }
})
