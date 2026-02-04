import prisma from '../../utils/db'
import { success, error } from '../../utils/response'

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id

  if (!id) {
    return error('项目ID不能为空')
  }

  const project = await prisma.projects.findUnique({
    where: { id },
    include: {
      project_members: true,
      accounting_records: true
    }
  })

  if (!project) {
    return error('项目不存在')
  }

  return success(project)
})
