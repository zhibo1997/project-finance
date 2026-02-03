# 模块E：文件上传功能开发

## 概述

模块E负责文件上传功能，支持记账凭证附件上传，包括图片（jpg/png）和PDF文件，单文件大小限制为10MB。初期使用本地服务器存储，后期可扩展到云存储。

## 技术架构

- **前端框架**: Vue 3 + TypeScript + Vite
- **UI组件**: Tailwind CSS + Lucide图标
- **存储方案**: 本地 `/uploads` 目录（初期）
- **文件类型**: 支持 jpg/png/pdf
- **大小限制**: 10MB

## 修改文件列表

### 1. 新增文件

#### 类型定义
- `src/types/upload.ts` - 文件上传相关类型定义

#### 工具函数
- `src/utils/upload.ts` - 文件验证和格式化工具函数

#### API接口
- `src/api/upload.ts` - 文件上传API接口

#### 组合式函数
- `src/composables/useFileUpload.ts` - 文件上传逻辑

#### UI组件
- `src/components/FileUpload.vue` - 文件上传组件

#### 页面组件
- `src/pages/AccountingPage.vue` - 记账管理页面

#### 其他
- `src/server/routes/upload.ts` - 后端上传路由
- `src/server/utils/storage.ts` - 文件存储管理工具

### 2. 修改文件

#### 路由配置
- `src/router/index.ts` - 添加记账管理路由

#### 导航菜单
- `src/pages/HomePage.vue` - 添加记账管理导航项

#### 数据库管理
- `src/server/utils/db.ts` - 修复类型错误

#### 类型配置
- `tsconfig.json` - 添加Node.js类型声明

## 技术点详解

### 文件类型验证

```typescript
// src/utils/upload.ts
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
```

### 文件上传API

```typescript
// src/api/upload.ts
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
```

### 文件上传逻辑

```typescript
// src/composables/useFileUpload.ts
export function useFileUpload() {
  const files = ref<FileInfo[]>([])
  const status = ref<UploadStatus>('idle')
  const error = ref<string | null>(null)
  const progress = ref<number>(0)

  const handleFile = async (file: File) => {
    const validationError = validateFile(file)
    if (validationError) {
      status.value = 'error'
      error.value = getValidationErrorText(validationError)
      return
    }
    // 上传逻辑
  }

  return {
    files,
    status,
    error,
    progress,
    handleFile
  }
}
```

### 文件上传组件

```vue
<!-- src/components/FileUpload.vue -->
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
    <!-- 文件列表 -->
    <div v-if="hasFiles" class="mt-4 space-y-2">
      <h4 class="text-sm font-semibold text-gray-700">已上传文件</h4>
      <div
        v-for="file in files"
        :key="file.id"
        :class="fileItemClass"
      >
        <div :class="previewClass">
          <Image v-if="file.type.startsWith('image/')" class="w-5 h-5 text-gray-400" />
          <FileText v-else class="w-5 h-5 text-gray-400" />
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-800 truncate">{{ file.name }}</p>
          <p class="text-xs text-gray-500">{{ formatSize(file.size) }}</p>
        </div>
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
  </div>
</template>
```

## 功能特性

1. **拖拽上传**：支持将文件拖拽到上传区域
2. **点击选择**：支持点击上传区域选择文件
3. **文件预览**：图片文件和PDF文件支持预览
4. **文件删除**：支持删除已上传的文件
5. **类型验证**：只允许上传jpg/png/pdf格式的文件
6. **大小限制**：单文件大小不超过10MB
7. **进度显示**：显示文件上传进度
8. **错误处理**：提供详细的错误信息和用户反馈

## 使用方法

在需要文件上传功能的组件中，引入FileUpload组件：

```vue
<template>
  <div>
    <h3>记账凭证附件</h3>
    <FileUpload
      v-model:files="attachmentFiles"
      @update:files="handleAttachmentFilesChange"
    />
  </div>
</template>

<script setup lang="ts">
import FileUpload from '@/components/FileUpload.vue'
import type { FileInfo } from '@/types/upload'

const attachmentFiles = ref<FileInfo[]>([])

const handleAttachmentFilesChange = (files: FileInfo[]) => {
  console.log('附件文件变更:', files)
}
</script>
```

## 未来优化

1. **云存储支持**：后期可扩展到华为云OBS等云存储服务
2. **多文件上传**：支持同时上传多个文件
3. **断点续传**：支持大文件断点续传
4. **文件压缩**：对图片文件进行压缩处理
5. **文件加密**：对敏感文件进行加密存储
