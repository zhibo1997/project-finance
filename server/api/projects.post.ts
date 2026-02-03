import { success, error } from '~/server/utils/response'
import prisma from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const {
      projectName,
      projectLeader,
      clientName,
      projectType,
      serviceStartDate,
      serviceEndDate,
      formData,
      createdBy = 'default'
    } = body

    if (!projectName || !projectLeader || !clientName || !projectType || !serviceStartDate || !serviceEndDate) {
      return error('项目基本信息不能为空')
    }

    const project = await prisma.project.create({
      data: {
        projectName,
        projectLeader,
        clientName,
        projectType,
        serviceStartDate: new Date(serviceStartDate),
        serviceEndDate: new Date(serviceEndDate),
        serviceAmount: 0,
        status: 'draft',
        formData,
        createdBy
      }
    })

    return success(project)
  } catch (err) {
    console.error('创建项目失败:', err)
    return error('创建项目失败')
  }
})
