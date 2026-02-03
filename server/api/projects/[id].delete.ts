import { success, error } from '~/server/utils/response'
import prisma from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  try {
    const id = event.context.params?.id

    const project = await prisma.project.findUnique({
      where: { id }
    })

    if (!project) {
      return error('项目不存在')
    }

    await prisma.project.delete({
      where: { id }
    })

    return success(null, '删除成功')
  } catch (err) {
    console.error('删除项目失败:', err)
    return error('删除项目失败')
  }
})
