import { success, error } from '~/server/utils/response'
import prisma from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  try {
    const id = event.context.params?.id

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        members: true,
        records: true
      }
    })

    if (!project) {
      return error('项目不存在')
    }

    return success(project)
  } catch (err) {
    console.error('获取项目详情失败:', err)
    return error('获取项目详情失败')
  }
})
