import prisma from '../../../../utils/prisma'
import { successResponse, errorResponse } from '../../../../utils/response'
import { getUserFromEvent } from '../../../../utils/auth'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    const query = getQuery(event)
    const recordType = query.recordType || ''

    const user = getUserFromEvent(event)

    const where: any = {
      project_id: id
    }

    if (recordType) {
      where.record_type = recordType
    }

    const records = await prisma.accounting_records.findMany({
      where,
      orderBy: {
        record_date: 'desc'
      }
    })

    // 根据角色处理返回数据
    const processedRecords = records.map(record => {
      const result: any = {
        ...record,
        attachments: record.attachments ? JSON.parse(record.attachments) : null
      }

      // 项目成员看不到记账人信息
      if (user.role === 'project_member') {
        result.created_by = ''
        result.created_by_name = ''
      }

      return result
    })

    return successResponse(processedRecords)
  } catch (error) {
    console.error('获取项目记账记录失败:', error)
    return errorResponse('获取项目记账记录失败')
  }
})
