import prisma from '../../../../utils/db'
import { success, error } from '../../../../utils/response'

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id
  const userId = event.context.params?.userId

  if (!id || !userId) {
    return error('项目ID和用户ID不能为空')
  }

  try {
    const deletedMember = await prisma.project_members.deleteMany({
      where: {
        project_id: id,
        user_id: userId
      }
    })

    if (deletedMember.count === 0) {
      return error('项目成员不存在')
    }

    return success(null, '删除成功')
  } catch (error: any) {
    console.error('删除项目成员失败:', error)
    return error('删除项目成员失败: ' + error.message)
  }
})
