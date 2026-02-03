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
    const projectId = event.context.params?.projectId
    const userId = event.context.user?.id
    const userRole = await getUserRoleInProject(projectId!, userId!)

    const records = await prisma.accountingRecord.findMany({
      where: { projectId },
      orderBy: { recordDate: 'desc' }
    })

    // 项目成员隐藏记账人信息
    if (userRole === 'member') {
      return success(records.map(r => ({
        ...r,
        createdBy: undefined,
        createdByName: undefined
      })))
    }

    return success(records)
  } catch (err) {
    console.error('获取记账记录失败:', err)
    return error('获取记账记录失败')
  }
})
