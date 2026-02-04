import prisma from '../../utils/db'
import { success, error } from '../../utils/response'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { project_name, project_leader, client_name, project_type, service_start_date, service_end_date, form_data } = body

    // 验证必填字段
    if (!project_name || !project_leader) {
      return error('项目名称和负责人不能为空')
    }

    const newProject = await prisma.projects.create({
      data: {
        project_name,
        project_leader,
        client_name,
        project_type,
        service_start_date: service_start_date ? new Date(service_start_date) : null,
        service_end_date: service_end_date ? new Date(service_end_date) : null,
        form_data: form_data || {},
        created_by: event.context.user?.id,
        created_at: new Date(),
        updated_at: new Date()
      }
    })

    return success(newProject)
  } catch (error: any) {
    console.error('创建项目失败:', error)
    return error('创建项目失败: ' + error.message)
  }
})
