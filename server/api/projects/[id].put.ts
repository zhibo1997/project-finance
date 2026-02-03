import { success, error } from '~/server/utils/response'
import prisma from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  try {
    const id = event.context.params?.id
    const body = await readBody(event)
    const {
      projectName,
      projectLeader,
      clientName,
      projectType,
      serviceStartDate,
      serviceEndDate,
      serviceAmount,
      status,
      formData
    } = body

    const project = await prisma.project.findUnique({
      where: { id }
    })

    if (!project) {
      return error('项目不存在')
    }

    const updated = await prisma.project.update({
      where: { id },
      data: {
        projectName: projectName || project.projectName,
        projectLeader: projectLeader || project.projectLeader,
        clientName: clientName || project.clientName,
        projectType: projectType || project.projectType,
        serviceStartDate: serviceStartDate ? new Date(serviceStartDate) : project.serviceStartDate,
        serviceEndDate: serviceEndDate ? new Date(serviceEndDate) : project.serviceEndDate,
        serviceAmount: serviceAmount !== undefined ? Number(serviceAmount) : project.serviceAmount,
        status: status || project.status,
        formData: formData || project.formData
      }
    })

    return success(updated)
  } catch (err) {
    console.error('更新项目失败:', err)
    return error('更新项目失败')
  }
})
