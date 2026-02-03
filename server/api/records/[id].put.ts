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
    const body = await readBody(event)

    const record = await prisma.accountingRecord.findUnique({ where: { id } })
    if (!record) return error('记录不存在')

    const userRole = await getUserRoleInProject(record.projectId, userId!)

    // 成员只能修改自己的记录
    if (userRole === 'member' && record.createdBy !== userId) {
      return error('无权限修改此记录')
    }

    const updated = await prisma.accountingRecord.update({
      where: { id },
      data: {
        ...body,
        recordDate: body.recordDate ? new Date(body.recordDate) : record.recordDate,
        amount: body.amount !== undefined ? parseFloat(body.amount) : record.amount,
        updatedAt: new Date()
      }
    })

    return success(updated)
  } catch (err) {
    console.error('更新记账记录失败:', err)
    return error('更新记账记录失败')
  }
})
