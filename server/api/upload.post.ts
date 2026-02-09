import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { randomUUID } from 'crypto'
import { error, success } from '../utils/response'

export default defineEventHandler(async (event) => {
  const formData = await readMultipartFormData(event)

  // 找到所有文件（支持多个文件上传）
  const files = formData?.filter(f => f.name === 'files' || f.name === 'file')

  if (!files || files.length === 0) {
    return error('未选择文件')
  }

  // 允许的文件类型
  const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']

  // 最大文件大小 (10MB)
  const maxFileSize = 10 * 1024 * 1024

  const uploadedFiles = []

  for (const file of files) {
    // 检查文件大小
    if (file.data.length > maxFileSize) {
      return error('文件大小不能超过10MB')
    }

    // 检查文件类型
    if (!allowedTypes.includes(file.type || '')) {
      return error('仅支持jpg/png/pdf/doc/docx/xls/xlsx格式')
    }

    // 生成文件名
    const ext = file.filename?.split('.').pop() || 'bin'
    const filename = `${randomUUID()}.${ext}`

    // 保存文件
    const uploadDir = join(process.cwd(), 'uploads')
    await mkdir(uploadDir, { recursive: true })
    await writeFile(join(uploadDir, filename), file.data)

    const url = `/api/upload/${filename}`
    uploadedFiles.push({
      filename: file.filename || filename,
      original_filename: file.filename,
      url,
      type: file.type,
      size: file.data.length
    })
  }

  return success(uploadedFiles)
})
