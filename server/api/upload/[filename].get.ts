import { createReadStream, existsSync } from 'fs'
import { join } from 'path'

export default defineEventHandler(async (event) => {
  try {
    const filename = event.context.params?.filename
    const filepath = join(process.cwd(), 'uploads', filename!)

    if (!existsSync(filepath)) {
      throw createError({ statusCode: 404, message: '文件不存在' })
    }

    return sendStream(event, createReadStream(filepath))
  } catch (err) {
    console.error('文件下载失败:', err)
    throw err
  }
})
