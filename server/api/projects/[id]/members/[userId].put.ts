import prisma from '../../../../utils/db'
import { success, error } from '../../../../utils/response'

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id
  const userId = event.context.params?.userId

  if (!id || !userId) {
    return error('项目ID和用户ID不能为空')
  }

  try {
    const body = await readBody(event)
    const { role } = body

    if (!role) {
      return error('角色不能为空')
    }

    const updatedMember = await prisma.project_members.updateMany({
      where: {
        project_id: id,
        user_id: userId
      },
      data: {
        role
      }
    })

    if (updatedMember.count === 0) {
      return error('项目成员不存在')
    }

    return success(null, '更新成功')
  } catch (error: any) {
    console.error('更新项目成员角色失败:', error)
    return error('更新项目成员角色失败: ' + error.message)
  }
})
