import prisma from '../../../utils/prisma'
import { successResponse, errorResponse } from '../../../utils/response'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    const body = await readBody(event)
    const newStatus = body.status

    const existingProject = await prisma.projects.findUnique({
      where: { id }
    })

    if (!existingProject) {
      return errorResponse('项目不存在')
    }

    const currentStatus = existingProject.status

    // 状态流转验证
    const validTransitions: Record<string, string[]> = {
      'DRAFT': ['SUBMITTED', 'CLOSED'],
      'SUBMITTED': ['COMPLETED', 'CLOSED'],
      'COMPLETED': ['CLOSED'],
      'CLOSED': []
    }

    // 任意状态都可以直接关闭
    if (newStatus === 'CLOSED') {
      await prisma.projects.update({
        where: { id },
        data: { status: 'CLOSED' }
      })
      return successResponse(null, '项目已关闭')
    }

    // 其他状态流转验证
    if (!validTransitions[currentStatus]?.includes(newStatus)) {
      return errorResponse('状态流转不正确')
    }

    await prisma.projects.update({
      where: { id },
      data: { status: newStatus }
    })

    return successResponse(null, '状态更新成功')
  } catch (error) {
    console.error('更新项目状态失败:', error)
    return errorResponse('更新项目状态失败')
  }
})
