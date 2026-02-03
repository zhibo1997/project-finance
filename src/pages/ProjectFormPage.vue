<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Plus, Trash2, Save, Calendar, Calculator, X, ArrowLeft } from 'lucide-vue-next'
import { useProject } from '../composables/useProject'
import { useAuth } from '../composables/useAuth'
import { generateId, formatCurrency } from '../utils'
import { MOCK_EMPLOYEES, MOCK_EXPENSE_CATEGORIES, MOCK_PURCHASE_CONTENTS } from '../data/projectData'
import type { ProjectFormData, ServiceIncomeItem, OutsourcingCostItem, LaborCostItem, OtherExpenseItem } from '../types/project'

const router = useRouter()
const route = useRoute()
const projectId = route.params.id as string | undefined

const { currentProject, loading, getProject, createProject, updateProject } = useProject()
const { currentUser } = useAuth()

const isEdit = !!projectId

// 默认表单数据
const defaultFormData: ProjectFormData = {
  basicInfo: {
    projectName: '',
    projectLeader: '',
    clientName: '',
    projectType: '',
    serviceStartDate: new Date().toISOString().split('T')[0],
    serviceEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    projectMembers: [],
    projectBackground: '',
    clientDemand: '',
    serviceContent: ''
  },
  serviceIncome: [],
  outsourcingCost: [],
  laborCost: [],
  otherExpenses: []
}

// 响应式状态
const formData = ref<ProjectFormData>({ ...defaultFormData })

// 加载项目数据（编辑模式）
if (isEdit) {
  getProject(projectId!).then(() => {
    if (currentProject.value) {
      formData.value = { ...currentProject.value.formData }
    }
  })
}

// --- 计算属性 ---

// 计算服务收入总额（含税）
const totalRevenueInclusive = computed(() => {
  return formData.value.serviceIncome.reduce((sum, item) => sum + item.amount, 0)
})

// 计算外采成本总额
const totalOutsourcingCost = computed(() => {
  return formData.value.outsourcingCost.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0)
})

// 计算人工成本总额
const totalLaborCost = computed(() => {
  return formData.value.laborCost.reduce((sum, item) => sum + (item.dailyCost * item.days), 0)
})

// 计算其他费用总额
const totalOtherCost = computed(() => {
  return formData.value.otherExpenses.reduce((sum, item) => sum + item.amount, 0)
})

// 计算总成本
const totalCost = computed(() => {
  return totalOutsourcingCost.value + totalLaborCost.value + totalOtherCost.value
})

// 计算毛利润
const grossProfit = computed(() => {
  return totalRevenueInclusive.value - totalCost.value
})

// 计算利润率
const profitMargin = computed(() => {
  return totalRevenueInclusive.value !== 0 ? (grossProfit.value / totalRevenueInclusive.value) * 100 : 0
})

// --- 事件处理函数 ---

// 处理返回
const handleBack = () => {
  if (confirm('您有未保存的更改，确定要返回吗？')) {
    router.push('/')
  }
}

// 保存草稿
const handleSaveDraft = () => {
  if (isEdit) {
    updateProject(projectId!, { formData: formData.value }).then(() => {
      alert('草稿保存成功')
    }).catch(error => {
      console.error('保存失败:', error)
      alert('保存失败')
    })
  } else {
    createProject({
      formData: formData.value,
      createdBy: currentUser.value.id
    }).then(() => {
      alert('草稿保存成功')
      router.push('/')
    }).catch(error => {
      console.error('创建失败:', error)
      alert('创建失败')
    })
  }
}

// 提交审批
const handleSubmit = () => {
  if (!validateForm()) {
    return
  }

  if (isEdit) {
    updateProject(projectId!, { formData: formData.value }).then(() => {
      alert('项目提交成功')
      router.push('/')
    }).catch(error => {
      console.error('提交失败:', error)
      alert('提交失败')
    })
  } else {
    createProject({
      formData: formData.value,
      createdBy: currentUser.value.id
    }).then(() => {
      alert('项目提交成功')
      router.push('/')
    }).catch(error => {
      console.error('创建失败:', error)
      alert('创建失败')
    })
  }
}

// 表单验证
const validateForm = (): boolean => {
  // 基础信息验证
  if (!formData.value.basicInfo.projectName) {
    alert('请输入项目名称')
    return false
  }
  if (!formData.value.basicInfo.projectLeader) {
    alert('请输入项目负责人')
    return false
  }
  if (!formData.value.basicInfo.clientName) {
    alert('请输入客户名称')
    return false
  }
  if (!formData.value.basicInfo.projectType) {
    alert('请输入项目类型')
    return false
  }

  // 服务收入验证
  if (formData.value.serviceIncome.length === 0) {
    alert('请至少添加一项服务收入')
    return false
  }
  for (const item of formData.value.serviceIncome) {
    if (!item.purchaseContent || !item.necessityDesc || item.amount <= 0) {
      alert('请完善服务收入信息')
      return false
    }
  }

  // 至少有一项成本
  if (formData.value.outsourcingCost.length === 0 &&
      formData.value.laborCost.length === 0 &&
      formData.value.otherExpenses.length === 0) {
    alert('请至少添加一项成本')
    return false
  }

  return true
}

// --- 服务收入操作 ---
const addServiceItem = () => {
  const newItem: ServiceIncomeItem = {
    id: generateId(),
    purchaseContent: '',
    necessityDesc: '',
    amount: 0,
    taxRate: 6
  }
  formData.value.serviceIncome.push(newItem)
}

const deleteServiceItem = (id: string) => {
  formData.value.serviceIncome = formData.value.serviceIncome.filter(item => item.id !== id)
}

const updateServiceItem = (index: number, field: keyof ServiceIncomeItem, value: string | number) => {
  formData.value.serviceIncome[index] = {
    ...formData.value.serviceIncome[index],
    [field]: value
  }
}

// --- 外采成本操作 ---
const addOutsourcingItem = () => {
  const newItem: OutsourcingCostItem = {
    id: generateId(),
    content: '',
    unitPrice: 0,
    quantity: 1
  }
  formData.value.outsourcingCost.push(newItem)
}

const deleteOutsourcingItem = (id: string) => {
  formData.value.outsourcingCost = formData.value.outsourcingCost.filter(item => item.id !== id)
}

const updateOutsourcingItem = (index: number, field: keyof OutsourcingCostItem, value: string | number) => {
  formData.value.outsourcingCost[index] = {
    ...formData.value.outsourcingCost[index],
    [field]: value
  }
}

// --- 人工成本操作 ---
const addLaborItem = () => {
  const newItem: LaborCostItem = {
    id: generateId(),
    employeeId: '',
    employeeName: '',
    level: '',
    dailyCost: 0,
    days: 0
  }
  formData.value.laborCost.push(newItem)
}

const deleteLaborItem = (id: string) => {
  formData.value.laborCost = formData.value.laborCost.filter(item => item.id !== id)
}

const updateLaborItem = (index: number, field: keyof LaborCostItem, value: string | number) => {
  formData.value.laborCost[index] = {
    ...formData.value.laborCost[index],
    [field]: value
  }
}

const handleEmployeeSelect = (index: number, emp: any) => {
  formData.value.laborCost[index] = {
    ...formData.value.laborCost[index],
    employeeId: emp.id,
    employeeName: emp.name,
    level: emp.role,
    dailyCost: emp.standardCost
  }
}

// --- 其他费用操作 ---
const addOtherItem = () => {
  const newItem: OtherExpenseItem = {
    id: generateId(),
    category: '',
    amount: 0
  }
  formData.value.otherExpenses.push(newItem)
}

const deleteOtherItem = (id: string) => {
  formData.value.otherExpenses = formData.value.otherExpenses.filter(item => item.id !== id)
}

const updateOtherItem = (index: number, field: keyof OtherExpenseItem, value: string | number) => {
  formData.value.otherExpenses[index] = {
    ...formData.value.otherExpenses[index],
    [field]: value
  }
}

// --- 样式类 ---
const sectionClass = "bg-white mb-4 border-t border-b md:border md:rounded-lg border-gray-200"
const headerClass = "bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center font-bold text-gray-800 text-sm md:text-base"
const labelClass = "block text-xs font-semibold text-gray-500 mb-1"
const inputClass = "w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
const textAreaClass = "w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors min-h-[60px] resize-y"
const deleteBtnClass = "p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
const addBtnClass = "flex items-center justify-center gap-1 text-sm text-blue-600 font-medium py-3 hover:bg-blue-50 w-full border-t border-gray-100 transition-colors cursor-pointer"
</script>

<template>
  <div class="min-h-screen bg-gray-100 pb-24 font-sans text-gray-800">
    <!-- 顶部标题栏 - 企业级风格 -->
    <header class="bg-white border-b border-gray-200 sticky top-0 z-20">
      <div class="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <button
            @click="handleBack"
            class="flex items-center gap-1 px-2 py-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
          >
            <ArrowLeft :size="16" />
            返回
          </button>
          <h1 class="text-base font-bold text-gray-800">{{ isEdit ? '编辑项目' : '新建项目' }}</h1>
        </div>
        <span class="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded border border-yellow-200">
          {{ isEdit ? '编辑模式' : '草稿' }}
        </span>
      </div>
    </header>

    <main class="max-w-4xl mx-auto md:py-6">
      <!-- 1. 项目基础信息 - 紧凑网格布局 -->
      <section :class="sectionClass" id="basic-info">
        <div :class="headerClass">1. 项目基础信息</div>
        <div class="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- 第一行：项目名称 + 负责人 -->
          <div :class="[
            'p-4 rounded-lg border',
            'border-gray-100 bg-gray-50'
          ]">
            <label :class="labelClass">项目名称</label>
            <input
              type="text"
              v-model="formData.basicInfo.projectName"
              :class="inputClass"
              placeholder="请输入项目全称"
            />
          </div>
          <div :class="[
            'p-4 rounded-lg border',
            'border-gray-100 bg-white'
          ]">
            <label :class="labelClass">项目负责人</label>
            <input
              type="text"
              v-model="formData.basicInfo.projectLeader"
              :class="inputClass"
            />
          </div>

          <!-- 第二行：客户 + 项目类型 -->
          <div :class="[
            'p-4 rounded-lg border',
            'border-gray-100 bg-white'
          ]">
            <label :class="labelClass">客户名称</label>
            <input
              type="text"
              v-model="formData.basicInfo.clientName"
              :class="inputClass"
            />
          </div>
          <div :class="[
            'p-4 rounded-lg border',
            'border-gray-100 bg-gray-50'
          ]">
            <label :class="labelClass">项目类型</label>
            <input
              type="text"
              v-model="formData.basicInfo.projectType"
              :class="inputClass"
            />
          </div>

          <!-- 第三行：服务周期 (双日期选择) -->
          <div class="md:col-span-2 p-4 rounded-lg border border-gray-100 bg-gray-50">
            <label :class="labelClass">服务周期</label>
            <div class="flex items-center gap-2">
              <div class="relative w-full">
                <input
                  type="date"
                  v-model="formData.basicInfo.serviceStartDate"
                  :class="inputClass"
                />
                <Calendar class="w-4 h-4 text-gray-400 absolute right-3 top-2.5 pointer-events-none" />
              </div>
              <span class="text-gray-400">至</span>
              <div class="relative w-full">
                <input
                  type="date"
                  v-model="formData.basicInfo.serviceEndDate"
                  :class="inputClass"
                />
                <Calendar class="w-4 h-4 text-gray-400 absolute right-3 top-2.5 pointer-events-none" />
              </div>
            </div>
          </div>

          <!-- 第四行：项目成员 -->
          <div class="md:col-span-2 p-4 rounded-lg border border-gray-100 bg-gray-50">
            <label :class="labelClass">项目成员（多选）</label>
            <div class="space-y-2">
              <div
                v-for="(emp, index) in MOCK_EMPLOYEES"
                :key="emp.id"
                class="flex items-center gap-2"
              >
                <input
                  type="checkbox"
                  :value="emp.name"
                  v-model="formData.basicInfo.projectMembers"
                  class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label class="text-sm text-gray-700">{{ emp.name }}</label>
              </div>
            </div>
            <div class="mt-1 text-xs text-gray-500">可多选项目成员</div>
          </div>

          <!-- 第五行：项目背景 -->
          <div class="md:col-span-2 p-4 rounded-lg border border-gray-100 bg-white">
            <label :class="labelClass">项目背景</label>
            <textarea
              v-model="formData.basicInfo.projectBackground"
              :class="textAreaClass"
              placeholder="请输入项目背景及目标..."
            />
          </div>

          <!-- 第六行：客户需求 -->
          <div class="md:col-span-2 p-4 rounded-lg border border-gray-100 bg-gray-50">
            <label :class="labelClass">客户需求</label>
            <textarea
              v-model="formData.basicInfo.clientDemand"
              :class="textAreaClass"
              placeholder="请输入客户需求..."
            />
          </div>

          <!-- 第七行：服务内容 -->
          <div class="md:col-span-2 p-4 rounded-lg border border-gray-100 bg-white">
            <label :class="labelClass">服务内容</label>
            <textarea
              v-model="formData.basicInfo.serviceContent"
              :class="textAreaClass"
              placeholder="请输入服务内容..."
            />
          </div>
        </div>
      </section>

      <!-- 2. 服务收入 - 优化文本域和税率 -->
      <section :class="sectionClass" id="service-income">
        <div :class="headerClass">
          <span>2. 服务收入</span>
        </div>

        <div class="divide-y divide-gray-100">
          <div
            v-for="(item, index) in formData.serviceIncome"
            :key="item.id"
            :class="[
              'p-4 relative group transition-colors',
              index % 2 === 0 ? 'bg-white' : 'bg-gray-100',
              'hover:bg-blue-50'
            ]"
          >
            <div class="absolute left-4 top-4 flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-xs font-bold">
              {{ index + 1 }}
            </div>
            <button
              @click="deleteServiceItem(item.id)"
              class="absolute right-2 top-2 p-1 text-gray-300 hover:text-red-500"
            >
              <Trash2 class="w-4 h-4" />
            </button>

            <div class="grid grid-cols-1 md:grid-cols-4 gap-4 pl-10">
              <div class="md:col-span-2">
                <label :class="labelClass">采购内容</label>
                <select
                  v-model="formData.serviceIncome[index].purchaseContent"
                  :class="inputClass"
                >
                  <option value="">请选择采购内容</option>
                  <option v-for="content in MOCK_PURCHASE_CONTENTS" :key="content" :value="content">
                    {{ content }}
                  </option>
                </select>
              </div>
              <div class="md:col-span-1">
                <label :class="labelClass">含税金额 (元)</label>
                <input
                  type="number"
                  v-model.number="formData.serviceIncome[index].amount"
                  :class="inputClass"
                  placeholder="0.00"
                />
              </div>
              <div class="md:col-span-1">
                <label :class="labelClass">税率 (%)</label>
                <input
                  type="number"
                  v-model.number="formData.serviceIncome[index].taxRate"
                  :class="inputClass"
                  placeholder="6"
                />
              </div>
              <div class="md:col-span-4">
                <label :class="labelClass">必要性描述</label>
                <textarea
                  v-model="formData.serviceIncome[index].necessityDesc"
                  :class="textAreaClass"
                  placeholder="详细描述该采购内容的必要性..."
                  rows="2"
                />
              </div>
            </div>
          </div>
          <button @click="addServiceItem" :class="addBtnClass">
            <Plus class="w-4 h-4" /> 添加服务项
          </button>
        </div>

        <div class="bg-gray-50 p-4 border-t border-gray-200 grid grid-cols-2 gap-4 text-sm">
          <div>
            <div class="text-gray-500">含税总计</div>
            <div class="font-bold text-gray-800 text-lg">{{ formatCurrency(totalRevenueInclusive) }}</div>
          </div>
          <div class="text-right">
            <div class="text-gray-500">不含税金额</div>
            <div class="font-bold text-blue-600 text-lg">{{ formatCurrency(totalRevenueInclusive / 1.06) }}</div>
          </div>
        </div>
      </section>

      <!-- 3. 外采成本 - 单位后置优化 -->
      <section :class="sectionClass" id="outsourcing-cost">
        <div :class="headerClass">3. 线下外采成本</div>
        <div class="divide-y divide-gray-100">
          <div
            v-for="(item, index) in formData.outsourcingCost"
            :key="item.id"
            :class="[
              'p-4 relative transition-colors',
              index % 2 === 0 ? 'bg-white' : 'bg-gray-50',
              'hover:bg-blue-50'
            ]"
          >
            <div class="absolute left-4 top-4 flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-xs font-bold">
              {{ index + 1 }}
            </div>
            <button @click="deleteOutsourcingItem(item.id)" class="absolute right-2 top-2 p-1 text-gray-300 hover:text-red-500">
              <Trash2 class="w-4 h-4" />
            </button>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 pl-10">
              <div>
                <label :class="labelClass">采购内容</label>
                <textarea
                  v-model="formData.outsourcingCost[index].content"
                  :class="textAreaClass"
                  rows="1"
                  placeholder="内容描述"
                />
              </div>
              <div>
                <label :class="labelClass">单价 (元)</label>
                <input
                  type="number"
                  v-model.number="formData.outsourcingCost[index].unitPrice"
                  :class="inputClass"
                />
              </div>
              <div>
                <label :class="labelClass">数量</label>
                <input
                  type="number"
                  v-model.number="formData.outsourcingCost[index].quantity"
                  :class="inputClass"
                  placeholder="数量"
                />
              </div>
            </div>
            <div class="mt-2 text-right text-xs text-gray-400">
              小计: <span class="text-gray-800 font-medium">{{ formatCurrency(item.unitPrice * item.quantity) }}</span>
            </div>
          </div>
          <button @click="addOutsourcingItem" :class="addBtnClass">
            <Plus class="w-4 h-4" /> 添加外采项
          </button>
        </div>

        <div class="bg-gray-50 p-4 border-t border-gray-200 text-sm">
          <div class="text-right">
            <div class="text-gray-500">外采成本总计</div>
            <div class="font-bold text-red-600 text-lg">{{ formatCurrency(totalOutsourcingCost) }}</div>
          </div>
        </div>
      </section>

      <!-- 4. 人工成本 - 搜索选择器 -->
      <section :class="sectionClass" id="labor-cost">
        <div :class="headerClass">4. 人工成本</div>
        <div class="divide-y divide-gray-100">
          <div
            v-for="(item, index) in formData.laborCost"
            :key="item.id"
            :class="[
              'p-4 relative transition-colors',
              index % 2 === 0 ? 'bg-white' : 'bg-gray-50',
              'hover:bg-blue-50'
            ]"
          >
            <div class="absolute left-4 top-4 flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-xs font-bold">
              {{ index + 1 }}
            </div>
            <button @click="deleteLaborItem(item.id)" class="absolute right-2 top-2 p-1 text-gray-300 hover:text-red-500">
              <Trash2 class="w-4 h-4" />
            </button>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4 pl-10">
              <div>
                <label :class="labelClass">选择员工</label>
                <select
                  v-model="formData.laborCost[index].employeeId"
                  :class="inputClass"
                  @change="handleEmployeeSelect(index, MOCK_EMPLOYEES.find(emp => emp.id === formData.laborCost[index].employeeId))"
                >
                  <option value="">请选择员工</option>
                  <option v-for="emp in MOCK_EMPLOYEES" :key="emp.id" :value="emp.id">
                    {{ emp.name }} - {{ emp.role }}
                  </option>
                </select>
                <div class="mt-1 text-xs text-gray-500">角色: {{ item.level || '-' }}</div>
              </div>
              <div>
                <label :class="labelClass">级别</label>
                <input
                  type="text"
                  v-model="formData.laborCost[index].level"
                  :class="inputClass"
                  readonly
                />
              </div>
              <div>
                <label :class="labelClass">标准成本 (元/天)</label>
                <input
                  type="number"
                  v-model.number="formData.laborCost[index].dailyCost"
                  :class="inputClass"
                />
              </div>
              <div>
                <label :class="labelClass">投入天数</label>
                <input
                  type="number"
                  v-model.number="formData.laborCost[index].days"
                  :class="inputClass"
                />
              </div>
            </div>
          </div>
          <button @click="addLaborItem" :class="addBtnClass">
            <Plus class="w-4 h-4" /> 添加人员
          </button>
        </div>

        <div class="bg-gray-50 p-4 border-t border-gray-200 text-sm">
          <div class="text-right">
            <div class="text-gray-500">人工成本总计</div>
            <div class="font-bold text-red-600 text-lg">{{ formatCurrency(totalLaborCost) }}</div>
          </div>
        </div>
      </section>

      <!-- 5. 其他费用 -->
      <section :class="sectionClass" id="other-cost">
        <div :class="headerClass">5. 其他费用</div>
        <div class="divide-y divide-gray-100">
          <div
            v-for="(item, index) in formData.otherExpenses"
            :key="item.id"
            :class="[
              'p-4 relative transition-colors',
              index % 2 === 0 ? 'bg-white' : 'bg-gray-50',
              'hover:bg-blue-50'
            ]"
          >
            <div class="absolute left-4 top-4 flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-xs font-bold">
              {{ index + 1 }}
            </div>
            <button @click="deleteOtherItem(item.id)" class="absolute right-2 top-2 p-1 text-gray-300 hover:text-red-500">
              <Trash2 class="w-4 h-4" />
            </button>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 pl-10">
              <div>
                <label :class="labelClass">费用类型</label>
                <select
                  v-model="formData.otherExpenses[index].category"
                  :class="inputClass"
                >
                  <option value="">请选择费用类型</option>
                  <option v-for="type in MOCK_EXPENSE_CATEGORIES" :key="type" :value="type">
                    {{ type }}
                  </option>
                </select>
              </div>
              <div>
                <label :class="labelClass">金额 (元)</label>
                <input
                  type="number"
                  v-model.number="formData.otherExpenses[index].amount"
                  :class="inputClass"
                />
              </div>
            </div>
          </div>
          <button @click="addOtherItem" :class="addBtnClass">
            <Plus class="w-4 h-4" /> 添加其他费用
          </button>
        </div>

        <div class="bg-gray-50 p-4 border-t border-gray-200 text-sm">
          <div class="text-right">
            <div class="text-gray-500">其他费用总计</div>
            <div class="font-bold text-red-600 text-lg">{{ formatCurrency(totalOtherCost) }}</div>
          </div>
        </div>
      </section>
    </main>

    <!-- 底部固定栏 - 利润汇总与操作 -->
    <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] z-30 pb-safe">
      <div class="max-w-4xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
        <!-- 数据概览 -->
        <div class="flex items-center justify-between w-full md:w-auto gap-6 text-sm">
          <div>
            <div class="text-gray-500 text-xs">总成本</div>
            <div class="font-bold text-gray-800">{{ formatCurrency(totalCost) }}</div>
          </div>
          <div>
            <div class="text-gray-500 text-xs">毛利润</div>
            <div :class="['font-bold', grossProfit >= 0 ? 'text-green-600' : 'text-red-600']">
              {{ formatCurrency(grossProfit) }}
            </div>
          </div>
          <div>
            <div class="text-gray-500 text-xs">利润率</div>
            <div :class="['font-bold text-lg', profitMargin >= 0 ? 'text-green-600' : 'text-red-600']">
              {{ profitMargin.toFixed(1) }}%
            </div>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="flex gap-3 w-full md:w-auto">
          <button
            @click="handleSaveDraft"
            class="flex-1 md:flex-none px-6 py-2.5 border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50 transition active:scale-95"
          >
            保存草稿
          </button>
          <button
            @click="handleSubmit"
            class="flex-1 md:flex-none px-6 py-2.5 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 shadow-sm transition active:scale-95 flex items-center justify-center gap-2"
          >
            <Save class="w-4 h-4" /> {{ isEdit ? '更新项目' : '提交审批' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 组件内部样式 */
</style>