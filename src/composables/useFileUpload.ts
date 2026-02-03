import { ref, computed } from 'vue'
import type { FileInfo, UploadStatus, FileValidationError } from '../types/upload'
import { validateFile, getValidationErrorText, formatFileSize } from '../utils/upload'
import { uploadFile, deleteFile, getFilePreviewUrl } from '../api/upload'

export function useFileUpload() {
  // 响应式状态
  const files = ref<FileInfo[]>([])
  const status = ref<UploadStatus>('idle')
  const error = ref<string | null>(null)
  const progress = ref<number>(0)

  // 计算属性
  const isUploading = computed(() => status.value === 'uploading')
  const isSuccess = computed(() => status.value === 'success')
  const isError = computed(() => status.value === 'error')

  // 验证并上传文件
  const handleFile = async (file: File) => {
    // 重置状态
    status.value = 'idle'
    error.value = null
    progress.value = 0

    // 验证文件
    const validationError = validateFile(file)
    if (validationError) {
      status.value = 'error'
      error.value = getValidationErrorText(validationError)
      return
    }

    try {
      // 开始上传
      status.value = 'uploading'
      progress.value = 0

      // 模拟上传进度（实际项目中可通过XMLHttpRequest实现）
      const progressInterval = setInterval(() => {
        if (progress.value < 90) {
          progress.value += Math.random() * 10
        }
      }, 200)

      // 上传文件
      const response = await uploadFile({ file })

      clearInterval(progressInterval)
      progress.value = 100
      status.value = 'success'

      // 添加到文件列表
      files.value.push(response.data)
    } catch (err: any) {
      status.value = 'error'
      error.value = err.message || '上传失败'
    }
  }

  // 删除文件
  const removeFile = async (filename: string) => {
    try {
      await deleteFile(filename)
      files.value = files.value.filter(file => file.filename !== filename)
    } catch (err: any) {
      console.error('删除文件失败:', err)
      error.value = err.message || '删除失败'
    }
  }

  // 处理文件选择
  const handleFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement
    const selectedFile = target.files?.[0]
    if (selectedFile) {
      handleFile(selectedFile)
    }
  }

  // 处理拖拽上传
  const handleDrop = (event: DragEvent) => {
    event.preventDefault()
    const droppedFile = event.dataTransfer?.files?.[0]
    if (droppedFile) {
      handleFile(droppedFile)
    }
  }

  // 处理拖拽进入
  const handleDragOver = (event: DragEvent) => {
    event.preventDefault()
  }

  // 获取文件预览URL
  const getPreviewUrl = (filename: string) => {
    return getFilePreviewUrl(filename)
  }

  // 格式化文件大小
  const formatSize = (bytes: number) => {
    return formatFileSize(bytes)
  }

  return {
    files,
    status,
    error,
    progress,
    isUploading,
    isSuccess,
    isError,
    handleFile,
    removeFile,
    handleFileChange,
    handleDrop,
    handleDragOver,
    getPreviewUrl,
    formatSize
  }
}
