import { success, error } from '~/server/utils/response'
import prisma from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  try {
    const id = event.context.params?.id
    const original = await prisma.project.findUnique({ where: { id } })

    if (!original) {
      return error('项目不存在')
    }

    const formData = original.formData as any
    formData.basicInfo.projectName = `${formData.basicInfo.projectName} copy`

    const newProject = await prisma.project.create({
      data: {
        ...original,
        id: undefined,
        status: 'draft',
        formData,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })

    return success(newProject)
  } catch (err) {
    console.error('复制项目失败:', err)
    return error('复制项目失败')
  }
})
