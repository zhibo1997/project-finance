import { writeFile, mkdir } from 'fs/promises'
import { createReadStream, existsSync } from 'fs'
import { join } from 'path'
import ExcelJS from 'exceljs'
import prisma from '../../../utils/db'
import { error } from '../../../utils/response'

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id

  if (!id) {
    return error('项目ID不能为空')
  }

  try {
    const project = await prisma.projects.findUnique({
      where: { id },
      include: {
        project_members: true,
        accounting_records: true
      }
    })

    if (!project) {
      return error('项目不存在')
    }

    // 创建 Excel 工作簿
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('项目信息')

    // 设置列宽
    worksheet.columns = [
      { header: '项目名称', key: 'project_name', width: 30 },
      { header: '项目负责人', key: 'project_leader', width: 15 },
      { header: '客户名称', key: 'client_name', width: 30 },
      { header: '项目类型', key: 'project_type', width: 15 },
      { header: '服务开始日期', key: 'service_start_date', width: 20 },
      { header: '服务结束日期', key: 'service_end_date', width: 20 },
      { header: '服务金额', key: 'service_amount', width: 15 },
      { header: '状态', key: 'status', width: 10 }
    ]

    // 写入项目信息
    worksheet.addRow({
      project_name: project.project_name,
      project_leader: project.project_leader,
      client_name: project.client_name,
      project_type: project.project_type,
      service_start_date: project.service_start_date?.toLocaleDateString(),
      service_end_date: project.service_end_date?.toLocaleDateString(),
      service_amount: project.service_amount,
      status: getStatusText(project.status)
    })

    // 创建项目成员工作表
    const membersSheet = workbook.addWorksheet('项目成员')
    membersSheet.columns = [
      { header: '姓名', key: 'user_name', width: 15 },
      { header: '角色', key: 'role', width: 10 }
    ]

    project.project_members.forEach(member => {
      membersSheet.addRow({
        user_name: member.user_name,
        role: member.role === 'manager' ? '经理' : '成员'
      })
    })

    // 创建记账记录工作表
    const recordsSheet = workbook.addWorksheet('记账记录')
    recordsSheet.columns = [
      { header: '类型', key: 'record_type', width: 10 },
      { header: '审批单ID', key: 'approval_id', width: 20 },
      { header: '日期', key: 'record_date', width: 20 },
      { header: '金额', key: 'amount', width: 15 },
      { header: '费用类别', key: 'category_name', width: 20 },
      { header: '用途说明', key: 'description', width: 30 },
      { header: '申请人', key: 'applicant', width: 15 },
      { header: '记账人', key: 'created_by_name', width: 15 }
    ]

    project.accounting_records.forEach(record => {
      recordsSheet.addRow({
        record_type: record.record_type === 'income' ? '收入' : '支出',
        approval_id: record.approval_id,
        record_date: record.record_date.toLocaleDateString(),
        amount: record.amount,
        category_name: record.category_id,
        description: record.description,
        applicant: record.applicant,
        created_by_name: record.created_by_name
      })
    })

    // 保存文件到临时目录
    const tempDir = join(process.cwd(), 'temp')
    await mkdir(tempDir, { recursive: true }).catch(() => {}) // 确保目录存在

    const filename = `项目-${project.project_name}-${new Date().toISOString().split('T')[0]}.xlsx`
    const filepath = join(tempDir, filename)

    await workbook.xlsx.writeFile(filepath)

    // 返回文件
    return sendStream(event, createReadStream(filepath))
  } catch (error: any) {
    console.error('导出Excel失败:', error)
    return error('导出Excel失败: ' + error.message)
  }
})

const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    draft: '草稿',
    submitted: '已提交',
    completed: '已完成',
    closed: '已结项'
  }
  return statusMap[status] || status
}
