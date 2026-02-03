import { writeFile, mkdir, unlink } from 'fs/promises'
import { join } from 'path'
import { randomUUID } from 'crypto'

// 文件上传目录
const UPLOAD_DIR = join(process.cwd(), 'uploads')

// 允许上传的文件类型
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'application/pdf']

// 文件大小限制（10MB）
const MAX_FILE_SIZE = 10 * 1024 * 1024

// 确保上传目录存在
async function ensureUploadDir() {
  try {
    await mkdir(UPLOAD_DIR, { recursive: true })
  } catch (error) {
    console.error('创建上传目录失败:', error)
  }
}

// 验证文件
export function validateFile(file: any) {
  if (!file) {
    throw new Error('未选择文件')
  }

  if (file.data.length > MAX_FILE_SIZE) {
    throw new Error('文件大小不能超过10MB')
  }

  if (!ALLOWED_TYPES.includes(file.type || '')) {
    throw new Error('仅支持jpg/png/pdf格式')
  }
}

// 保存文件
export async function saveFile(file: any): Promise<string> {
  await ensureUploadDir()

  validateFile(file)

  // 生成文件名
  const ext = file.filename?.split('.').pop() || 'bin'
  const filename = `${randomUUID()}.${ext}`

  // 保存文件
  const filepath = join(UPLOAD_DIR, filename)
  await writeFile(filepath, file.data)

  return filename
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
