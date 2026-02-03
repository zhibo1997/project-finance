<script setup lang="ts">
import { ref, computed } from 'vue'
import { Upload, FileX, Image, FileText, Trash2, Loader2 } from 'lucide-vue-next'
import { useFileUpload } from '../composables/useFileUpload'

// Props
const props = defineProps<{
  value?: string[]
  multiple?: boolean
  maxFiles?: number
  accept?: string
  disabled?: boolean
}>()

// Emits
const emit = defineEmits<{
  'update:value': [value: string[]]
  'upload-success': [file: any]
  'upload-error': [error: string]
  'remove-file': [filename: string]
}>()

// Composable
const {
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
} = useFileUpload()

// 内部状态
const fileInputRef = ref<HTMLInputElement | null>(null)

// 计算属性
const hasFiles = computed(() => files.value.length > 0)
const canAddMoreFiles = computed(() => {
  if (!props.multiple) return files.value.length === 0
  if (props.maxFiles) return files.value.length < props.maxFiles
  return true
})

// 事件处理
const handleClick = () => {
  if (props.disabled || !canAddMoreFiles.value) return
  fileInputRef.value?.click()
}

const handleRemoveFile = async (filename: string) => {
  await removeFile(filename)
  emit('remove-file', filename)
  emit('update:value', files.value.map(file => file.filename))
}

// 监听文件变化
const updateValue = () => {
  emit('update:value', files.value.map(file => file.filename))
}

// 初始化
const initFiles = () => {
  if (props.value) {
    // 这里可以根据文件名获取文件信息，目前我们简化处理
    files.value = props.value.map(filename => ({
      id: filename,
      name: filename,
      size: 0,
      type: filename.endsWith('.pdf') ? 'application/pdf' : 'image/jpeg',
      url: getPreviewUrl(filename),
      filename,
      createdAt: new Date().toISOString()
    }))
  }
}

// 组件挂载时初始化
initFiles()

// 样式类
const sectionClass = 'bg-white rounded-lg border border-gray-200 p-4'
const inputClass = 'w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors'
const buttonClass = 'flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed'
const fileItemClass = 'flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100'
const previewClass = 'w-10 h-10 rounded flex items-center justify-center bg-white shadow-sm'
</script>

<template>
  <div
    :class="sectionClass"
    @drop="handleDrop"
    @dragover="handleDragOver"
  >
    <!-- 文件上传区域 -->
    <div
      v-if="!hasFiles || canAddMoreFiles"
      class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
      @click="handleClick"
    >
      <Upload class="w-8 h-8 text-gray-400 mx-auto mb-2" />
      <p class="text-sm text-gray-500 mb-1">点击或拖拽文件到此处上传</p>
      <p class="text-xs text-gray-400">支持 jpg/png/pdf 格式，单文件不超过 10MB</p>
    </div>

    <!-- 隐藏的文件输入 -->
    <input
      ref="fileInputRef"
      type="file"
      :accept="accept || 'image/jpeg,image/png,application/pdf'"
      :multiple="multiple"
      class="hidden"
      @change="handleFileChange"
      :disabled="props.disabled || !canAddMoreFiles"
    />

    <!-- 文件列表 -->
    <div v-if="hasFiles" class="mt-4 space-y-2">
      <h4 class="text-sm font-semibold text-gray-700">已上传文件</h4>
      <div
        v-for="file in files"
        :key="file.id"
        :class="fileItemClass"
      >
        <!-- 文件预览 -->
        <div :class="previewClass">
          <Image v-if="file.type.startsWith('image/')" class="w-5 h-5 text-gray-400" />
          <FileText v-else class="w-5 h-5 text-gray-400" />
        </div>

        <!-- 文件信息 -->
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-800 truncate">{{ file.name }}</p>
          <p class="text-xs text-gray-500">{{ formatSize(file.size) }}</p>
        </div>

        <!-- 删除按钮 -->
        <button
          @click="handleRemoveFile(file.filename)"
          class="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
          :disabled="props.disabled"
          title="删除文件"
        >
          <Trash2 class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- 上传进度 -->
    <div v-if="isUploading" class="mt-4">
      <div class="flex items-center gap-2 mb-2">
        <Loader2 class="w-4 h-4 text-blue-500 animate-spin" />
        <span class="text-sm text-blue-600">正在上传...</span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-2">
        <div
          class="bg-blue-500 h-2 rounded-full transition-all duration-300"
          :style="{ width: `${progress}%` }"
        ></div>
      </div>
      <p class="text-xs text-gray-500 mt-1">{{ Math.round(progress) }}%</p>
    </div>

    <!-- 上传成功 -->
    <div v-if="isSuccess" class="mt-4 text-sm text-green-600 flex items-center gap-2">
      <div class="w-4 h-4 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
        <span class="text-xs font-bold">✓</span>
      </div>
      上传成功
    </div>

    <!-- 上传错误 -->
    <div v-if="isError" class="mt-4 text-sm text-red-600 flex items-center gap-2">
      <FileX class="w-4 h-4" />
      {{ error }}
    </div>

    <!-- 提示信息 -->
    <div v-if="!canAddMoreFiles && !hasFiles" class="mt-4 text-sm text-gray-500">
      已达到最大文件数量限制
    </div>
  </div>
</template>

<style scoped>
/* 组件内部样式 */
</style>
