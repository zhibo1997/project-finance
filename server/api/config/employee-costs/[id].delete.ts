import prisma from '../../../utils/prisma'
import { successResponse, errorResponse } from '../../../utils/response'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')

    await prisma.employee_cost_config.delete({
      where: {
        id
      }
    })

    return successResponse(null, '删除成功')
  } catch (error) {
    console.error('删除员工成本配置失败:', error)
    return errorResponse('删除员工成本配置失败')
  }
})
