<script setup lang="ts">
import { ref, computed } from 'vue';
import { ChevronDown } from 'lucide-vue-next';
import { calculateCategoryTotal, formatCurrency } from '../data/projectData';

const props = defineProps<{
  item: {
    id: string;
    name: string;
    fullName: string;
    budget: number;
    expenses: { amount: number; desc: string }[];
  }
}>();

const isExpanded = ref(false);
const actualUsed = computed(() => calculateCategoryTotal(props.item.expenses));
const progress = computed(() => Math.min((actualUsed.value / props.item.budget) * 100, 100));
const isOverBudget = computed(() => actualUsed.value > props.item.budget);

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value;
};
</script>

<template>
  <div class="group transition-colors hover:bg-gray-50/30">
    <div
      class="grid grid-cols-12 gap-4 py-4 px-6 items-center cursor-pointer"
      @click="toggleExpand"
    >
      <div class="col-span-5 sm:col-span-4 flex items-center gap-3">
        <button
          class="p-1 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-200"
          :class="{ 'rotate-180 bg-gray-100': isExpanded }"
        >
           <ChevronDown :size="14" />
        </button>
        <div>
          <div class="text-sm font-medium text-gray-900">{{ item.name }}</div>
          <div class="text-[10px] text-gray-400 hidden sm:block">{{ item.fullName }}</div>
        </div>
      </div>

      <div class="col-span-3 sm:col-span-3 text-right text-sm text-gray-500 font-mono">
        {{ formatCurrency(item.budget) }}
      </div>

      <div class="col-span-4 sm:col-span-3 text-right">
        <div
          class="text-sm font-mono font-medium"
          :class="isOverBudget ? 'text-orange-600' : 'text-gray-900'"
        >
          {{ formatCurrency(actualUsed) }}
        </div>
      </div>

      <div class="hidden sm:flex col-span-2 items-center justify-end gap-2">
         <div class="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
           <div
              class="h-full rounded-full transition-all duration-500"
              :class="isOverBudget ? 'bg-orange-500' : 'bg-gray-800'"
              :style="{ width: `${progress}%` }"
           />
         </div>
      </div>
    </div>

    <div v-if="isExpanded" class="bg-gray-50/50 border-t border-gray-100 px-6 py-4">
      <div class="max-w-3xl ml-auto sm:mr-12">
        <div v-if="item.expenses.length > 0" class="space-y-2">
          <div
            v-for="(exp, idx) in item.expenses"
            :key="idx"
            class="flex justify-between items-center text-sm p-2 rounded hover:bg-white hover:shadow-sm transition-all border border-transparent hover:border-gray-100"
          >
            <span class="text-gray-600">{{ exp.desc }}</span>
            <span class="font-mono text-gray-900">{{ formatCurrency(exp.amount) }}</span>
          </div>
        </div>
        <div v-else class="text-gray-400 text-xs italic py-2">本月暂无报销记录</div>
      </div>
    </div>
  </div>
</template>
