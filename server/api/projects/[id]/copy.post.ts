import prisma from '../../../utils/prisma'
import { successResponse, errorResponse } from '../../../utils/response'
import { getUserFromEvent } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    const user = getUserFromEvent(event)

    const existingProject = await prisma.projects.findUnique({
      where: { id },
      include: {
        project_members: true
      }
    })

    if (!existingProject) {
      return errorResponse('项目不存在')
    }

    // 仅 COMPLETED/CLOSED 状态可复制
    if (!['COMPLETED', 'CLOSED'].includes(existingProject.status)) {
      return errorResponse('只有已完成或已关闭的项目才能复制')
    }

    const newProject = await prisma.projects.create({
      data: {
        project_name: `${existingProject.project_name} copy`,
        project_leader: existingProject.project_leader,
        client_name: existingProject.client_name,
        project_type: existingProject.project_type,
        service_start_date: null,
        service_end_date: null,
        service_amount: existingProject.service_amount,
        status: 'DRAFT',
        form_data: existingProject.form_data,
        created_by: user.id,
        project_members: {
          create: existingProject.project_members.map(member => ({
            user_id: member.user_id,
            user_name: member.user_name,
            role: member.role
          }))
        }
      }
    })

    return successResponse(newProject)
  } catch (error) {
    console.error('复制项目失败:', error)
    return errorResponse('复制项目失败')
  }
})
