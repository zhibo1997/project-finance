<template>
  <div class="space-y-6">
    <div class="bg-white rounded-lg shadow-sm p-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-900">采购内容管理</h1>
        <NButton type="primary" @click="showAddModal = true">
          <template #icon>
            <span class="text-lg">+</span>
          </template>
          新增采购内容
        </NButton>
      </div>

      <NDataTable
        :columns="columns"
        :data="purchaseContents"
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
    <NModal v-model:show="showAddModal" preset="card" title="新增采购内容" style="width: 600px">
      <NForm :model="formData" :rules="rules" label-placement="top">
        <NFormItem label="采购内容名称" path="name">
          <NInput v-model:value="formData.name" placeholder="请输入采购内容名称" />
        </NFormItem>
        <NFormItem label="排序" path="sort_order">
          <NInputNumber v-model:value="formData.sort_order" :min="0" :max="999" />
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
import type { PurchaseContent } from '@prisma/client'

const showAddModal = ref(false)
const editingId = ref<string | null>(null)
const purchaseContents = ref<PurchaseContent[]>([])

const formData = reactive({
  name: '',
  sort_order: 0
})

const rules = {
  name: [
    { required: true, message: '请输入采购内容名称', trigger: 'blur' }
  ]
}

const { apiFetch } = useApi()

// 获取采购内容列表
const fetchPurchaseContents = async () => {
  try {
    const response = await apiFetch('/api/dict/purchase-contents')
    if (response.code === 0) {
      purchaseContents.value = response.data
    }
  } catch (error) {
    console.error('获取采购内容列表失败:', error)
  }
}

// 新增/编辑
const handleSubmit = async () => {
  try {
    if (editingId.value) {
      await apiFetch(`/api/dict/purchase-contents/${editingId.value}`, {
        method: 'PUT',
        body: formData
      })
    } else {
      await apiFetch('/api/dict/purchase-contents', {
        method: 'POST',
        body: formData
      })
    }

    showAddModal.value = false
    editingId.value = null
    formData.name = ''
    formData.sort_order = 0
    await fetchPurchaseContents()
  } catch (error) {
    console.error('操作失败:', error)
  }
}

// 编辑
const handleEdit = (row: PurchaseContent) => {
  editingId.value = row.id
  formData.name = row.name
  formData.sort_order = row.sort_order
  showAddModal.value = true
}

// 删除
const handleDelete = async (row: PurchaseContent) => {
  try {
    await apiFetch(`/api/dict/purchase-contents/${row.id}`, {
      method: 'DELETE'
    })
    await fetchPurchaseContents()
  } catch (error) {
    console.error('删除失败:', error)
  }
}

// 列配置
const columns = [
  { title: 'ID', key: 'id', width: 80 },
  { title: '采购内容名称', key: 'name', width: 200 },
  { title: '排序', key: 'sort_order', width: 100 },
  { title: '创建时间', key: 'created_at', width: 150, render: ({ row }) => formatDate(row.created_at) },
  { title: '操作', key: 'actions', width: 150 }
]

onMounted(async () => {
  await fetchPurchaseContents()
})
</script>
