<template>
  <div class="max-w-4xl mx-auto space-y-8">
    <!-- 页面标题 -->
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold text-gray-800">项目立项申请</h1>
    </div>

    <!-- 项目立项表单 -->
    <div class="bg-white rounded-lg shadow-sm p-8">
      <form @submit.prevent="submitApplication">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- 项目基本信息 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">项目名称 *</label>
            <input
              v-model="formData.name"
              required
              placeholder="请输入项目名称"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">项目类型 *</label>
            <select
              v-model="formData.project_type"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">请选择项目类型</option>
              <option value="软件">软件</option>
              <option value="硬件">硬件</option>
              <option value="服务">服务</option>
              <option value="其他">其他</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">项目负责人 *</label>
            <input
              v-model="formData.manager"
              required
              placeholder="请输入项目负责人"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">联系方式 *</label>
            <input
              v-model="formData.contact"
              required
              placeholder="请输入联系方式"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">预计开始时间 *</label>
            <input
              type="date"
              v-model="formData.start_date"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">预计结束时间 *</label>
            <input
              type="date"
              v-model="formData.end_date"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">预计预算 (元) *</label>
            <input
              type="number"
              v-model="formData.budget"
              required
              step="0.01"
              placeholder="请输入预计预算"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">项目状态</label>
            <select
              v-model="formData.status"
              disabled
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
            >
              <option value="pending">待审批</option>
            </select>
          </div>
        </div>

        <!-- 项目描述 -->
        <div class="mt-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">项目描述 *</label>
          <textarea
            v-model="formData.description"
            required
            rows="4"
            placeholder="请详细描述项目背景、目标和范围"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        <!-- 项目成员 -->
        <div class="mt-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">项目成员</label>
          <div class="space-y-3">
            <div
              v-for="(member, index) in formData.members"
              :key="index"
              class="flex items-center space-x-3"
            >
              <input
                v-model="member.name"
                placeholder="姓名"
                class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                v-model="member.email"
                placeholder="邮箱"
                class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                v-model="member.role"
                class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="project_manager">项目经理</option>
                <option value="developer">开发人员</option>
                <option value="designer">设计师</option>
                <option value="test">测试人员</option>
                <option value="other">其他</option>
              </select>
              <button
                type="button"
                @click="removeMember(index)"
                class="text-red-600 hover:text-red-900"
              >
                删除
              </button>
            </div>
            <button
              type="button"
              @click="addMember"
              class="text-blue-600 hover:text-blue-900"
            >
              + 新增成员
            </button>
          </div>
        </div>

        <!-- 附件 -->
        <div class="mt-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">项目附件</label>
          <input
            type="file"
            @change="handleFileUpload"
            accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div v-if="selectedFiles.length > 0" class="mt-2 space-y-1">
            <div v-for="(file, index) in selectedFiles" :key="index" class="text-sm text-gray-600">
              {{ file.name }} ({{ formatFileSize(file.size) }})
            </div>
          </div>
        </div>

        <!-- 提交按钮 -->
        <div class="mt-8 flex justify-end space-x-3">
          <NuxtLink
            to="/projects"
            class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            取消
          </NuxtLink>
          <button
            type="submit"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            提交申请
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const formData = ref({
  name: '',
  project_type: '',
  manager: '',
  contact: '',
  start_date: new Date().toISOString().split('T')[0],
  end_date: '',
  budget: 0,
  status: 'pending',
  description: '',
  members: [] as any[]
})

const selectedFiles = ref<File[]>([])

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

const addMember = () => {
  formData.value.members.push({
    name: '',
    email: '',
    role: 'developer'
  })
}

const removeMember = (index: number) => {
  formData.value.members.splice(index, 1)
}

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    selectedFiles.value = Array.from(target.files)
  }
}

const submitApplication = async () => {
  try {
    // 验证表单数据
    if (!formData.value.name || !formData.value.project_type || !formData.value.manager || !formData.value.contact || !formData.value.start_date || !formData.value.end_date || !formData.value.budget) {
      alert('请填写所有必填字段')
      return
    }

    // 检查日期范围
    if (new Date(formData.value.start_date) > new Date(formData.value.end_date)) {
      alert('预计结束时间必须晚于预计开始时间')
      return
    }

    // 处理文件上传
    let attachments = []
    if (selectedFiles.value.length > 0) {
      const formDataForUpload = new FormData()
      selectedFiles.value.forEach(file => {
        formDataForUpload.append('files', file)
      })

      const uploadResponse = await $fetch('/api/upload', {
        method: 'POST',
        body: formDataForUpload
      }) as any

      if (uploadResponse.code === 0 && uploadResponse.data) {
        attachments = uploadResponse.data
      }
    }

    // 提交项目申请
    const response = await $fetch('/api/projects', {
      method: 'POST',
      body: {
        ...formData.value,
        attachments
      }
    }) as any

    if (response.code === 0) {
      // 提交成功，跳转到项目列表页面
      window.location.href = '/projects'
    } else {
      alert('提交失败: ' + response.message)
    }
  } catch (error) {
    console.error('提交项目申请失败:', error)
    alert('提交失败，请稍后重试')
  }
}

// 初始化项目成员
addMember()
</script>
