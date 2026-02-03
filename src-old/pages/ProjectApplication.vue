<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Plus, Trash2, Save, Calendar, Calculator, X, ArrowLeft } from 'lucide-vue-next'
import SearchableEmployeeSelect from '@/components/SearchableEmployeeSelect.vue'
import MultiSelectEmployee from '@/components/MultiSelectEmployee.vue'

const router = useRouter()

const handleBack = () => {
  router.push('/')
}

// --- 模拟海量员工数据库 (100+ 条数据模拟) ---
const generateLargeEmployeeDB = () => {
  const roles = ['项目总监', '高级顾问', '讲师', '助教', '运营专员', '技术支持', '设计师']
  const baseNames = ['张', '王', '李', '赵', '陈', '刘', '杨', '黄', '吴', '周']
  const db = []

  // 生成一些固定方便测试的人员
  db.push({ id: 'E001', name: '任志祥', role: '项目总监', standardCost: 5000 })

  for (let i = 0; i < 100; i++) {
    const name = baseNames[Math.floor(Math.random() * baseNames.length)] + (Math.floor(Math.random() * 1000))
    const role = roles[Math.floor(Math.random() * roles.length)]
    db.push({
      id: `EMP${1000 + i}`,
      name: name,
      role: role,
      standardCost: role === '项目总监' ? 5000 : role === '高级顾问' ? 3500 : 1500
    })
  }
  return db
}

const EMPLOYEE_DB = generateLargeEmployeeDB()

// 费用类型选项
const EXPENSE_TYPES = ['差旅费', '招待费', '物料制作费', '场地租赁费', '专家咨询费', '其他杂费']

// --- 类型定义 ---
interface ProjectBasicInfo {
  projectName: string
  projectLeader: string
  clientName: string
  contactPerson: string
  startDate: string
  endDate: string
  background: string
  projectMembers: string[] // 项目成员（多选）
}
interface ServiceItem {
  id: string
  content: string
  amount: number
}

interface OutsourcingItem {
  id: string
  content: string
  price: number
  quantity: number
  unit: string
}

interface LaborItem {
  id: string
  employeeId: string
  name: string
  role: string
  dailyCost: number
  days: number
}

interface OtherExpenseItem {
  id: string
  type: string
  description: string
  amount: number
}

// --- 辅助函数 ---
const generateId = () => Math.random().toString(36).substr(2, 9)
const formatCurrency = (num: number) => num.toLocaleString('zh-CN', { style: 'currency', currency: 'CNY', minimumFractionDigits: 2 })

// --- 响应式状态 ---
// 1. 基础信息
const basicInfo = ref<ProjectBasicInfo>({
  projectName: '社招新人文化融入项目',
  projectLeader: '任志祥',
  clientName: '集团各组织',
  contactPerson: '各组织人发',
  startDate: '2025-04-01',
  endDate: '2025-12-31',
  background: '通过组织新入司伙伴文化融入项目，帮助新入司伙伴快速理解认知新奥文化。',
  projectMembers: [] // 初始化项目成员为空数组
})

// 2. 收入与税率
const taxRate = ref<string>('6') // 使用字符串处理输入，避免0的问题
const serviceItems = ref<ServiceItem[]>([
  { id: 'S1', content: '线下学习：参观体验、发展史介绍、座谈会', amount: 254400 }
])

// 3. 外采
const outsourcingItems = ref<OutsourcingItem[]>([
  { id: 'O1', content: '场地费', price: 1500, quantity: 16, unit: '天' },
  { id: 'O2', content: '参观车辆费用', price: 2000, quantity: 8, unit: '期' }
])

// 4. 人工
const laborItems = ref<LaborItem[]>([
  { id: 'L1', employeeId: 'E001', name: '任志祥', role: '项目总监', dailyCost: 5000, days: 5 }
])

// 5. 其他费用
const otherItems = ref<OtherExpenseItem[]>([
  { id: 'Misc1', type: '差旅费', description: '项目组异地差旅', amount: 5000 }
])

// --- 计算属性 ---
const totalRevenueInclusive = computed(() => serviceItems.value.reduce((sum, item) => sum + item.amount, 0))

// 修正后的税收计算：按照用户要求，如果税率100%，收入为0。即 Revenue = Total * (1 - Rate)
const netRevenue = computed(() => {
  const rate = parseFloat(taxRate.value) || 0
  return totalRevenueInclusive.value * (1 - rate / 100)
})

const totalOutsourcingCost = computed(() => outsourcingItems.value.reduce((sum, item) => sum + (item.price * item.quantity), 0))
const totalLaborCost = computed(() => laborItems.value.reduce((sum, item) => sum + (item.dailyCost * item.days), 0))
const totalOtherCost = computed(() => otherItems.value.reduce((sum, item) => sum + item.amount, 0))

const totalCost = computed(() => totalOutsourcingCost.value + totalLaborCost.value + totalOtherCost.value)
const grossProfit = computed(() => netRevenue.value - totalCost.value)
// 利润率计算：毛利 / 净收入 (如果净收入为0，则为0)
const profitMargin = computed(() => netRevenue.value !== 0 ? (grossProfit.value / netRevenue.value) * 100 : 0)


// --- 事件处理函数 ---
// 服务项
const addServiceItem = () => {
  serviceItems.value.push({ id: generateId(), content: '', amount: 0 })
}

const deleteServiceItem = (id: string) => {
  serviceItems.value = serviceItems.value.filter(item => item.id !== id)
}

const updateServiceItem = (index: number, field: keyof ServiceItem, value: string | number) => {
  serviceItems.value[index] = {
    ...serviceItems.value[index],
    [field]: value
  }
}

// 外采项
const addOutsourcingItem = () => {
  outsourcingItems.value.push({ id: generateId(), content: '', price: 0, quantity: 1, unit: '个' })
}

const deleteOutsourcingItem = (id: string) => {
  outsourcingItems.value = outsourcingItems.value.filter(item => item.id !== id)
}

const updateOutsourcingItem = (index: number, field: keyof OutsourcingItem, value: string | number) => {
  outsourcingItems.value[index] = {
    ...outsourcingItems.value[index],
    [field]: value
  }
}

// 人工项
const addLaborItem = () => {
  laborItems.value.push({ id: generateId(), employeeId: '', name: '', role: '', dailyCost: 0, days: 0 })
}

const deleteLaborItem = (id: string) => {
  laborItems.value = laborItems.value.filter(item => item.id !== id)
}

const updateLaborItem = (index: number, field: keyof LaborItem, value: string | number) => {
  laborItems.value[index] = {
    ...laborItems.value[index],
    [field]: value
  }
}

const handleEmployeeSelect = (index: number, emp: any) => {
  laborItems.value[index] = {
    ...laborItems.value[index],
    employeeId: emp.id,
    name: emp.name,
    role: emp.role,
    dailyCost: emp.standardCost
  }
}

// 其他费用
const addOtherItem = () => {
  otherItems.value.push({ id: generateId(), type: '其他杂费', description: '', amount: 0 })
}

const deleteOtherItem = (id: string) => {
  otherItems.value = otherItems.value.filter(item => item.id !== id)
}

const updateOtherItem = (index: number, field: keyof OtherExpenseItem, value: string | number) => {
  otherItems.value[index] = {
    ...otherItems.value[index],
    [field]: value
  }
}

// 保存和提交逻辑
const handleSaveDraft = () => {
  console.log('保存草稿', basicInfo.value)
  // 这里可以添加保存到本地存储或API的逻辑
  alert('草稿已保存')
}

const handleSubmit = () => {
  console.log('提交审批', basicInfo.value)
  // 这里可以添加提交到API的逻辑
  alert('已提交审批')
}

// 样式类
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
          <h1 class="text-base font-bold text-gray-800">立项申请表</h1>
        </div>
        <span class="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded border border-yellow-200">
          草稿
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
              v-model="basicInfo.projectName"
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
              v-model="basicInfo.projectLeader"
              :class="inputClass"
            />
          </div>

          <!-- 第二行：客户 + 联系人 -->
          <div :class="[
            'p-4 rounded-lg border',
            'border-gray-100 bg-white'
          ]">
            <label :class="labelClass">客户名称</label>
            <input
              type="text"
              v-model="basicInfo.clientName"
              :class="inputClass"
            />
          </div>
          <div :class="[
            'p-4 rounded-lg border',
            'border-gray-100 bg-gray-50'
          ]">
            <label :class="labelClass">客户联系人</label>
            <input
              type="text"
              v-model="basicInfo.contactPerson"
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
                  v-model="basicInfo.startDate"
                  :class="inputClass"
                />
                <Calendar class="w-4 h-4 text-gray-400 absolute right-3 top-2.5 pointer-events-none" />
              </div>
              <span class="text-gray-400">至</span>
              <div class="relative w-full">
                <input
                  type="date"
                  v-model="basicInfo.endDate"
                  :class="inputClass"
                />
                <Calendar class="w-4 h-4 text-gray-400 absolute right-3 top-2.5 pointer-events-none" />
              </div>
            </div>
          </div>

          <!-- 第四行：项目成员 -->
          <div class="md:col-span-2 p-4 rounded-lg border border-gray-100 bg-gray-50">
            <label :class="labelClass">项目成员</label>
            <MultiSelectEmployee
              v-model="basicInfo.projectMembers"
            />
            <div class="mt-1 text-xs text-gray-500">可多选项目成员</div>
          </div>


          <!-- 第六行：背景 -->
          <div class="md:col-span-2 p-4 rounded-lg border border-gray-100 bg-white">
            <label :class="labelClass">项目背景</label>
            <textarea
              v-model="basicInfo.background"
              :class="textAreaClass"
              placeholder="请输入项目背景及目标..."
            />
          </div>
        </div>
      </section>

      <!-- 2. 服务收入 - 优化文本域和税率 -->
      <section :class="sectionClass" id="service-income">
        <div :class="headerClass">
          <span>2. 服务收入</span>
          <div class="flex items-center gap-2 font-normal">
            <span class="text-xs text-gray-500">税率(%)</span>
            <input
              type="number"
              v-model="taxRate"
              class="w-16 border border-gray-300 rounded px-2 py-1 text-sm text-right focus:border-blue-500 outline-none"
            />
          </div>
        </div>

        <div class="divide-y divide-gray-100">
          <div
            v-for="(item, index) in serviceItems"
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
              class="absolute right-2 top-2 p-1 text-gray-300 hover:text-red-500 md:hidden group-hover:block"
            >
              <Trash2 class="w-4 h-4" />
            </button>

            <div class="grid grid-cols-1 md:grid-cols-4 gap-4 pl-10">
              <div class="md:col-span-3">
                <label :class="labelClass">服务内容</label>
                <textarea
                  v-model="serviceItems[index].content"
                  :class="textAreaClass"
                  placeholder="详细描述服务内容..."
                  rows="2"
                />
              </div>
              <div>
                <label :class="labelClass">含税金额 (元)</label>
                <input
                  type="number"
                  v-model.number="serviceItems[index].amount"
                  :class="inputClass"
                  placeholder="0.00"
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
            <div class="text-gray-500">预计净收入 (扣除税额)</div>
            <div class="font-bold text-blue-600 text-lg">{{ formatCurrency(netRevenue) }}</div>
          </div>
        </div>
      </section>

      <!-- 3. 外采成本 - 单位后置优化 -->
      <section :class="sectionClass" id="outsourcing-cost">
        <div :class="headerClass">3. 线下外采成本</div>
        <div class="divide-y divide-gray-100">
          <div
            v-for="(item, index) in outsourcingItems"
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
            <div class="grid grid-cols-1 md:grid-cols-12 gap-3 pl-10">
              <div class="md:col-span-5">
                <label :class="labelClass">采购内容</label>
                <textarea
                  v-model="outsourcingItems[index].content"
                  :class="textAreaClass"
                  rows="1"
                  placeholder="内容描述"
                />
              </div>
              <div class="md:col-span-3">
                <label :class="labelClass">单价 (元)</label>
                <input
                  type="number"
                  v-model.number="outsourcingItems[index].price"
                  :class="inputClass"
                />
              </div>
              <!-- 数量与单位组合 -->
              <div class="md:col-span-4">
                <label :class="labelClass">采购量 & 单位</label>
                <div class="flex">
                  <input
                    type="number"
                    v-model.number="outsourcingItems[index].quantity"
                    class="w-2/3 border border-r-0 border-gray-300 rounded-l px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                    placeholder="数量"
                  />
                  <input
                    type="text"
                    v-model="outsourcingItems[index].unit"
                    class="w-1/3 border border-gray-300 rounded-r bg-gray-50 px-3 py-2 text-sm text-center text-gray-600 focus:bg-white outline-none"
                    placeholder="单位"
                  />
                </div>
              </div>
            </div>
            <div class="mt-2 text-right text-xs text-gray-400">
              小计: <span class="text-gray-800 font-medium">{{ formatCurrency(item.price * item.quantity) }}</span>
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
            v-for="(item, index) in laborItems"
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
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 pl-10">
              <div>
                <label :class="labelClass">选择员工 (搜索)</label>
                <SearchableEmployeeSelect
                  :value="item.employeeId"
                  @update:value="(emp) => handleEmployeeSelect(index, emp)"
                />
                <div class="mt-1 text-xs text-gray-500">角色: {{ item.role || '-' }}</div>
              </div>
              <div>
                <label :class="labelClass">标准成本 (元/天)</label>
                <input
                  type="number"
                  v-model.number="laborItems[index].dailyCost"
                  :class="inputClass"
                />
              </div>
              <div>
                <label :class="labelClass">投入天数</label>
                <input
                  type="number"
                  v-model.number="laborItems[index].days"
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
            v-for="(item, index) in otherItems"
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
                <div class="relative">
                  <select
                    v-model="otherItems[index].type"
                    :class="[inputClass, 'appearance-none bg-white']"
                  >
                    <option v-for="t in EXPENSE_TYPES" :key="t" :value="t">{{ t }}</option>
                  </select>
                  <ChevronDown class="w-4 h-4 text-gray-400 absolute right-3 top-2.5 pointer-events-none" />
                </div>
              </div>
              <div>
                <label :class="labelClass">金额 (元)</label>
                <input
                  type="number"
                  v-model.number="otherItems[index].amount"
                  :class="inputClass"
                />
              </div>
              <div class="md:col-span-3">
                <label :class="labelClass">费用说明</label>
                <textarea
                  v-model="otherItems[index].description"
                  :class="textAreaClass"
                  placeholder="请填写具体费用用途"
                  rows="1"
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
            <Save class="w-4 h-4" /> 提交审批
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
/* 组件内部样式 */
</style>
