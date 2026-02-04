import prisma from '~/server/utils/db'
import { success, error } from '~/server/utils/response'

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id

  if (!id) {
    return error('配置ID不能为空')
  }

  try {
    await prisma.employee_cost_config.delete({
      where: { id }
    })

    return success(null, '删除成功')
  } catch (error: any) {
    console.error('删除员工成本配置失败:', error)
    return error('删除员工成本配置失败: ' + error.message)
  }
})
