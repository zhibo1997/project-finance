import type { AllowedFileTypes, FileValidationError } from '../types/upload'

// 允许上传的文件类型
const ALLOWED_TYPES: AllowedFileTypes[] = ['image/jpeg', 'image/png', 'application/pdf']

// 最大文件大小（10MB）
const MAX_FILE_SIZE = 10 * 1024 * 1024

// 生成唯一文件名
export function generateUniqueFilename(originalFilename: string): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substr(2, 9)
  const ext = originalFilename.split('.').pop() || 'bin'
  return `${timestamp}_${random}.${ext}`
}

// 验证文件类型和大小
export function validateFile(file: File): FileValidationError | null {
  if (!file || file.size === 0) {
    return 'FILE_EMPTY'
  }

  if (file.size > MAX_FILE_SIZE) {
    return 'FILE_TOO_LARGE'
  }

  if (!ALLOWED_TYPES.includes(file.type as AllowedFileTypes)) {
    return 'FILE_TYPE_NOT_ALLOWED'
  }

  return null
}

// 获取文件验证错误信息
export function getValidationErrorText(error: FileValidationError): string {
  const errorMessages: Record<FileValidationError, string> = {
    FILE_TOO_LARGE: '文件大小不能超过10MB',
    FILE_TYPE_NOT_ALLOWED: '仅支持jpg/png/pdf格式',
    FILE_EMPTY: '请选择有效的文件',
    UNKNOWN_ERROR: '文件验证失败'
  }

  return errorMessages[error] || errorMessages.UNKNOWN_ERROR
}

// 格式化文件大小
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'

  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 检查是否是图片类型
export function isImageType(type: string): boolean {
  return type.startsWith('image/')
}

// 检查是否是PDF类型
export function isPdfType(type: string): boolean {
  return type === 'application/pdf'
}
