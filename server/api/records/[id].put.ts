import prisma from '../../utils/db'
import { success, error } from '../../utils/response'
import type { UserRole } from '../../utils/auth'

// 获取用户在项目中的角色
const getUserRoleInProject = async (projectId: string, userId: string): Promise<UserRole> => {
  // 这里应该根据实际的用户-项目关系查询
  // 现在使用模拟数据
  const project = await prisma.projects.findUnique({
    where: { id: projectId }
  })

  if (!project) {
    return 'project_member'
  }

  // 模拟角色判断
  if (userId === '1') return 'admin'
  if (project.project_leader === '赵六') return 'project_manager'
  return 'project_member'
}

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id
  const userId = event.context.user?.id
  const body = await readBody(event)

  if (!id) {
    return error('记录ID不能为空')
  }

  try {
    const record = await prisma.accounting_records.findUnique({ where: { id } })
    if (!record) return error('记录不存在')

    const userRole = await getUserRoleInProject(record.project_id, userId || '')

    // 成员只能修改自己的记录
    if (userRole === 'project_member' && record.created_by !== userId) {
      return error('无权限修改此记录')
    }

    const updated = await prisma.accounting_records.update({
      where: { id },
      data: {
        ...body,
        ...(body.record_date && { record_date: new Date(body.record_date) }),
        ...(body.amount && { amount: parseFloat(body.amount) }),
        updated_at: new Date()
      }
    })

    return success(updated)
  } catch (error: any) {
    console.error('更新记账记录失败:', error)
    return error('更新记账记录失败: ' + error.message)
  }
})
