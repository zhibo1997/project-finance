import ExcelJS from 'exceljs'
import prisma from '../../../utils/prisma'
import { successResponse, errorResponse } from '../../../utils/response'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')

    const project = await prisma.projects.findUnique({
      where: { id },
      include: {
        project_members: true,
        accounting_records: true
      }
    })

    if (!project) {
      return errorResponse('项目不存在')
    }

    const workbook = new ExcelJS.Workbook()
    const worksheet1 = workbook.addWorksheet('项目概况')
    const worksheet2 = workbook.addWorksheet('服务收入明细')
    const worksheet3 = workbook.addWorksheet('成本明细')

    // Sheet1: 项目概况
    worksheet1.addRow(['项目名称', project.project_name])
    worksheet1.addRow(['项目负责人', project.project_leader])
    worksheet1.addRow(['客户名称', project.client_name])
    worksheet1.addRow(['项目类型', project.project_type || '-'])
    worksheet1.addRow(['服务开始日期', project.service_start_date ? formatDate(project.service_start_date) : '-'])
    worksheet1.addRow(['服务结束日期', project.service_end_date ? formatDate(project.service_end_date) : '-'])
    worksheet1.addRow(['服务金额', formatCurrency(project.service_amount)])
    worksheet1.addRow(['状态', project.status])
    worksheet1.addRow(['创建时间', formatDate(project.created_at)])

    // Sheet2: 服务收入明细
    const incomeRecords = project.accounting_records.filter(record => record.record_type === 'INCOME')
    if (incomeRecords.length > 0) {
      worksheet2.addRow(['日期', '审批单号', '金额', '发票号', '付款方', '备注'])
      incomeRecords.forEach(record => {
        worksheet2.addRow([
          formatDate(record.record_date),
          record.approval_id,
          formatCurrency(record.amount),
          record.invoice_no || '-',
          record.payer || '-',
          record.remark || '-'
        ])
      })
    } else {
      worksheet2.addRow(['暂无收入记录'])
    }

    // Sheet3: 成本明细
    const expenseRecords = project.accounting_records.filter(record => record.record_type === 'EXPENSE')
    if (expenseRecords.length > 0) {
      worksheet3.addRow(['日期', '审批单号', '金额', '类别', '描述', '申请人', '备注'])
      expenseRecords.forEach(record => {
        worksheet3.addRow([
          formatDate(record.record_date),
          record.approval_id,
          formatCurrency(record.amount),
          record.category_id || '-',
          record.description || '-',
          record.applicant || '-',
          record.remark || '-'
        ])
      })
    } else {
      worksheet3.addRow(['暂无成本记录'])
    }

    // 设置响应头
    setHeader(event, 'Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    setHeader(event, 'Content-Disposition', `attachment; filename="${project.project_name}_财务报表.xlsx"`)

    // 返回 Excel 文件
    const buffer = await workbook.xlsx.writeBuffer()
    return buffer
  } catch (error) {
    console.error('导出项目财务报表失败:', error)
    return errorResponse('导出项目财务报表失败')
  }
})

// 格式化日期
const formatDate = (date: Date): string => {
  if (!date) return '-'
  const d = new Date(date)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// 格式化金额
const formatCurrency = (amount: any): string => {
  if (!amount) return '-'
  const num = typeof amount === 'string' ? parseFloat(amount) : Number(amount)
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY'
  }).format(num)
}
