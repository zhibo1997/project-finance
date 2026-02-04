import { unlink } from 'fs/promises'
import { existsSync } from 'fs'
import { join } from 'path'
import { error, success } from '../../utils/response'

export default defineEventHandler(async (event) => {
  const filename = event.context.params?.filename
  const filepath = join(process.cwd(), 'uploads', filename!)

  if (!existsSync(filepath)) {
    return error('文件不存在')
  }

  await unlink(filepath)
  return success(null, '删除成功')
})
