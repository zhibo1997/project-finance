<script setup lang="ts">
import { ref, computed } from 'vue';
import { 
  Wallet, 
  FileText, 
  CreditCard, 
  TrendingUp, 
  Briefcase, 
  List, 
  LayoutGrid, 
  AlertCircle 
} from 'lucide-vue-next';

import { PROJECT_DATA, calculateCategoryTotal, formatCurrency } from '../data/projectData';
import Header from '../components/Header.vue';
import MetricCard from '../components/MetricCard.vue';
import ChartsView from '../components/ChartsView.vue';
import ListView from '../components/ListView.vue';

const { basicInfo, summary, categories } = PROJECT_DATA;
const viewMode = ref<'list' | 'chart'>('list');

// Calculations
const totalActual = computed(() => categories.reduce((sum, cat) => sum + calculateCategoryTotal(cat.expenses), 0));
const totalBudget = summary.budget.amount;
const grossProfit = computed(() => summary.income.amount - totalActual.value);
const profitRate = computed(() => ((grossProfit.value / summary.income.amount) * 100).toFixed(1));
const budgetConsumedPercent = computed(() => ((totalActual.value / totalBudget) * 100).toFixed(1));

</script>

<template>
  <div class="min-h-screen bg-[#F5F5F7] text-[#1D1D1F] font-sans selection:bg-gray-200 selection:text-gray-900 pb-12">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      
      <!-- 1. Header Section -->
      <Header :info="basicInfo" />

      <!-- 2. Summary Cards Section -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          label="项目总收入" 
          :value="formatCurrency(summary.income.amount)" 
          :icon="Wallet"
          subValue="已确认合同金额"
          type="neutral"
        />
        <MetricCard 
          label="业务成本预算" 
          :value="formatCurrency(totalBudget)" 
          :icon="FileText"
          subValue="不含人工成本"
          type="neutral"
        />
        <MetricCard 
          label="实际支出" 
          :value="formatCurrency(totalActual)" 
          :icon="CreditCard"
          :subValue="`${budgetConsumedPercent}% 预算消耗`"
          type="dark" 
        />
        <MetricCard 
          label="当前毛利" 
          :value="formatCurrency(grossProfit)" 
          :icon="TrendingUp"
          :subValue="`毛利率 ${profitRate}%`"
          :trend="profitRate"
          type="neutral"
        />
      </div>

      <!-- 3. Details / Charts Section -->
      <div class="space-y-4">
        <!-- Section Header & Toggle -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 class="text-lg font-semibold text-gray-900 tracking-tight flex items-center gap-2">
            <Briefcase :size="18" class="text-gray-500"/>
            资金分析与明细
          </h2>
          
          <!-- Toggle Control -->
          <div class="bg-gray-200/50 p-1 rounded-lg flex items-center self-start sm:self-auto">
            <button 
              @click="viewMode = 'list'"
              class="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200"
              :class="viewMode === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'"
            >
              <List :size="14" />
              明细列表
            </button>
            <button 
              @click="viewMode = 'chart'"
              class="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200"
              :class="viewMode === 'chart' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'"
            >
              <LayoutGrid :size="14" />
              可视化报表
            </button>
          </div>
        </div>

        <!-- Content Area -->
        <div class="min-h-[400px]">
           <ListView v-if="viewMode === 'list'" :data="categories" />
           <ChartsView 
             v-else 
             :data="categories" 
             :totalBudget="totalBudget" 
             :totalActual="totalActual" 
           />
        </div>
        
        <!-- Note Footer -->
        <div class="flex items-start gap-2 text-xs text-gray-400 px-2 mt-4 max-w-3xl">
          <AlertCircle :size="14" class="mt-0.5 shrink-0" />
          <p>
            数据说明：项目收入为独立具体项目收入。业务成本预算包含除人工成本外的所有费用支出。如因项目调整导致预算变更，需重新补充立项审批单。
          </p>
        </div>
      </div>

    </div>
  </div>
</template>
