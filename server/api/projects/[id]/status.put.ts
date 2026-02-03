import { success, error } from '~/server/utils/response'
import prisma from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  try {
    const id = event.context.params?.id
    const body = await readBody(event)
    const { status } = body

    const project = await prisma.project.findUnique({ where: { id } })

    if (!project) {
      return error('项目不存在')
    }

    const updated = await prisma.project.update({
      where: { id },
      data: { status }
    })

    return success(updated)
  } catch (err) {
    console.error('更新项目状态失败:', err)
    return error('更新项目状态失败')
  }
})
