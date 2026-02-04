import prisma from '../../../utils/db'
import { success, error } from '../../../utils/response'

export default defineEventHandler(async (event) => {
  const projectId = event.context.params?.id
  const userId = event.context.user?.id

  if (!projectId) {
    return error('项目ID不能为空')
  }

  try {
    const body = await readBody(event)
    const {
      record_type,
      approval_id,
      record_date,
      amount,
      category_id,
      description,
      applicant,
      invoice_no,
      payer,
      attachments,
      remark
    } = body

    // 验证必填字段
    if (!record_type || !approval_id || !record_date || !amount) {
      return error('记账类型、审批流程单ID、记账日期和金额不能为空')
    }

    // 支出类型需要额外字段
    if (record_type === 'expense' && (!category_id || !description || !applicant)) {
      return error('支出记账需要费用类别、用途说明和申请人')
    }

    const newRecord = await prisma.accounting_records.create({
      data: {
        project_id: projectId,
        record_type,
        approval_id,
        record_date: new Date(record_date),
        amount: parseFloat(amount),
        category_id,
        description,
        applicant,
        invoice_no,
        payer,
        attachments,
        remark,
        created_by: userId,
        created_by_name: event.context.user?.name
      }
    })

    return success(newRecord)
  } catch (error: any) {
    console.error('创建记账记录失败:', error)
    return error('创建记账记录失败: ' + error.message)
  }
})
