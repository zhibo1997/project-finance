import prisma from '../../../utils/prisma'
import { successResponse, errorResponse } from '../../../utils/response'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')

    // 级联删除项目相关数据
    await prisma.$transaction(async (prisma) => {
      // 删除项目成员
      await prisma.project_members.deleteMany({
        where: { project_id: id }
      })

      // 删除记账记录
      await prisma.accounting_records.deleteMany({
        where: { project_id: id }
      })

      // 删除项目
      await prisma.projects.delete({
        where: { id }
      })
    })

    return successResponse(null, '项目删除成功')
  } catch (error) {
    console.error('删除项目失败:', error)
    return errorResponse('删除项目失败')
  }
})
