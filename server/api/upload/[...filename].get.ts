import fs from 'fs'
import path from 'path'

export default defineEventHandler(async (event) => {
  try {
    const filename = getRouterParam(event, 'filename')
    if (!filename) {
      return errorResponse('文件名不能为空')
    }

    const filePath = path.join(process.cwd(), 'uploads', filename)

    if (!fs.existsSync(filePath)) {
      return errorResponse('文件不存在')
    }

    const fileContent = fs.readFileSync(filePath)
    const ext = filename.split('.').pop()?.toLowerCase()

    let contentType = 'application/octet-stream'
    if (ext === 'jpg' || ext === 'jpeg') {
      contentType = 'image/jpeg'
    } else if (ext === 'png') {
      contentType = 'image/png'
    } else if (ext === 'pdf') {
      contentType = 'application/pdf'
    }

    setHeader(event, 'Content-Type', contentType)
    setHeader(event, 'Content-Disposition', `inline; filename="${filename}"`)

    return fileContent
  } catch (error) {
    console.error('文件读取失败:', error)
    return errorResponse('文件读取失败')
  }
})
