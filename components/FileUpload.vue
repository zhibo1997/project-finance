<template>
  <div class="file-upload">
    <div class="upload-area" @click="triggerFileInput" @dragover="handleDragOver" @drop="handleDrop">
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="17 8 12 3 7 8"></polyline>
        <line x1="12" y1="3" x2="12" y2="15"></line>
      </svg>
      <p>点击或拖拽文件到此处上传</p>
      <p class="hint">支持 jpg、png、pdf 格式，文件大小不超过 10MB</p>
    </div>

    <input
      ref="fileInputRef"
      type="file"
      accept=".jpg,.jpeg,.png,.pdf"
      @change="handleFileChange"
      hidden
    />

    <div class="uploaded-files" v-if="uploadedFiles.length > 0">
      <h3>已上传文件</h3>
      <div v-for="(file, index) in uploadedFiles" :key="index" class="file-item">
        <div class="file-info">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
            <polyline points="13 2 13 9 20 9"></polyline>
          </svg>
          <span>{{ file.name }}</span>
        </div>
        <button @click="removeFile(index)" class="btn btn-secondary">删除</button>
      </div>
    </div>

    <div class="upload-progress" v-if="uploading">
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: `${progress}%` }"></div>
      </div>
      <p>{{ progressText }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  modelValue?: string[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string[]]
}>()

const fileInputRef = ref<HTMLInputElement | null>(null)
const uploading = ref(false)
const progress = ref(0)
const progressText = ref('')
const uploadedFiles = ref<string[]>(props.modelValue || [])

watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    uploadedFiles.value = newValue
  }
})

const triggerFileInput = () => {
  fileInputRef.value?.click()
}

const handleFileChange = async (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files.length > 0) {
    const file = input.files[0]
    await uploadFile(file)
  }
}

const handleDragOver = (event: DragEvent) => {
  event.preventDefault()
}

const handleDrop = async (event: DragEvent) => {
  event.preventDefault()
  if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
    const file = event.dataTransfer.files[0]
    await uploadFile(file)
  }
}

const uploadFile = async (file: File) => {
  // 检查文件类型
  const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf']
  if (!allowedTypes.includes(file.type)) {
    alert('只支持 jpg、png、pdf 格式的文件')
    return
  }

  // 检查文件大小
  const maxSize = 10 * 1024 * 1024 // 10MB
  if (file.size > maxSize) {
    alert('文件大小不能超过 10MB')
    return
  }

  // 模拟上传过程
  uploading.value = true
  progress.value = 0
  progressText.value = '上传中...'

  // 模拟进度
  const interval = setInterval(() => {
    progress.value += Math.floor(Math.random() * 20)
    if (progress.value > 90) {
      progress.value = 90
      clearInterval(interval)
    }
  }, 200)

  // 创建 FormData 对象
  const formData = new FormData()
  formData.append('file', file)

  try {
    // 上传文件
    const response = await $fetch('/api/upload', {
      method: 'POST',
      body: formData
    })

    if (response?.code === 0) {
      // 上传成功
      uploadedFiles.value.push(response.data.url)
      emit('update:modelValue', uploadedFiles.value)
      progress.value = 100
      progressText.value = '上传成功'
      setTimeout(() => {
        uploading.value = false
        progress.value = 0
        progressText.value = ''
      }, 1000)
    } else {
      // 上传失败
      alert(response?.message || '上传失败')
      uploading.value = false
      progress.value = 0
      progressText.value = ''
    }
  } catch (error) {
    console.error('文件上传失败:', error)
    alert('文件上传失败')
    uploading.value = false
    progress.value = 0
    progressText.value = ''
  } finally {
    clearInterval(interval)
  }
}

const removeFile = (index: number) => {
  const filename = uploadedFiles.value[index].split('/').pop()
  uploadedFiles.value.splice(index, 1)
  emit('update:modelValue', uploadedFiles.value)
  // 可以添加删除文件的 API 调用
  if (filename) {
    $fetch(`/api/upload/${filename}`, {
      method: 'DELETE'
    }).catch(error => {
      console.error('删除文件失败:', error)
    })
  }
}
</script>

<style scoped>
.file-upload {
  margin-bottom: 16px;
}

.upload-area {
  border: 2px dashed #d9d9d9;
  border-radius: 4px;
  padding: 40px 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  background-color: #fafafa;
}

.upload-area:hover {
  border-color: #1890ff;
  background-color: #e6f7ff;
}

.upload-area svg {
  color: #d9d9d9;
  margin-bottom: 16px;
}

.upload-area:hover svg {
  color: #1890ff;
}

.upload-area p {
  margin: 0 0 8px 0;
  color: #666;
}

.hint {
  font-size: 12px;
  color: #999;
}

.uploaded-files {
  margin-top: 16px;
}

.uploaded-files h3 {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: #333;
}

.file-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background-color: #fafafa;
  border-radius: 4px;
  margin-bottom: 8px;
}

.file-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.file-info svg {
  color: #1890ff;
}

.file-info span {
  font-size: 14px;
  color: #333;
}

.upload-progress {
  margin-top: 16px;
}

.progress-bar {
  width: 100%;
  height: 4px;
  background-color: #d9d9d9;
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-fill {
  height: 100%;
  background-color: #1890ff;
  border-radius: 2px;
  transition: width 0.3s;
}

.progress-text {
  font-size: 14px;
  color: #666;
  text-align: center;
  margin: 0;
}

@media (max-width: 768px) {
  .upload-area {
    padding: 20px;
  }

  .file-item {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
