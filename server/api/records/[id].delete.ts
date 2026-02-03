import { success, error } from '~/server/utils/response'
import prisma from '~/server/utils/db'
import type { UserRole } from '~/types/auth'

// 获取用户在项目中的角色
async function getUserRoleInProject(projectId: string, userId: string): Promise<UserRole> {
  const member = await prisma.projectMember.findFirst({
    where: { projectId, userId }
  })

  return member?.role as UserRole || 'member'
}

export default defineEventHandler(async (event) => {
  try {
    const id = event.context.params?.id
    const userId = event.context.user?.id

    const record = await prisma.accountingRecord.findUnique({ where: { id } })
    if (!record) return error('记录不存在')

    const userRole = await getUserRoleInProject(record.projectId, userId!)

    // 成员只能删除自己的记录
    if (userRole === 'member' && record.createdBy !== userId) {
      return error('无权限删除此记录')
    }

    await prisma.accountingRecord.delete({ where: { id } })

    return success(null, '删除成功')
  } catch (err) {
    console.error('删除记账记录失败:', err)
    return error('删除记账记录失败')
  }
})
