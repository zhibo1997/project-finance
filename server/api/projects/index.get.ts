import prisma from '../../utils/db'
import { success, error } from '../../utils/response'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const { keyword, status, page = '1', size = '20' } = query

  const where: any = {}
  if (status) where.status = status
  if (keyword) {
    where.OR = [
      { project_name: { contains: keyword } },
      { client_name: { contains: keyword } },
      { project_leader: { contains: keyword } }
    ]
  }

  const pageNum = parseInt(page as string)
  const pageSize = parseInt(size as string)

  const [total, list] = await Promise.all([
    prisma.projects.count({ where }),
    prisma.projects.findMany({
      where,
      orderBy: { created_at: 'desc' },
      skip: (pageNum - 1) * pageSize,
      take: pageSize
    })
  ])

  return success({ total, list, page: pageNum, size: pageSize })
})
