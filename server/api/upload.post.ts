import { success, error } from '~/server/utils/response'
import { saveFile } from '~/server/utils/upload'

export default defineEventHandler(async (event) => {
  try {
    const formData = await readMultipartFormData(event)
    const file = formData?.find(f => f.name === 'file')

    if (!file) {
      return error('未选择文件')
    }

    const filename = await saveFile(file)

    const url = `/api/upload/${filename}`
    return success({ filename, url })
  } catch (err: any) {
    console.error('文件上传失败:', err)
    return error(err.message || '文件上传失败')
  }
})
