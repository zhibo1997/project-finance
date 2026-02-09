import prisma from '../../../utils/db'
import { success, error } from '../../../utils/response'

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id

  if (!id) {
    return error('项目ID不能为空')
  }

  try {
    const body = await readBody(event)
    const { user_id, user_name, role = 'member' } = body

    if (!user_id || !user_name) {
      return error('用户ID和姓名不能为空')
    }

    // 检查用户是否已在项目中
    const existingMember = await prisma.project_members.findFirst({
      where: {
        project_id: id,
        user_id
      }
    })

    if (existingMember) {
      return error('用户已在项目中')
    }

    const newMember = await prisma.project_members.create({
      data: {
        project_id: id,
        user_id,
        user_name,
        role
      }
    })

    return success(newMember)
  } catch (error: any) {
    console.error('添加项目成员失败:', error)
    return error('添加项目成员失败: ' + error.message)
  }
})
