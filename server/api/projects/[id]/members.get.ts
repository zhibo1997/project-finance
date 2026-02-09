import prisma from '../../../utils/db'
import { success, error } from '../../../utils/response'

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id

  if (!id) {
    return error('项目ID不能为空')
  }

  try {
    const members = await prisma.project_members.findMany({
      where: { project_id: id },
      orderBy: { created_at: 'asc' }
    })

    return success(members)
  } catch (error: any) {
    console.error('获取项目成员失败:', error)
    return error('获取项目成员失败: ' + error.message)
  }
})
