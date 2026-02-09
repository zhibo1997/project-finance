<script setup lang="ts">
import { type Category } from '~/data/projectData'
import { calculateCategoryTotal, formatCurrency } from '~/data/projectData'

const props = defineProps<{
  category: Category
}>()

const actualExpense = calculateCategoryTotal(props.category.expenses)
const remainingBudget = props.category.budget - actualExpense
const executionRate = props.category.budget > 0
  ? Math.min((actualExpense / props.category.budget) * 100, 100)
  : 0
const isOverBudget = remainingBudget < 0
</script>

<template>
  <tr class="hover:bg-gray-50 transition-colors">
    <td class="px-6 py-4 font-medium text-gray-900 flex items-center gap-2">
      <span class="text-lg">{{ category.icon }}</span>
      {{ category.name }}
    </td>
    <td class="px-6 py-4 text-gray-700 font-medium">
      {{ formatCurrency(category.budget) }}
    </td>
    <td class="px-6 py-4 text-gray-700 font-medium">
      {{ formatCurrency(actualExpense) }}
    </td>
    <td class="px-6 py-4">
      <span
        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
        :class="isOverBudget
          ? 'bg-red-100 text-red-800'
          : 'bg-green-100 text-green-800'"
      >
        {{ isOverBudget ? '超出' : '剩余' }} {{ formatCurrency(Math.abs(remainingBudget)) }}
      </span>
    </td>
    <td class="px-6 py-4">
      <div class="flex items-center gap-2">
        <div class="w-24 bg-gray-200 rounded-full h-2">
          <div
            class="h-full rounded-full transition-all duration-500"
            :class="isOverBudget ? 'bg-red-500' : 'bg-blue-500'"
            :style="{ width: `${executionRate}%` }"
          ></div>
        </div>
        <span class="text-sm text-gray-600 font-medium">
          {{ Math.round(executionRate) }}%
        </span>
      </div>
    </td>
    <td class="px-6 py-4">
      <button class="text-blue-600 hover:text-blue-900 text-sm font-medium">
        详情
      </button>
    </td>
  </tr>
</template>
