import prisma from '../../../utils/db'
import { success, error } from '../../../utils/response'

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id
  const original = await prisma.projects.findUnique({ where: { id } })

  if (!original) {
    return error('项目不存在')
  }

  try {
    const formData = original.form_data as any
    formData.basicInfo.projectName = `${formData.basicInfo.projectName} copy`

    const newProject = await prisma.projects.create({
      data: {
        ...original,
        id: undefined, // 让 Prisma 自动生成新的 UUID
        status: 'draft',
        form_data: formData,
        created_at: new Date(),
        updated_at: new Date()
      }
    })

    // 复制项目成员
    const members = await prisma.project_members.findMany({
      where: { project_id: id }
    })

    if (members.length > 0) {
      await prisma.project_members.createMany({
        data: members.map(member => ({
          ...member,
          id: undefined,
          project_id: newProject.id,
          created_at: new Date()
        }))
      })
    }

    return success(newProject)
  } catch (error: any) {
    console.error('复制项目失败:', error)
    return error('复制项目失败: ' + error.message)
  }
})
