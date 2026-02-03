import { success, error } from '~/server/utils/response'
import prisma from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  try {
    const projectId = event.context.params?.projectId
    const body = await readBody(event)
    const {
      recordType,
      approvalId,
      recordDate,
      amount,
      categoryId,
      description,
      applicant,
      invoiceNo,
      payer,
      attachments,
      remark
    } = body

    if (!recordType || !approvalId || !recordDate || !amount) {
      return error('必填字段不能为空')
    }

    const record = await prisma.accountingRecord.create({
      data: {
        projectId,
        recordType,
        approvalId,
        recordDate: new Date(recordDate),
        amount: parseFloat(amount),
        categoryId,
        description,
        applicant,
        invoiceNo,
        payer,
        attachments,
        remark,
        createdBy: event.context.user?.id || 'default',
        createdByName: event.context.user?.name || '默认用户'
      }
    })

    return success(record)
  } catch (err) {
    console.error('创建记账记录失败:', err)
    return error('创建记账记录失败')
  }
})
