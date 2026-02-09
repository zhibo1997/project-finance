<script setup lang="ts">
import { ref, computed, watchEffect, onMounted, onUnmounted } from 'vue'
import { Search, ChevronDown, X } from 'lucide-vue-next'

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

// Props
const props = defineProps<{
  modelValue: string[]
}>()

// Emits
const emit = defineEmits<{
  (e: 'update:modelValue', value: string[]): void
}>()

// 内部状态
const isOpen = ref(false)
const search = ref('')
const wrapperRef = ref<HTMLElement | null>(null)

// 计算属性
const selectedEmployees = computed(() => {
  return EMPLOYEE_DB.filter(emp => props.modelValue.includes(emp.id))
})

const filteredOptions = computed(() => {
  if (!search.value) return EMPLOYEE_DB.slice(0, 20) // 默认显示前20个
  return EMPLOYEE_DB.filter(e => e.name.includes(search.value) || e.role.includes(search.value)).slice(0, 20)
})

// 事件处理
const handleClickOutside = (event: MouseEvent) => {
  if (wrapperRef.value && !wrapperRef.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

const handleSelect = (emp: any) => {
  const currentValues = [...props.modelValue]
  if (currentValues.includes(emp.id)) {
    // 如果已选中，取消选中
    const newValue = currentValues.filter(id => id !== emp.id)
    emit('update:modelValue', newValue)
  } else {
    // 如果未选中，添加到选中列表
    emit('update:modelValue', [...currentValues, emp.id])
  }
}

const removeEmployee = (empId: string) => {
  const newValue = props.modelValue.filter(id => id !== empId)
  emit('update:modelValue', newValue)
}

// 生命周期钩子
onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside)
})
</script>

<template>
  <div class="relative w-full" ref="wrapperRef">
    <div
      class="flex items-center flex-wrap gap-1 justify-between w-full border border-gray-300 rounded px-3 py-2 bg-white cursor-text hover:border-blue-500 transition-colors min-h-[38px]"
      @click="isOpen = true"
    >
      <div v-if="selectedEmployees.length > 0" class="flex flex-wrap gap-1 flex-1">
        <span
          v-for="emp in selectedEmployees"
          :key="emp.id"
          class="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
        >
          {{ emp.name }}
          <button
            @click.stop="removeEmployee(emp.id)"
            class="text-blue-600 hover:text-blue-800"
          >
            <X class="w-3 h-3" />
          </button>
        </span>
      </div>
      <span v-else class="text-sm text-gray-400 flex-1">
        选择项目成员...
      </span>
      <ChevronDown class="w-4 h-4 text-gray-400 flex-shrink-0" />
    </div>

    <div v-if="isOpen" class="absolute z-[99999] w-full mt-1 bg-white border border-gray-200 rounded shadow-lg max-h-60 overflow-auto">
      <div class="sticky top-0 bg-gray-50 p-2 border-b border-gray-100">
        <div class="flex items-center bg-white border border-gray-200 rounded px-2">
          <Search class="w-4 h-4 text-gray-400" />
          <input
            autofocus
            class="w-full p-2 text-sm outline-none"
            placeholder="输入姓名或角色搜索..."
            v-model="search"
          />
        </div>
      </div>
      <div v-if="filteredOptions.length === 0" class="p-4 text-center text-gray-400 text-sm">无匹配人员</div>
      <div v-else>
        <div
          v-for="emp in filteredOptions"
          :key="emp.id"
          class="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm border-b border-gray-50 last:border-0 flex items-center justify-between"
          @click="handleSelect(emp)"
        >
          <div class="flex-1">
            <div class="font-medium text-gray-800">{{ emp.name }}</div>
            <div class="text-xs text-gray-500">{{ emp.role }}</div>
          </div>
          <div v-if="props.modelValue.includes(emp.id)" class="ml-2 text-blue-600">
            ✓
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 组件内部样式 */
</style>
