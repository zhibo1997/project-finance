<script setup lang="ts">
import { type Category } from '~/data/projectData'
import BudgetRow from './BudgetRow.vue'

defineProps<{
  data: Category[]
}>()
</script>

<template>
  <div class="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
    <div class="overflow-x-auto">
      <table class="w-full text-sm text-left">
        <thead class="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
          <tr>
            <th class="px-6 py-4">类别</th>
            <th class="px-6 py-4">预算金额</th>
            <th class="px-6 py-4">实际支出</th>
            <th class="px-6 py-4">预算剩余</th>
            <th class="px-6 py-4">执行率</th>
            <th class="px-6 py-4">操作</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <BudgetRow
            v-for="category in data"
            :key="category.id"
            :category="category"
          />
        </tbody>
      </table>
    </div>
  </div>
</template>
