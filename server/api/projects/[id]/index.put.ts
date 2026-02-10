import prisma from '../../../utils/prisma'
import { successResponse, errorResponse } from '../../../utils/response'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    const body = await readBody(event)

    // 仅 DRAFT/SUBMITTED/COMPLETED 状态可编辑
    const existingProject = await prisma.projects.findUnique({
      where: { id }
    })

    if (!existingProject) {
      return errorResponse('项目不存在')
    }

    if (existingProject.status === 'CLOSED') {
      return errorResponse('已关闭的项目无法编辑')
    }

    const project = await prisma.projects.update({
      where: { id },
      data: {
        project_name: body.project_name,
        project_leader: body.project_leader,
        client_name: body.client_name,
        project_type: body.project_type,
        service_start_date: body.service_start_date ? new Date(body.service_start_date) : null,
        service_end_date: body.service_end_date ? new Date(body.service_end_date) : null,
        service_amount: body.service_amount,
        status: body.status,
        form_data: body.form_data ? JSON.stringify(body.form_data) : null
      }
    })

    // 同步更新项目成员
    if (body.projectMembers) {
      // 删除现有成员
      await prisma.project_members.deleteMany({
        where: { project_id: id }
      })

      // 创建新成员
      await prisma.project_members.createMany({
        data: body.projectMembers.map((member: any) => ({
          project_id: id,
          user_id: member.userId,
          user_name: member.userName,
          role: member.role || 'MEMBER'
        }))
      })
    }

    return successResponse(project)
  } catch (error) {
    console.error('更新项目失败:', error)
    return errorResponse('更新项目失败')
  }
})
