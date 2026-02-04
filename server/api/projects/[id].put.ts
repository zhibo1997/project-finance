import prisma from '../../utils/db'
import { success, error } from '../../utils/response'

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id

  if (!id) {
    return error('项目ID不能为空')
  }

  try {
    const body = await readBody(event)
    const { project_name, project_leader, client_name, project_type, service_start_date, service_end_date, form_data } = body

    const updatedProject = await prisma.projects.update({
      where: { id },
      data: {
        project_name,
        project_leader,
        client_name,
        project_type,
        service_start_date: service_start_date ? new Date(service_start_date) : null,
        service_end_date: service_end_date ? new Date(service_end_date) : null,
        form_data: form_data || {},
        updated_at: new Date()
      }
    })

    return success(updatedProject)
  } catch (error: any) {
    console.error('更新项目失败:', error)
    return error('更新项目失败: ' + error.message)
  }
})
