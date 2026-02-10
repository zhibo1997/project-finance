<template>
  <div class="space-y-6">
    <div class="bg-white rounded-lg shadow-sm p-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-900">项目记账</h1>
        <div class="flex space-x-2">
          <NButton type="primary" @click="showAddModal = true">
            新增记账
          </NButton>
        </div>
      </div>

      <!-- 筛选区域 -->
      <div class="mb-6">
        <div class="flex flex-wrap gap-4">
          <NSelect
            v-model:value="recordTypeFilter"
            placeholder="筛选记录类型"
            style="width: 200px"
            :options="recordTypeOptions"
            clearable
          />
          <NInput
            v-model:value="searchKeyword"
            placeholder="搜索审批单号、描述等"
            @keyup.enter="fetchRecords"
            style="width: 300px"
          >
            <template #prefix>
              <span class="text-gray-400">🔍</span>
            </template>
          </NInput>
          <NButton type="primary" @click="fetchRecords">
            搜索
          </NButton>
        </div>
      </div>

      <!-- 记账记录列表 -->
      <NDataTable
        :columns="columns"
        :data="records"
        :pagination="{ page: currentPage, pageSize: pageSize, total: total }"
        @update:page="handlePageChange"
        @update:page-size="handlePageSizeChange"
        :scroll-x="1000"
      >
        <template #body-cell-record_type="{ row }">
          <NTag :type="row.record_type === 'INCOME' ? 'success' : 'error'">
            {{ row.record_type === 'INCOME' ? '收入' : '支出' }}
          </NTag>
        </template>
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

    <!-- 新增/编辑记账记录模态框 -->
    <NModal v-model:show="showAddModal" preset="card" title="新增记账记录" style="width: 800px">
      <NForm :model="recordForm" :rules="recordRules" label-placement="top">
        <NRow :gutter="16">
          <NCol :span="12">
            <NFormItem label="记录类型" path="record_type">
              <NSelect
                v-model:value="recordForm.record_type"
                placeholder="选择记录类型"
                :options="recordTypeOptions"
              />
            </NFormItem>
          </NCol>
          <NCol :span="12">
            <NFormItem label="审批单号" path="approval_id">
              <NInput v-model:value="recordForm.approval_id" placeholder="请输入审批单号" />
            </NFormItem>
          </NCol>
        </NRow>
        <NRow :gutter="16">
          <NCol :span="12">
            <NFormItem label="记账日期" path="record_date">
              <NDatePicker
                v-model:value="recordForm.record_date"
                type="date"
                placeholder="选择记账日期"
                style="width: 100%"
              />
            </NFormItem>
          </NCol>
          <NCol :span="12">
            <NFormItem label="金额" path="amount">
              <NInputNumber
                v-model:value="recordForm.amount"
                :min="0"
                :precision="2"
                style="width: 100%"
              />
            </NFormItem>
          </NCol>
        </NRow>
        <NFormItem
          label="费用类别"
          path="category_id"
          v-if="recordForm.record_type === 'EXPENSE'"
        >
          <NSelect
            v-model:value="recordForm.category_id"
            placeholder="请选择费用类别"
            :options="expenseCategoryOptions"
          />
        </NFormItem>
        <NFormItem
          label="描述"
          path="description"
          v-if="recordForm.record_type === 'EXPENSE'"
        >
          <NInput v-model:value="recordForm.description" placeholder="请输入描述" />
        </NFormItem>
        <NFormItem
          label="申请人"
          path="applicant"
          v-if="recordForm.record_type === 'EXPENSE'"
        >
          <NInput v-model:value="recordForm.applicant" placeholder="请输入申请人" />
        </NFormItem>
        <NFormItem
          label="发票号"
          path="invoice_no"
          v-if="recordForm.record_type === 'INCOME'"
        >
          <NInput v-model:value="recordForm.invoice_no" placeholder="请输入发票号" />
        </NFormItem>
        <NFormItem
          label="付款方"
          path="payer"
          v-if="recordForm.record_type === 'INCOME'"
        >
          <NInput v-model:value="recordForm.payer" placeholder="请输入付款方" />
        </NFormItem>
        <NFormItem label="备注" path="remark">
          <NInput
            v-model:value="recordForm.remark"
            type="textarea"
            placeholder="请输入备注"
            :autosize="{ minRows: 2, maxRows: 4 }"
          />
        </NFormItem>
        <NFormItem label="附件">
          <FileUpload v-model:model-value="recordForm.attachments" />
        </NFormItem>
        <div class="flex justify-end space-x-2">
          <NButton @click="showAddModal = false">取消</NButton>
          <NButton type="primary" @click="handleSubmit">提交</NButton>
        </div>
      </NForm>
    </NModal>
  </div>
</template>

<script setup lang="ts">
import type { AccountingRecords } from '@prisma/client'

const route = useRoute()
const showAddModal = ref(false)
const recordTypeFilter = ref('')
const searchKeyword = ref('')
const currentPage = ref(1)
const pageSize = ref(20)
const records = ref<AccountingRecords[]>([])
const total = ref(0)
const editingId = ref<string | null>(null)

const recordForm = reactive({
  record_type: '',
  approval_id: '',
  record_date: null as Date | null,
  amount: 0,
  category_id: '',
  description: '',
  applicant: '',
  invoice_no: '',
  payer: '',
  attachments: [] as string[],
  remark: ''
})

const recordRules = {
  record_type: [
    { required: true, message: '请选择记录类型', trigger: 'change' }
  ],
  approval_id: [
    { required: true, message: '请输入审批单号', trigger: 'blur' }
  ],
  record_date: [
    { required: true, message: '请选择记账日期', trigger: 'change' }
  ],
  amount: [
    { required: true, message: '请输入金额', trigger: 'blur' }
  ],
  category_id: [
    { required: true, message: '请选择费用类别', trigger: 'blur' },
  ],
  description: [
    { required: true, message: '请输入描述', trigger: 'blur' }
  ],
  applicant: [
    { required: true, message: '请输入申请人', trigger: 'blur' }
  ]
}

const recordTypeOptions = [
  { label: '收入', value: 'INCOME' },
  { label: '支出', value: 'EXPENSE' }
]

const expenseCategoryOptions = ref<any[]>([])
const { apiFetch } = useApi()

// 获取记账记录
const fetchRecords = async () => {
  try {
    const params = new URLSearchParams({
      page: currentPage.value.toString(),
      pageSize: pageSize.value.toString()
    })

    if (recordTypeFilter.value) {
      params.set('recordType', recordTypeFilter.value)
    }

    if (searchKeyword.value) {
      params.set('keyword', searchKeyword.value)
    }

    const response = await apiFetch(`/api/projects/${route.params.id}/records?${params.toString()}`)
    if (response.code === 0) {
      records.value = response.data.records
      total.value = response.data.total
    }
  } catch (error) {
    console.error('获取记账记录失败:', error)
  }
}

// 获取费用类别选项
const fetchExpenseCategories = async () => {
  try {
    const response = await apiFetch('/api/dict/expense-categories')
    if (response.code === 0) {
      expenseCategoryOptions.value = response.data.map((item: any) => ({
        label: item.name,
        value: item.id
      }))
    }
  } catch (error) {
    console.error('获取费用类别失败:', error)
  }
}

// 新增/编辑记账记录
const handleSubmit = async () => {
  try {
    if (editingId.value) {
      await apiFetch(`/api/records/${editingId.value}`, {
        method: 'PUT',
        body: recordForm
      })
    } else {
      await apiFetch(`/api/projects/${route.params.id}/records`, {
        method: 'POST',
        body: recordForm
      })
    }

    showAddModal.value = false
    editingId.value = null
    resetForm()
    await fetchRecords()
    useMessage().success('记账记录保存成功')
  } catch (error) {
    console.error('保存记账记录失败:', error)
  }
}

// 编辑记账记录
const handleEdit = (row: AccountingRecords) => {
  editingId.value = row.id
  recordForm.record_type = row.record_type
  recordForm.approval_id = row.approval_id
  recordForm.record_date = new Date(row.record_date)
  recordForm.amount = Number(row.amount)
  recordForm.category_id = row.category_id
  recordForm.description = row.description
  recordForm.applicant = row.applicant
  recordForm.invoice_no = row.invoice_no
  recordForm.payer = row.payer
  recordForm.attachments = row.attachments ? JSON.parse(row.attachments) : []
  recordForm.remark = row.remark
  showAddModal.value = true
}

// 删除记账记录
const handleDelete = async (row: AccountingRecords) => {
  try {
    await apiFetch(`/api/records/${row.id}`, {
      method: 'DELETE'
    })
    await fetchRecords()
    useMessage().success('记账记录删除成功')
  } catch (error) {
    console.error('删除记账记录失败:', error)
  }
}

// 重置表单
const resetForm = () => {
  recordForm.record_type = ''
  recordForm.approval_id = ''
  recordForm.record_date = null
  recordForm.amount = 0
  recordForm.category_id = ''
  recordForm.description = ''
  recordForm.applicant = ''
  recordForm.invoice_no = ''
  recordForm.payer = ''
  recordForm.attachments = []
  recordForm.remark = ''
}

// 分页变化
const handlePageChange = (page: number) => {
  currentPage.value = page
  fetchRecords()
}

const handlePageSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
  fetchRecords()
}

// 列配置
const columns = [
  { title: 'ID', key: 'id', width: 80 },
  { title: '记录类型', key: 'record_type', width: 100 },
  { title: '审批单号', key: 'approval_id', width: 150 },
  { title: '记账日期', key: 'record_date', width: 120, render: ({ row }) => formatDate(row.record_date) },
  { title: '金额', key: 'amount', width: 120, render: ({ row }) => formatCurrency(row.amount) },
  { title: '费用类别', key: 'category_id', width: 120 },
  { title: '描述', key: 'description', width: 200 },
  { title: '申请人', key: 'applicant', width: 100 },
  { title: '备注', key: 'remark', width: 150 },
  { title: '创建人', key: 'created_by_name', width: 100 },
  { title: '操作', key: 'actions', width: 120 }
]

onMounted(async () => {
  await Promise.all([
    fetchRecords(),
    fetchExpenseCategories()
  ])
})
</script>
