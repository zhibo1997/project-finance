<template>
  <div class="space-y-6">
    <div class="bg-white rounded-lg shadow-sm p-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-900">新建项目</h1>
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

      <!-- 外采成本 -->
      <div class="mb-8">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">外采成本</h2>
        <div class="space-y-2">
          <div v-for="(item, index) in formData.purchase.items" :key="index" class="flex space-x-2">
            <NSelect
              v-model:value="item.content"
              placeholder="采购内容"
              style="width: 200px"
              :options="purchaseContentOptions"
            />
            <NInputNumber v-model:value="item.price" :min="0" :precision="2" style="width: 100px" />
            <NInputNumber v-model:value="item.quantity" :min="1" style="width: 100px" />
            <NInput v-model:value="item.unit" placeholder="单位" style="width: 100px" />
            <span class="font-semibold">{{ formatCurrency(item.price * item.quantity) }}</span>
            <NButton type="error" size="small" @click="removePurchaseItem(index)" v-if="formData.purchase.items.length > 1">
              删除
            </NButton>
            <NButton type="primary" size="small" @click="addPurchaseItem" v-if="index === formData.purchase.items.length - 1">
              添加
            </NButton>
          </div>
        </div>
        <div class="flex justify-end font-semibold mt-2">
          外采成本小计: {{ formatCurrency(purchaseTotal) }}
        </div>
      </div>

      <!-- 人工成本 -->
      <div class="mb-8">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">人工成本</h2>
        <div class="space-y-2">
          <div v-for="(item, index) in formData.employee.items" :key="index" class="flex space-x-2">
            <NSelect
              v-model:value="item.employee"
              placeholder="选择员工"
              style="width: 200px"
              :options="employeeOptions"
            />
            <NSelect
              v-model:value="item.level"
              placeholder="选择职级"
              style="width: 150px"
              :options="employeeLevelOptions"
            />
            <NInputNumber v-model:value="item.days" :min="1" style="width: 100px" />
            <span class="font-semibold">{{ formatCurrency(getDailyCost(item.level) * item.days) }}</span>
            <NButton type="error" size="small" @click="removeEmployeeItem(index)" v-if="formData.employee.items.length > 1">
              删除
            </NButton>
            <NButton type="primary" size="small" @click="addEmployeeItem" v-if="index === formData.employee.items.length - 1">
              添加
            </NButton>
          </div>
        </div>
        <div class="flex justify-end font-semibold mt-2">
          人工成本小计: {{ formatCurrency(employeeTotal) }}
        </div>
      </div>

      <!-- 其他费用 -->
      <div class="mb-8">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">其他费用</h2>
        <div class="space-y-2">
          <div v-for="(item, index) in formData.other.items" :key="index" class="flex space-x-2">
            <NSelect
              v-model:value="item.category"
              placeholder="费用类别"
              style="width: 200px"
              :options="expenseCategoryOptions"
            />
            <NInputNumber v-model:value="item.amount" :min="0" :precision="2" style="width: 200px" />
            <NInput v-model:value="item.description" placeholder="说明" style="flex: 1" />
            <NButton type="error" size="small" @click="removeOtherItem(index)" v-if="formData.other.items.length > 1">
              删除
            </NButton>
            <NButton type="primary" size="small" @click="addOtherItem" v-if="index === formData.other.items.length - 1">
              添加
            </NButton>
          </div>
        </div>
        <div class="flex justify-end font-semibold mt-2">
          其他费用小计: {{ formatCurrency(otherTotal) }}
        </div>
      </div>

      <!-- 财务汇总 -->
      <div class="bg-gray-50 rounded-lg p-6 mb-8">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">财务汇总</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p class="text-sm text-gray-600">预计净收入</p>
            <p class="text-lg font-bold text-gray-900">{{ formatCurrency(serviceTotalWithoutTax) }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">预计总成本</p>
            <p class="text-lg font-bold text-gray-900">{{ formatCurrency(totalCost) }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">预计毛利润</p>
            <p class="text-lg font-bold text-green-600">{{ formatCurrency(serviceTotalWithoutTax - totalCost) }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">预计毛利率</p>
            <p class="text-lg font-bold text-green-600">
              {{ serviceTotalWithoutTax > 0 ? formatPercentage(((serviceTotalWithoutTax - totalCost) / serviceTotalWithoutTax) * 100) : '0%' }}
            </p>
          </div>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="flex justify-end space-x-4">
        <NButton @click="navigateTo('/')">取消</NButton>
        <NButton type="primary" @click="handleSave('DRAFT')">保存草稿</NButton>
        <NButton type="primary" @click="handleSave('SUBMITTED')">提交项目</NButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
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

const expenseCategoryOptions = ref<any[]>([])
const purchaseContentOptions = ref<any[]>([])
const employeeOptions = ref<any[]>([])
const employeeLevelOptions = ref<any[]>([])
const employeeCostMap = ref<Record<string, number>>({})

const { apiFetch } = useApi()

// 获取字典数据
const fetchDictData = async () => {
  try {
    const [expenseCategories, purchaseContents, employeeCosts] = await Promise.all([
      apiFetch('/api/dict/expense-categories'),
      apiFetch('/api/dict/purchase-contents'),
      apiFetch('/api/config/employee-costs')
    ])

    if (expenseCategories.code === 0) {
      expenseCategoryOptions.value = expenseCategories.data.map((item: any) => ({
        label: item.name,
        value: item.id
      }))
    }

    if (purchaseContents.code === 0) {
      purchaseContentOptions.value = purchaseContents.data.map((item: any) => ({
        label: item.name,
        value: item.id
      }))
    }

    if (employeeCosts.code === 0) {
      employeeLevelOptions.value = employeeCosts.data.map((item: any) => ({
        label: item.level_name,
        value: item.level_key
      }))
      employeeCostMap.value = employeeCosts.data.reduce((map: any, item: any) => {
        map[item.level_key] = Number(item.daily_cost)
        return map
      }, {})
    }

    // 模拟员工数据
    employeeOptions.value = [
      { label: '张三', value: '1' },
      { label: '李四', value: '2' },
      { label: '王五', value: '3' },
      { label: '赵六', value: '4' }
    ]
  } catch (error) {
    console.error('获取字典数据失败:', error)
  }
}

// 计算服务收入
const serviceTotal = computed(() => {
  return formData.service.items.reduce((sum, item) => sum + Number(item.amount || 0), 0)
})

const serviceTotalWithoutTax = computed(() => {
  return serviceTotal.value * (1 - formData.service.tax_rate / 100)
})

// 计算外采成本
const purchaseTotal = computed(() => {
  return formData.purchase.items.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0)
})

// 计算人工成本
const employeeTotal = computed(() => {
  return formData.employee.items.reduce((sum, item) => {
    return sum + getDailyCost(item.level) * item.days
  }, 0)
})

// 获取日成本
const getDailyCost = (levelKey: string) => {
  return employeeCostMap.value[levelKey] || 0
}

// 计算其他费用
const otherTotal = computed(() => {
  return formData.other.items.reduce((sum, item) => sum + Number(item.amount || 0), 0)
})

// 计算总成本
const totalCost = computed(() => {
  return purchaseTotal.value + employeeTotal.value + otherTotal.value
})

// 添加服务项
const addServiceItem = () => {
  formData.service.items.push({ content: '', amount: 0 })
}

const removeServiceItem = (index: number) => {
  formData.service.items.splice(index, 1)
}

// 添加采购项
const addPurchaseItem = () => {
  formData.purchase.items.push({ content: '', price: 0, quantity: 1, unit: '个' })
}

const removePurchaseItem = (index: number) => {
  formData.purchase.items.splice(index, 1)
}

// 添加员工项
const addEmployeeItem = () => {
  formData.employee.items.push({ employee: '', level: '', days: 1 })
}

const removeEmployeeItem = (index: number) => {
  formData.employee.items.splice(index, 1)
}

// 添加其他费用项
const addOtherItem = () => {
  formData.other.items.push({ category: '', amount: 0, description: '' })
}

const removeOtherItem = (index: number) => {
  formData.other.items.splice(index, 1)
}

// 保存项目
const handleSave = async (status: string) => {
  try {
    await apiFetch('/api/projects', {
      method: 'POST',
      body: {
        ...formData,
        status,
        form_data: formData
      }
    })
    useMessage().success(status === 'DRAFT' ? '草稿保存成功' : '项目提交成功')
    navigateTo('/')
  } catch (error) {
    console.error('保存项目失败:', error)
  }
}

onMounted(async () => {
  await fetchDictData()
})
</script>
