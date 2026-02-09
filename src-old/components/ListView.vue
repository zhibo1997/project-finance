<script setup lang="ts">
import { ref, computed } from 'vue';
import { Search } from 'lucide-vue-next';
import { formatCurrency } from '../data/projectData';

const props = defineProps<{
  data: any[];
}>();

const selectedCategory = ref<string | null>(null);

const filteredExpenses = computed(() => {
  const allExpenses = [];
  props.data.forEach(cat => {
    cat.expenses.forEach(exp => {
      allExpenses.push({
        ...exp,
        categoryId: cat.id,
        categoryName: cat.name
      });
    });
  });

  let filtered = allExpenses.filter(exp => selectedCategory.value === null || exp.categoryId === selectedCategory.value);

  // 按照时间排序
  filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return filtered;
});

const categories = computed(() => {
  return props.data.map(cat => ({
    id: cat.id,
    name: cat.name
  }));
});

const toggleCategory = (categoryId: string) => {
  if (selectedCategory.value === categoryId) {
    selectedCategory.value = null;
  } else {
    selectedCategory.value = categoryId;
  }
};

</script>

<template>
  <div class="bg-white rounded-xl border border-gray-200/80 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
    <!-- 搜索和过滤栏 -->
    <div class="p-4 bg-gray-50 border-b border-gray-100">
      <div class="flex flex-col sm:flex-row gap-4">
        <!-- 搜索框 -->
        <div class="relative flex-1">
          <Search :size="16" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="搜索费用描述..."
            class="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <!-- 科目类型过滤 -->
        <div class="flex flex-wrap gap-2">
          <span class="text-xs font-medium text-gray-500 self-center">科目类型:</span>
          <button
            @click="selectedCategory = null"
            class="px-3 py-1.5 text-xs rounded-full border transition-colors"
            :class="selectedCategory === null
              ? 'bg-blue-100 border-blue-200 text-blue-700'
              : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'"
          >
            全部
          </button>
          <button
            v-for="cat in categories"
            :key="cat.id"
            @click="toggleCategory(cat.id)"
            class="px-3 py-1.5 text-xs rounded-full border transition-colors"
            :class="selectedCategory === cat.id
              ? 'bg-blue-100 border-blue-200 text-blue-700'
              : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'"
          >
            {{ cat.name }}
          </button>
        </div>
      </div>
    </div>

    <!-- 记录列表 -->
    <div class="divide-y divide-gray-50">
      <div
        v-for="(exp, idx) in filteredExpenses"
        :key="idx"
        class="grid grid-cols-12 gap-4 py-4 px-6 items-center hover:bg-gray-50/30 transition-colors"
      >
        <!-- 时间 -->
        <div class="col-span-3 sm:col-span-2">
          <div class="text-xs text-gray-500">{{ exp.date }}</div>
        </div>

        <!-- 科目类型 -->
        <div class="col-span-2 sm:col-span-1">
          <span class="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700">
            {{ exp.categoryName }}
          </span>
        </div>

        <!-- 费用描述 -->
        <div class="col-span-4 sm:col-span-5">
          <div class="text-sm font-medium text-gray-900">{{ exp.desc }}</div>
        </div>

        <!-- 金额 -->
        <div class="col-span-3 sm:col-span-2 text-right">
          <div class="text-sm font-mono font-medium text-gray-900">{{ formatCurrency(exp.amount) }}</div>
        </div>

        <!-- 操作 -->
        <div class="col-span-0 sm:col-span-2 text-right">
          <button class="text-xs text-gray-400 hover:text-blue-600 transition-colors">
            详情
          </button>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="filteredExpenses.length === 0" class="py-12 text-center">
        <div class="text-gray-400 text-sm">暂无费用记录</div>
      </div>
    </div>

    <!-- 统计信息 -->
    <div class="p-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
      <div class="text-xs text-gray-500">共 {{ filteredExpenses.length }} 条记录</div>
      <div class="text-sm font-semibold text-gray-900">
        合计: {{ formatCurrency(filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0)) }}
      </div>
    </div>
  </div>
</template>