<template>
  <div class="space-y-4">
    <!-- 上传区域 -->
    <div
      class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
      @click="triggerFileInput"
      @drop="handleDrop"
      @dragover="handleDragOver"
      @dragleave="handleDragLeave"
      :class="{ 'border-blue-500 bg-blue-50': isDragging }"
    >
      <div class="text-gray-500 text-4xl mb-4">📁</div>
      <p class="text-gray-600 mb-2">点击或拖拽文件到此处上传</p>
      <p class="text-sm text-gray-400">支持 JPG、PNG、PDF 格式，文件大小不超过 10MB</p>
      <input
        ref="fileInputRef"
        type="file"
        accept=".jpg,.jpeg,.png,.pdf"
        @change="handleFileChange"
        class="hidden"
      />
    </div>

    <!-- 已上传文件列表 -->
    <div v-if="files.length > 0" class="space-y-2">
      <h4 class="text-sm font-medium text-gray-900">已上传文件</h4>
      <div
        v-for="(file, index) in files"
        :key="index"
        class="flex items-center justify-between bg-gray-50 rounded-lg p-3"
      >
        <div class="flex items-center space-x-3">
          <div class="text-gray-500 text-lg">
            {{ getFileIcon(file.type) }}
          </div>
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-900">{{ file.originalName }}</p>
            <p class="text-xs text-gray-500">{{ formatFileSize(file.size) }}</p>
          </div>
        </div>
        <div class="flex space-x-2">
          <NButton size="small" @click="handleDownload(file)">
            下载
          </NButton>
          <NButton type="error" size="small" @click="handleRemove(index)">
            删除
          </NButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'

interface FileItem {
  url: string
  filename: string
  originalName: string
  size: number
  type: string
}

interface Props {
  modelValue?: string[]
  accept?: string
  maxSize?: number
}

const props = withDefaults(defineProps<Props>(), {
  accept: '.jpg,.jpeg,.png,.pdf',
  maxSize: 10 * 1024 * 1024
})

const emit = defineEmits(['update:modelValue'])

const fileInputRef = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)
const files = ref<FileItem[]>([])

const { apiFetch } = useApi()

// 监听 modelValue 变化
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue && newValue.length > 0) {
      // 简单处理，实际项目中可能需要根据 URL 重新获取文件信息
      files.value = newValue.map(url => ({
        url,
        filename: url.split('/').pop() || '',
        originalName: url.split('/').pop() || '',
        size: 0,
        type: ''
      }))
    }
  },
  { immediate: true }
)

// 触发文件选择
const triggerFileInput = () => {
  fileInputRef.value?.click()
}

// 文件选择处理
const handleFileChange = async (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    await uploadFile(target.files[0])
  }
}

// 拖拽处理
const handleDragOver = (event: DragEvent) => {
  event.preventDefault()
  isDragging.value = true
}

const handleDragLeave = () => {
  isDragging.value = false
}

const handleDrop = async (event: DragEvent) => {
  event.preventDefault()
  isDragging.value = false

  if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
    await uploadFile(event.dataTransfer.files[0])
  }
}

// 文件上传
const uploadFile = async (file: File) => {
  // 验证文件类型
  const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf']
  if (!allowedTypes.includes(file.type)) {
    useMessage().error('只允许上传 JPG、PNG 图片或 PDF 文件')
    return
  }

  // 验证文件大小
  if (file.size > props.maxSize) {
    useMessage().error('文件大小不能超过 10MB')
    return
  }

  // 创建 FormData
  const formData = new FormData()
  formData.append('file', file)

  try {
    const response = await apiFetch('/api/upload', {
      method: 'POST',
      body: formData
    })

    if (response.code === 0) {
      files.value.push(response.data)
      emit('update:modelValue', files.value.map(f => f.url))
      useMessage().success('文件上传成功')
    }
  } catch (error) {
    console.error('文件上传失败:', error)
  }
}

// 文件下载
const handleDownload = (file: FileItem) => {
  window.open(file.url, '_blank')
}

// 文件删除
const handleRemove = async (index: number) => {
  const file = files.value[index]
  try {
    await apiFetch(`/api/upload/${file.filename}`, {
      method: 'DELETE'
    })
    files.value.splice(index, 1)
    emit('update:modelValue', files.value.map(f => f.url))
    useMessage().success('文件删除成功')
  } catch (error) {
    console.error('文件删除失败:', error)
  }
}

// 获取文件图标
const getFileIcon = (type: string) => {
  if (!type) return '📄'

  if (type.includes('image')) {
    return '🖼️'
  } else if (type.includes('pdf')) {
    return '📕'
  } else {
    return '📄'
  }
}

// 格式化文件大小
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'

  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
</script>
