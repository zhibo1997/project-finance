<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  TrendingUp,
  Briefcase,
  List,
  LayoutGrid,
  AlertCircle,
  Target,
  PieChart,
  BarChart3
} from 'lucide-vue-next';

import { PROJECT_DATA, calculateCategoryTotal, formatCurrency } from '../data/projectData';
import Header from '../components/Header.vue';
import MetricCard from '../components/MetricCard.vue';
import ChartsView from '../components/ChartsView.vue';
import ListView from '../components/ListView.vue';

const { basicInfo, summary, categories } = PROJECT_DATA;
const viewMode = ref<'list' | 'chart'>('list');

// 核心财务数据
const estimatedIncome = summary.income.amount; // 预计收入
const recordedIncome = summary.recordedIncome; // 入账收入
const estimatedExpense = summary.budget.amount; // 预计支出
const actualExpense = computed(() => categories.reduce((sum, cat) => sum + calculateCategoryTotal(cat.expenses), 0)); // 实际支出

// 专业财务指标计算
const incomeDeviation = computed(() => recordedIncome - estimatedIncome); // 收入偏差
const incomeDeviationRate = computed(() => estimatedIncome > 0 ? ((incomeDeviation.value / estimatedIncome) * 100).toFixed(1) : '0.0'); // 收入偏差率
const expenseDeviation = computed(() => actualExpense.value - estimatedExpense); // 支出偏差
const expenseDeviationRate = computed(() => estimatedExpense > 0 ? ((expenseDeviation.value / estimatedExpense) * 100).toFixed(1) : '0.0'); // 支出偏差率
const estimatedGrossProfit = estimatedIncome - estimatedExpense; // 预计毛利额
const estimatedGrossProfitMargin = estimatedIncome > 0 ? ((estimatedGrossProfit / estimatedIncome) * 100).toFixed(1) : '0.0'; // 预计毛利率
const actualGrossProfit = computed(() => recordedIncome - actualExpense.value); // 实际毛利额
const actualGrossProfitMargin = computed(() => recordedIncome > 0 ? ((actualGrossProfit.value / recordedIncome) * 100).toFixed(1) : '0.0'); // 实际毛利率
const profitDeviation = computed(() => actualGrossProfit.value - estimatedGrossProfit); // 毛利偏差
const profitDeviationRate = computed(() => estimatedGrossProfit > 0 ? ((profitDeviation.value / estimatedGrossProfit) * 100).toFixed(1) : '0.0'); // 毛利偏差率

</script>

<template>
  <div class="min-h-screen bg-[#F5F5F7] text-[#1D1D1F] font-sans selection:bg-gray-200 selection:text-gray-900 pb-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">

      <!-- 1. Header Section -->
      <Header :info="basicInfo" />

      <!-- 2. 核心财务指标 -->
      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 class="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <Target :size="18" class="text-blue-600"/>
          核心财务指标
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- 预计收入 -->
          <MetricCard
            label="预计收入"
            :value="formatCurrency(estimatedIncome)"
            :icon="Target"
            subValue="合同金额"
            type="neutral"
          />
          <!-- 入账收入 -->
          <MetricCard
            label="入账收入"
            :value="formatCurrency(recordedIncome)"
            :icon="TrendingUp"
            :subValue="`偏差: ${formatCurrency(incomeDeviation)} (${incomeDeviationRate}%)`"
            :trend="incomeDeviationRate"
            type="neutral"
          />
          <!-- 预计毛利率 -->
          <MetricCard
            label="预计毛利率"
            :value="`${estimatedGrossProfitMargin}%`"
            :icon="PieChart"
            :subValue="`预计毛利: ${formatCurrency(estimatedGrossProfit)}`"
            type="neutral"
          />
          <!-- 实际毛利率 -->
          <MetricCard
            label="实际毛利率"
            :value="`${actualGrossProfitMargin}%`"
            :icon="BarChart3"
            :subValue="`实际毛利: ${formatCurrency(actualGrossProfit)} | 偏差: ${formatCurrency(profitDeviation)} (${profitDeviationRate}%)`"
            :trend="profitDeviationRate"
            type="neutral"
          />
        </div>
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
             :totalBudget="estimatedExpense"
             :totalActual="actualExpense"
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
