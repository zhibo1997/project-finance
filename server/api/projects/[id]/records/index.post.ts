import prisma from '../../../../utils/prisma'
import { successResponse, errorResponse } from '../../../../utils/response'
import { getUserFromEvent } from '../../../../utils/auth'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    const body = await readBody(event)
    const user = getUserFromEvent(event)

    // 验证项目状态 - 仅 COMPLETED 状态可记账
    const project = await prisma.projects.findUnique({
      where: { id }
    })

    if (!project) {
      return errorResponse('项目不存在')
    }

    if (project.status !== 'COMPLETED') {
      return errorResponse('只有已完成的项目才能记账')
    }

    // 验证权限
    const isAdmin = user.role === 'admin'
    const isProjectManager = user.role === 'project_manager'
    const isProjectMember = user.role === 'project_member'

    if (body.record_type === 'INCOME' && !isAdmin && !isProjectManager) {
      return errorResponse('只有管理员和项目经理可以添加收入记录')
    }

    // 必填字段验证
    if (!body.approval_id) {
      return errorResponse('审批单号不能为空')
    }

    if (!body.record_date) {
      return errorResponse('记账日期不能为空')
    }

    if (!body.amount) {
      return errorResponse('金额不能为空')
    }

    if (body.record_type === 'EXPENSE') {
      if (!body.category_id) {
        return errorResponse('费用类别不能为空')
      }

      if (!body.description) {
        return errorResponse('描述不能为空')
      }

      if (!body.applicant) {
        return errorResponse('申请人不能为空')
      }
    }

    const record = await prisma.accounting_records.create({
      data: {
        project_id: id,
        record_type: body.record_type,
        approval_id: body.approval_id,
        record_date: new Date(body.record_date),
        amount: body.amount,
        category_id: body.category_id,
        description: body.description,
        applicant: body.applicant,
        invoice_no: body.invoice_no,
        payer: body.payer,
        attachments: body.attachments ? JSON.stringify(body.attachments) : null,
        remark: body.remark,
        created_by: user.id,
        created_by_name: user.name
      }
    })

    return successResponse(record)
  } catch (error) {
    console.error('创建记账记录失败:', error)
    return errorResponse('创建记账记录失败')
  }
})
