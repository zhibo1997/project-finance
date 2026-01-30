<script setup lang="ts">
import BudgetRow from './BudgetRow.vue';

defineProps<{
  data: any[];
}>();
</script>

<template>
  <div class="bg-white rounded-xl border border-gray-200/80 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
     <div class="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50/50 border-b border-gray-100 text-xs font-medium text-gray-500 uppercase tracking-wider">
        <div class="col-span-5 sm:col-span-4">预算科目</div>
        <div class="col-span-3 sm:col-span-3 text-right">预算额度</div>
        <div class="col-span-4 sm:col-span-3 text-right">实际支出</div>
        <div class="hidden sm:block sm:col-span-2 text-right">进度</div>
      </div>
      <div class="divide-y divide-gray-50">
        <BudgetRow 
          v-for="cat in data" 
          :key="cat.id" 
          :item="cat" 
        />
      </div>
  </div>
</template>
