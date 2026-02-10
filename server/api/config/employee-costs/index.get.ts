import prisma from '../../../utils/prisma'
import { successResponse, errorResponse } from '../../../utils/response'

export default defineEventHandler(async () => {
  try {
    const employeeCosts = await prisma.employee_cost_config.findMany({
      orderBy: {
        level_key: 'asc'
      }
    })

    return successResponse(employeeCosts)
  } catch (error) {
    console.error('获取员工成本配置列表失败:', error)
    return errorResponse('获取员工成本配置列表失败')
  }
})
