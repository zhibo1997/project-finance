<template>
  <div class="space-y-6">
    <div class="bg-white rounded-lg shadow-sm p-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-900">编辑项目</h1>
      </div>

      <!-- 项目基本信息 -->
      <div class="mb-8">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">项目基本信息</h2>
        <NForm :model="formData" :rules="rules" label-placement="top">
          <NRow :gutter="16">
            <NCol :span="12">
              <NFormItem label="项目名称" path="project_name">
                <NInput v-model:value="formData.project_name" placeholder="请输入项目名称" />
              </NFormItem>
            </NCol>
            <NCol :span="12">
              <NFormItem label="项目负责人" path="project_leader">
                <NInput v-model:value="formData.project_leader" placeholder="请输入项目负责人" />
              </NFormItem>
            </NCol>
          </NRow>
          <NRow :gutter="16">
            <NCol :span="12">
              <NFormItem label="客户名称" path="client_name">
                <NInput v-model:value="formData.client_name" placeholder="请输入客户名称" />
              </NFormItem>
            </NCol>
            <NCol :span="12">
              <NFormItem label="项目类型" path="project_type">
                <NSelect
                  v-model:value="formData.project_type"
                  placeholder="请选择项目类型"
                  :options="projectTypeOptions"
                />
              </NFormItem>
            </NCol>
          </NRow>
          <NRow :gutter="16">
            <NCol :span="12">
              <NFormItem label="服务开始日期" path="service_start_date">
                <NDatePicker
                  v-model:value="formData.service_start_date"
                  type="date"
                  placeholder="选择服务开始日期"
                  style="width: 100%"
                />
              </NFormItem>
            </NCol>
            <NCol :span="12">
              <NFormItem label="服务结束日期" path="service_end_date">
                <NDatePicker
                  v-model:value="formData.service_end_date"
                  type="date"
                  placeholder="选择服务结束日期"
                  style="width: 100%"
                />
              </NFormItem>
            </NCol>
          </NRow>
          <NFormItem label="项目背景" path="background">
            <NInput
              v-model:value="formData.background"
              type="textarea"
              placeholder="请输入项目背景"
              :autosize="{ minRows: 3, maxRows: 6 }"
            />
          </NFormItem>
        </NForm>
      </div>

      <!-- 服务收入 -->
      <div class="mb-8">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">服务收入</h2>
        <NForm :model="formData.service" :rules="serviceRules" label-placement="top">
          <NFormItem label="税率 (%)" path="tax_rate">
            <NInputNumber
              v-model:value="formData.service.tax_rate"
              :min="0"
              :max="100"
              :precision="2"
              style="width: 100%"
            />
          </NFormItem>
          <div class="mb-4">
            <h3 class="text-sm font-medium text-gray-900 mb-2">服务项</h3>
            <div class="space-y-2">
              <div v-for="(item, index) in formData.service.items" :key="index" class="flex space-x-2">
                <NInput v-model:value="item.content" placeholder="服务内容" style="width: 300px" />
                <NInputNumber v-model:value="item.amount" :min="0" :precision="2" style="width: 200px" />
                <NButton type="error" size="small" @click="removeServiceItem(index)" v-if="formData.service.items.length > 1">
                  删除
                </NButton>
                <NButton type="primary" size="small" @click="addServiceItem" v-if="index === formData.service.items.length - 1">
                  添加
                </NButton>
              </div>
            </div>
          </div>
          <div class="flex justify-end space-x-4 font-semibold">
            <span>含税总计: {{ formatCurrency(serviceTotal) }}</span>
            <span>不含税总计: {{ formatCurrency(serviceTotalWithoutTax) }}</span>
          </div>
        </NForm>
      </div>

      <!-- 操作按钮 -->
      <div class="flex justify-end space-x-4">
        <NButton @click="navigateTo(`/projects/${route.params.id}`)">取消</NButton>
        <NButton type="primary" @click="handleSave">保存</NButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Projects } from '@prisma/client'

const route = useRoute()

const formData = reactive({
  project_name: '',
  project_leader: '',
  client_name: '',
  project_type: '',
  service_start_date: null as Date | null,
  service_end_date: null as Date | null,
  background: '',
  service: {
    tax_rate: 6,
    items: [
      { content: '', amount: 0 }
    ]
  },
  purchase: {
    items: [
      { content: '', price: 0, quantity: 1, unit: '个' }
    ]
  },
  employee: {
    items: [
      { employee: '', level: '', days: 1 }
    ]
  },
  other: {
    items: [
      { category: '', amount: 0, description: '' }
    ]
  }
})

const rules = {
  project_name: [
    { required: true, message: '请输入项目名称', trigger: 'blur' }
  ],
  project_leader: [
    { required: true, message: '请输入项目负责人', trigger: 'blur' }
  ],
  client_name: [
    { required: true, message: '请输入客户名称', trigger: 'blur' }
  ]
}

const serviceRules = {
  tax_rate: [
    { required: true, message: '请输入税率', trigger: 'blur' }
  ]
}

const projectTypeOptions = [
  { label: '软件开发', value: 'software' },
  { label: '咨询服务', value: 'consulting' },
  { label: '运维服务', value: 'operation' },
  { label: '其他', value: 'other' }
]

const { apiFetch } = useApi()

// 获取项目详情
const fetchProject = async () => {
  try {
    const response = await apiFetch(`/api/projects/${route.params.id}`)
    if (response.code === 0) {
      const project = response.data
      formData.project_name = project.project_name
      formData.project_leader = project.project_leader
      formData.client_name = project.client_name
      formData.project_type = project.project_type
      formData.service_start_date = project.service_start_date ? new Date(project.service_start_date) : null
      formData.service_end_date = project.service_end_date ? new Date(project.service_end_date) : null
      formData.background = project.background || ''

      // 加载表单数据
      if (project.form_data) {
        const formDataFromDB = JSON.parse(project.form_data)
        Object.assign(formData, formDataFromDB)
      }
    }
  } catch (error) {
    console.error('获取项目详情失败:', error)
  }
}

// 计算服务收入
const serviceTotal = computed(() => {
  return formData.service.items.reduce((sum, item) => sum + Number(item.amount || 0), 0)
})

const serviceTotalWithoutTax = computed(() => {
  return serviceTotal.value * (1 - formData.service.tax_rate / 100)
})

// 添加服务项
const addServiceItem = () => {
  formData.service.items.push({ content: '', amount: 0 })
}

const removeServiceItem = (index: number) => {
  formData.service.items.splice(index, 1)
}

// 保存项目
const handleSave = async () => {
  try {
    await apiFetch(`/api/projects/${route.params.id}`, {
      method: 'PUT',
      body: {
        ...formData,
        form_data: formData
      }
    })
    useMessage().success('项目更新成功')
    navigateTo(`/projects/${route.params.id}`)
  } catch (error) {
    console.error('更新项目失败:', error)
  }
}

onMounted(async () => {
  await fetchProject()
})
</script>
