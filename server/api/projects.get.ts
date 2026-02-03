import { success, error } from '~/server/utils/response'
import prisma from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const { keyword, status, page = 1, size = 20 } = query

    const where: any = {}
    if (status) where.status = status
    if (keyword) {
      where.OR = [
        { projectName: { contains: keyword } },
        { clientName: { contains: keyword } },
        { projectLeader: { contains: keyword } }
      ]
    }

    const [total, list] = await Promise.all([
      prisma.project.count({ where }),
      prisma.project.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (Number(page) - 1) * Number(size),
        take: Number(size)
      })
    ])

    return success({ total, list, page: Number(page), size: Number(size) })
  } catch (err) {
    console.error('获取项目列表失败:', err)
    return error('获取项目列表失败')
  }
})
