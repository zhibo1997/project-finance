import type { UploadRequest, UploadResponse, DeleteResponse } from '../types/upload'

// 文件上传接口
export async function uploadFile(request: UploadRequest): Promise<UploadResponse> {
  const formData = new FormData()
  formData.append('file', request.file)

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData
  })

  if (!response.ok) {
    throw new Error('上传失败')
  }

  return await response.json()
}

// 文件删除接口
export async function deleteFile(filename: string): Promise<DeleteResponse> {
  const response = await fetch(`/api/upload/${filename}`, {
    method: 'DELETE'
  })

  if (!response.ok) {
    throw new Error('删除失败')
  }

  return await response.json()
}

// 文件下载接口
export async function downloadFile(filename: string): Promise<Blob> {
  const response = await fetch(`/api/upload/${filename}`)

  if (!response.ok) {
    throw new Error('下载失败')
  }

  return await response.blob()
}

// 获取文件预览URL
export function getFilePreviewUrl(filename: string): string {
  return `/api/upload/${filename}`
}
