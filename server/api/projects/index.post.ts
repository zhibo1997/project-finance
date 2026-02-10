import prisma from '../../utils/prisma'
import { successResponse, errorResponse } from '../../utils/response'
import { getUserFromEvent } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  try {
    const user = getUserFromEvent(event)
    const body = await readBody(event)

    // 必填字段验证
    if (!body.project_name) {
      return errorResponse('项目名称不能为空')
    }

    if (!body.project_leader) {
      return errorResponse('项目负责人不能为空')
    }

    if (!body.client_name) {
      return errorResponse('客户名称不能为空')
    }

    const project = await prisma.projects.create({
      data: {
        project_name: body.project_name,
        project_leader: body.project_leader,
        client_name: body.client_name,
        project_type: body.project_type,
        service_start_date: body.service_start_date ? new Date(body.service_start_date) : null,
        service_end_date: body.service_end_date ? new Date(body.service_end_date) : null,
        service_amount: body.service_amount,
        status: body.status || 'DRAFT',
        form_data: body.form_data ? JSON.stringify(body.form_data) : null,
        created_by: user.id,
        project_members: {
          create: [
            {
              user_id: user.id,
              user_name: user.name,
              role: 'MANAGER'
            },
            ...(body.projectMembers || []).map((member: any) => ({
              user_id: member.userId,
              user_name: member.userName,
              role: 'MEMBER'
            }))
          ]
        }
      }
    })

    return successResponse(project)
  } catch (error) {
    console.error('创建项目失败:', error)
    return errorResponse('创建项目失败')
  }
})
