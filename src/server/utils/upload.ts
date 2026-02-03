import { writeFile, mkdir, unlink } from 'fs/promises'
import { join } from 'path'
import { randomUUID } from 'crypto'

// 文件上传配置
const UPLOAD_DIR = join(process.cwd(), 'uploads')
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'application/pdf']

// 上传文件
export async function uploadFile(file: any): Promise<{ filename: string; url: string }> {
  // 检查文件大小
  if (file.data.length > MAX_FILE_SIZE) {
    throw new Error('文件大小不能超过10MB')
  }

  // 检查文件类型
  if (!ALLOWED_TYPES.includes(file.type || '')) {
    throw new Error('仅支持jpg/png/pdf格式')
  }

  // 生成文件名
  const ext = file.filename?.split('.').pop() || 'bin'
  const filename = `${randomUUID()}.${ext}`

  // 保存文件
  await mkdir(UPLOAD_DIR, { recursive: true })
  await writeFile(join(UPLOAD_DIR, filename), file.data)

  const url = `/api/upload/${filename}`
  return { filename, url }
}

// 删除文件
export async function deleteFile(filename: string): Promise<void> {
  const filepath = join(UPLOAD_DIR, filename)
  try {
    await unlink(filepath)
  } catch (error) {
    console.error('删除文件失败:', error)
  }
}

// 获取文件路径
export function getFilePath(filename: string): string {
  return join(UPLOAD_DIR, filename)
}
