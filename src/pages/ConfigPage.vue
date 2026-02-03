<script setup lang="ts">
import { ref } from 'vue'
import { Settings, Tags, ShoppingCart, Users } from 'lucide-vue-next'
import ExpenseCategoryManager from '@/components/config/ExpenseCategoryManager.vue'
import PurchaseContentManager from '@/components/config/PurchaseContentManager.vue'
import EmployeeCostConfig from '@/components/config/EmployeeCostConfig.vue'

type TabType = 'expense' | 'purchase' | 'employee'

const activeTab = ref<TabType>('expense')
</script>

<template>
  <div class="min-h-screen bg-[#F5F5F7] text-[#1D1D1F] font-sans pb-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      <!-- 页面标题 -->
      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div class="flex items-center gap-3">
          <Settings :size="24" class="text-blue-600" />
          <h1 class="text-2xl font-bold text-gray-900">配置管理</h1>
        </div>
        <p class="mt-2 text-gray-500">管理系统的基础配置数据，包括费用类别、采购内容和员工成本配置</p>
      </div>

      <!-- 标签页导航 -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100">
        <div class="border-b border-gray-100 px-6">
          <nav class="flex space-x-8" aria-label="Tabs">
            <button
              @click="activeTab = 'expense'"
              class="py-4 px-1 border-b-2 font-medium text-sm transition-colors"
              :class="
                activeTab === 'expense'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              "
            >
              <div class="flex items-center gap-2">
                <Tags :size="16" />
                费用类别
              </div>
            </button>
            <button
              @click="activeTab = 'purchase'"
              class="py-4 px-1 border-b-2 font-medium text-sm transition-colors"
              :class="
                activeTab === 'purchase'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              "
            >
              <div class="flex items-center gap-2">
                <ShoppingCart :size="16" />
                采购内容
              </div>
            </button>
            <button
              @click="activeTab = 'employee'"
              class="py-4 px-1 border-b-2 font-medium text-sm transition-colors"
              :class="
                activeTab === 'employee'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              "
            >
              <div class="flex items-center gap-2">
                <Users :size="16" />
                员工成本配置
              </div>
            </button>
          </nav>
        </div>

        <!-- 标签页内容 -->
        <div class="p-6">
          <ExpenseCategoryManager v-if="activeTab === 'expense'" />
          <PurchaseContentManager v-if="activeTab === 'purchase'" />
          <EmployeeCostConfig v-if="activeTab === 'employee'" />
        </div>
      </div>
    </div>
  </div>
</template>
