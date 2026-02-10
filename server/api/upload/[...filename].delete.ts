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

    fs.unlinkSync(filePath)

    return successResponse(null, '文件删除成功')
  } catch (error) {
    console.error('文件删除失败:', error)
    return errorResponse('文件删除失败')
  }
})
