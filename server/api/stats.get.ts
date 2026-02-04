import { success, error } from '~/server/utils/response'
import prisma from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  try {
    const [projectCount, completedCount, totalIncome, totalExpense] = await Promise.all([
      prisma.project.count(),
      prisma.project.count({ where: { status: 'completed' } }),
      prisma.accountingRecord.aggregate({
        _sum: { amount: true },
        where: { recordType: 'income' }
      }),
      prisma.accountingRecord.aggregate({
        _sum: { amount: true },
        where: { recordType: 'expense' }
      })
    ])

    return success({
      projectCount,
      completedCount,
      totalIncome: totalIncome._sum.amount || 0,
      totalExpense: totalExpense._sum.amount || 0
    })
  } catch (err) {
    console.error('获取统计数据失败:', err)
    return error('获取统计数据失败')
  }
})
