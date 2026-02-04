import prisma from '../../utils/db'
import { success, error } from '../../utils/response'

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id

  if (!id) {
    return error('项目ID不能为空')
  }

  try {
    await prisma.projects.delete({
      where: { id }
    })

    return success(null, '删除成功')
  } catch (error: any) {
    console.error('删除项目失败:', error)
    return error('删除项目失败: ' + error.message)
  }
})
