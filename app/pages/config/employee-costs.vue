<template>
  <div class="space-y-6">
    <div class="bg-white rounded-lg shadow-sm p-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-900">员工成本配置</h1>
        <NButton type="primary" @click="showAddModal = true">
          <template #icon>
            <span class="text-lg">+</span>
          </template>
          新增员工成本
        </NButton>
      </div>

      <NDataTable
        :columns="columns"
        :data="employeeCosts"
        :pagination="{ pageSize: 10 }"
        :scroll-x="800"
      >
        <template #body-cell-actions="{ row }">
          <div class="flex space-x-2">
            <NButton type="primary" size="small" @click="handleEdit(row)">
              编辑
            </NButton>
            <NButton type="error" size="small" @click="handleDelete(row)">
              删除
            </NButton>
          </div>
        </template>
      </NDataTable>
    </div>

    <!-- 新增/编辑对话框 -->
    <NModal v-model:show="showAddModal" preset="card" title="新增员工成本配置" style="width: 600px">
      <NForm :model="formData" :rules="rules" label-placement="top">
        <NFormItem label="职级代码" path="level_key">
          <NInput v-model:value="formData.level_key" placeholder="请输入职级代码" />
        </NFormItem>
        <NFormItem label="职级名称" path="level_name">
          <NInput v-model:value="formData.level_name" placeholder="请输入职级名称" />
        </NFormItem>
        <NFormItem label="日成本" path="daily_cost">
          <NInputNumber v-model:value="formData.daily_cost" :min="0" :precision="2" style="width: 100%" />
        </NFormItem>
        <div class="flex justify-end space-x-2 mt-4">
          <NButton @click="showAddModal = false">取消</NButton>
          <NButton type="primary" @click="handleSubmit">确定</NButton>
        </div>
      </NForm>
    </NModal>
  </div>
</template>

<script setup lang="ts">
import type { EmployeeCostConfig } from '@prisma/client'

const showAddModal = ref(false)
const editingId = ref<string | null>(null)
const employeeCosts = ref<EmployeeCostConfig[]>([])

const formData = reactive({
  level_key: '',
  level_name: '',
  daily_cost: 0
})

const rules = {
  level_key: [
    { required: true, message: '请输入职级代码', trigger: 'blur' }
  ],
  level_name: [
    { required: true, message: '请输入职级名称', trigger: 'blur' }
  ],
  daily_cost: [
    { required: true, message: '请输入日成本', trigger: 'blur' }
  ]
}

const { apiFetch } = useApi()

// 获取员工成本配置列表
const fetchEmployeeCosts = async () => {
  try {
    const response = await apiFetch('/api/config/employee-costs')
    if (response.code === 0) {
      employeeCosts.value = response.data
    }
  } catch (error) {
    console.error('获取员工成本配置列表失败:', error)
  }
}

// 新增/编辑
const handleSubmit = async () => {
  try {
    if (editingId.value) {
      await apiFetch(`/api/config/employee-costs/${editingId.value}`, {
        method: 'PUT',
        body: formData
      })
    } else {
      await apiFetch('/api/config/employee-costs', {
        method: 'POST',
        body: formData
      })
    }

    showAddModal.value = false
    editingId.value = null
    formData.level_key = ''
    formData.level_name = ''
    formData.daily_cost = 0
    await fetchEmployeeCosts()
  } catch (error) {
    console.error('操作失败:', error)
  }
}

// 编辑
const handleEdit = (row: EmployeeCostConfig) => {
  editingId.value = row.id
  formData.level_key = row.level_key
  formData.level_name = row.level_name
  formData.daily_cost = Number(row.daily_cost)
  showAddModal.value = true
}

// 删除
const handleDelete = async (row: EmployeeCostConfig) => {
  try {
    await apiFetch(`/api/config/employee-costs/${row.id}`, {
      method: 'DELETE'
    })
    await fetchEmployeeCosts()
  } catch (error) {
    console.error('删除失败:', error)
  }
}

// 列配置
const columns = [
  { title: 'ID', key: 'id', width: 80 },
  { title: '职级代码', key: 'level_key', width: 120 },
  { title: '职级名称', key: 'level_name', width: 120 },
  { title: '日成本', key: 'daily_cost', width: 120, render: ({ row }) => formatCurrency(row.daily_cost) },
  { title: '创建时间', key: 'created_at', width: 150, render: ({ row }) => formatDate(row.created_at) },
  { title: '操作', key: 'actions', width: 150 }
]

onMounted(async () => {
  await fetchEmployeeCosts()
})
</script>
