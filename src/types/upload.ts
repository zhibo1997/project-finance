// 文件上传相关类型定义

// 文件信息类型
export interface FileInfo {
  id: string
  name: string
  size: number
  type: string
  url: string
  filename: string
  createdAt: string
}

// 文件上传请求参数类型
export interface UploadRequest {
  file: File
}

// 文件上传响应类型
export interface UploadResponse {
  code: number
  message: string
  data: FileInfo
}

// 文件删除响应类型
export interface DeleteResponse {
  code: number
  message: string
}

// 允许上传的文件类型
export type AllowedFileTypes = 'image/jpeg' | 'image/png' | 'application/pdf'

// 文件验证错误类型
export type FileValidationError =
  | 'FILE_TOO_LARGE'
  | 'FILE_TYPE_NOT_ALLOWED'
  | 'FILE_EMPTY'
  | 'UNKNOWN_ERROR'

// 文件上传状态类型
export type UploadStatus = 'idle' | 'uploading' | 'success' | 'error'
