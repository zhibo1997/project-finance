import prisma from '../../../utils/db'
import { success, error } from '../../../utils/response'

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id

  if (!id) {
    return error('项目ID不能为空')
  }

  try {
    const body = await readBody(event)
    const { status } = body

    // 验证状态值
    const validStatuses = ['draft', 'submitted', 'completed', 'closed']
    if (!validStatuses.includes(status)) {
      return error('无效的状态值')
    }

    const updatedProject = await prisma.projects.update({
      where: { id },
      data: {
        status,
        updated_at: new Date()
      }
    })

    return success(updatedProject)
  } catch (error: any) {
    console.error('更新项目状态失败:', error)
    return error('更新项目状态失败: ' + error.message)
  }
})
