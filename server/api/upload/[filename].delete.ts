import { success, error } from '~/server/utils/response'
import { deleteFile } from '~/server/utils/upload'

export default defineEventHandler(async (event) => {
  try {
    const filename = event.context.params?.filename

    await deleteFile(filename!)

    return success(null, '删除成功')
  } catch (err) {
    console.error('文件删除失败:', err)
    return error('文件删除失败')
  }
})
