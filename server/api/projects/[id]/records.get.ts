import prisma from '../../../utils/db'
import { success, error } from '../../../utils/response'
import type { UserRole } from '../../../utils/auth'

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
  const projectId = event.context.params?.id
  const userId = event.context.user?.id
  const query = getQuery(event)
  const { type, page = '1', size = '20' } = query

  if (!projectId) {
    return error('项目ID不能为空')
  }

  const where: any = { project_id: projectId }
  if (type) where.record_type = type

  const pageNum = parseInt(page as string)
  const pageSize = parseInt(size as string)

  try {
    const [total, records] = await Promise.all([
      prisma.accounting_records.count({ where }),
      prisma.accounting_records.findMany({
        where,
        orderBy: { record_date: 'desc' },
        skip: (pageNum - 1) * pageSize,
        take: pageSize
      })
    ])

    // 获取用户角色
    const userRole = await getUserRoleInProject(projectId, userId || '')

    // 项目成员隐藏记账人信息
    const processedRecords = records.map(record => {
      if (userRole === 'project_member') {
        return {
          ...record,
          created_by: undefined,
          created_by_name: undefined
        }
      }
      return record
    })

    return success({ total, list: processedRecords, page: pageNum, size: pageSize })
  } catch (error: any) {
    console.error('获取记账记录失败:', error)
    return error('获取记账记录失败: ' + error.message)
  }
})
