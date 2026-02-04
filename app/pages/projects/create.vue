<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <!-- 页面标题 -->
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold text-gray-800">新建项目</h1>
      <NuxtLink
        to="/"
        class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
      >
        返回列表
      </NuxtLink>
    </div>

    <!-- 项目表单 -->
    <div class="bg-white p-6 rounded-lg shadow-sm">
      <form @submit.prevent="createProject" class="space-y-6">
        <!-- 基础信息 -->
        <div class="border-b border-gray-200 pb-6">
          <h2 class="text-lg font-semibold text-gray-800 mb-4">基础信息</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                项目名称 <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.project_name"
                type="text"
                required
                placeholder="请输入项目名称"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                项目负责人 <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.project_leader"
                type="text"
                required
                placeholder="请输入项目负责人"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                客户名称
              </label>
              <input
                v-model="form.client_name"
                type="text"
                placeholder="请输入客户名称"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                项目类型
              </label>
              <input
                v-model="form.project_type"
                type="text"
                placeholder="请输入项目类型"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                服务开始日期
              </label>
              <input
                v-model="form.service_start_date"
                type="date"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                服务结束日期
              </label>
              <input
                v-model="form.service_end_date"
                type="date"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <!-- 项目背景 -->
        <div class="border-b border-gray-200 pb-6">
          <h2 class="text-lg font-semibold text-gray-800 mb-4">项目背景</h2>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              项目背景
            </label>
            <textarea
              v-model="form.form_data.basicInfo.projectBackground"
              rows="3"
              placeholder="请输入项目背景"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>
        </div>

        <!-- 服务收入 -->
        <div class="border-b border-gray-200 pb-6">
          <h2 class="text-lg font-semibold text-gray-800 mb-4">服务收入</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                采购内容
              </label>
              <input
                v-model="form.form_data.serviceIncome.purchaseContent"
                type="text"
                placeholder="请输入采购内容"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                必要性描述
              </label>
              <textarea
                v-model="form.form_data.serviceIncome.necessityDesc"
                rows="3"
                placeholder="请输入必要性描述"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  含税金额
                </label>
                <input
                  v-model.number="form.form_data.serviceIncome.amount"
                  type="number"
                  placeholder="请输入含税金额"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  税率 (%)
                </label>
                <input
                  v-model.number="form.form_data.serviceIncome.taxRate"
                  type="number"
                  placeholder="请输入税率"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- 提交按钮 -->
        <div class="flex justify-end space-x-4">
          <NuxtLink
            to="/"
            class="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            取消
          </NuxtLink>
          <button
            type="submit"
            class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            创建项目
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const form = ref({
  project_name: '',
  project_leader: '',
  client_name: '',
  project_type: '',
  service_start_date: '',
  service_end_date: '',
  form_data: {
    basicInfo: {
      projectBackground: '',
      clientDemand: '',
      serviceContent: '',
      projectMembers: []
    },
    serviceIncome: {
      purchaseContent: '',
      necessityDesc: '',
      amount: 0,
      taxRate: 0
    },
    outsourcingCost: [],
    laborCost: [],
    otherExpenses: []
  }
})

const createProject = async () => {
  try {
    const response = await $fetch('/api/projects', {
      method: 'POST',
      body: form.value
    })

    if (response.code === 0) {
      navigateTo('/')
    } else {
      alert(response.message)
    }
  } catch (error) {
    console.error('创建项目失败:', error)
    alert('创建项目失败')
  }
}
</script>
