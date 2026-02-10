import fs from 'fs'
import path from 'path'

export default defineEventHandler(async (event) => {
  try {
    const formData = await readMultipartFormData(event)
    if (!formData) {
      return errorResponse('请选择要上传的文件')
    }

    const file = formData.find(item => item.name === 'file')
    if (!file) {
      return errorResponse('请选择要上传的文件')
    }

    // 验证文件类型
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf']
    if (!allowedTypes.includes(file.type || '')) {
      return errorResponse('只允许上传 JPG、PNG 图片或 PDF 文件')
    }

    // 验证文件大小（10MB）
    const maxSize = 10 * 1024 * 1024
    if (file.data.length > maxSize) {
      return errorResponse('文件大小不能超过 10MB')
    }

    // 生成唯一文件名
    const timestamp = Date.now()
    const randomStr = Math.random().toString(36).substring(2, 8)
    const ext = file.filename?.split('.').pop() || 'bin'
    const filename = `${timestamp}_${randomStr}.${ext}`

    // 保存文件到 uploads 目录
    const uploadPath = path.join(process.cwd(), 'uploads', filename)
    fs.writeFileSync(uploadPath, file.data)

    // 返回文件信息
    const fileUrl = `/api/upload/${filename}`
    return successResponse({
      url: fileUrl,
      filename: filename,
      originalName: file.filename,
      size: file.data.length,
      type: file.type
    })
  } catch (error) {
    console.error('文件上传失败:', error)
    return errorResponse('文件上传失败')
  }
})
