import { readFile } from 'fs/promises'
import { join } from 'path'
import { error } from '~/server/utils/response'

export default defineEventHandler(async (event) => {
  const filename = event.context.params?.filename

  if (!filename) {
    return error('文件名不能为空')
  }

  try {
    const filePath = join(process.cwd(), 'uploads', filename)
    const fileData = await readFile(filePath)

    // 设置响应头
    event.node.res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
    event.node.res.setHeader('Content-Type', 'application/octet-stream')

    return fileData
  } catch (error: any) {
    console.error('下载文件失败:', error)
    return error('文件不存在或下载失败')
  }
})
