import { success, error } from '~/server/utils/response'
import prisma from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const { keyword, projectId, recordType, page = 1, size = 20 } = query

    const where: any = {}
    if (projectId) where.projectId = projectId
    if (recordType) where.recordType = recordType
    if (keyword) {
      where.OR = [
        { description: { contains: keyword } },
        { applicant: { contains: keyword } },
        { invoiceNo: { contains: keyword } },
        { payer: { contains: keyword } },
        { remark: { contains: keyword } }
      ]
    }

    const [total, list] = await Promise.all([
      prisma.accountingRecord.count({ where }),
      prisma.accountingRecord.findMany({
        where,
        orderBy: { recordDate: 'desc' },
        skip: (Number(page) - 1) * Number(size),
        take: Number(size)
      })
    ])

    return success({ total, list, page: Number(page), size: Number(size) })
  } catch (err) {
    console.error('获取记账记录失败:', err)
    return error('获取记账记录失败')
  }
})
