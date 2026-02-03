import ExcelJS from 'exceljs'
import { success, error } from '~/server/utils/response'
import prisma from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  try {
    const id = event.context.params?.id
    const project = await prisma.project.findUnique({ where: { id } })

    if (!project) {
      return error('项目不存在')
    }

    // 创建 Excel 工作簿
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('项目详情')

    // 写入项目基本信息
    worksheet.addRow(['项目名称', project.projectName])
    worksheet.addRow(['项目负责人', project.projectLeader])
    worksheet.addRow(['客户名称', project.clientName])
    worksheet.addRow(['项目类型', project.projectType])
    worksheet.addRow(['服务开始日期', project.serviceStartDate.toLocaleDateString()])
    worksheet.addRow(['服务结束日期', project.serviceEndDate.toLocaleDateString()])
    worksheet.addRow(['服务金额', project.serviceAmount])
    worksheet.addRow(['状态', project.status])
    worksheet.addRow(['创建时间', project.createdAt.toLocaleString()])
    worksheet.addRow(['更新时间', project.updatedAt.toLocaleString()])

    // 写入项目成员
    const membersWorksheet = workbook.addWorksheet('项目成员')
    membersWorksheet.columns = [
      { header: '用户ID', key: 'userId', width: 36 },
      { header: '用户姓名', key: 'userName', width: 20 },
      { header: '角色', key: 'role', width: 10 }
    ]

    const members = await prisma.projectMember.findMany({ where: { projectId: id } })
    members.forEach(member => {
      membersWorksheet.addRow({
        userId: member.userId,
        userName: member.userName,
        role: member.role
      })
    })

    // 写入项目记录
    const recordsWorksheet = workbook.addWorksheet('项目记录')
    recordsWorksheet.columns = [
      { header: '记录ID', key: 'id', width: 36 },
      { header: '记录类型', key: 'recordType', width: 10 },
      { header: '审批流程单ID', key: 'approvalId', width: 20 },
      { header: '记账日期', key: 'recordDate', width: 15 },
      { header: '金额', key: 'amount', width: 15 },
      { header: '费用类别ID', key: 'categoryId', width: 36 },
      { header: '用途说明', key: 'description', width: 50 },
      { header: '申请人', key: 'applicant', width: 20 },
      { header: '发票号', key: 'invoiceNo', width: 20 },
      { header: '付款方', key: 'payer', width: 30 },
      { header: '备注', key: 'remark', width: 50 },
      { header: '记账人ID', key: 'createdBy', width: 36 },
      { header: '记账人姓名', key: 'createdByName', width: 20 },
      { header: '创建时间', key: 'createdAt', width: 20 },
      { header: '更新时间', key: 'updatedAt', width: 20 }
    ]

    const records = await prisma.accountingRecord.findMany({ where: { projectId: id } })
    records.forEach(record => {
      recordsWorksheet.addRow({
        id: record.id,
        recordType: record.recordType,
        approvalId: record.approvalId,
        recordDate: record.recordDate.toLocaleDateString(),
        amount: record.amount,
        categoryId: record.categoryId,
        description: record.description,
        applicant: record.applicant,
        invoiceNo: record.invoiceNo,
        payer: record.payer,
        remark: record.remark,
        createdBy: record.createdBy,
        createdByName: record.createdByName,
        createdAt: record.createdAt.toLocaleString(),
        updatedAt: record.updatedAt.toLocaleString()
      })
    })

    // 生成 Excel 文件
    const buffer = await workbook.xlsx.writeBuffer()

    // 设置响应头
    event.node.res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    event.node.res.setHeader('Content-Disposition', `attachment; filename="${project.projectName}_详情.xlsx"`)

    // 发送文件
    return buffer
  } catch (err) {
    console.error('导出项目失败:', err)
    return error('导出项目失败')
  }
})
