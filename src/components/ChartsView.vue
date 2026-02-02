<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue';
import * as echarts from 'echarts';
import { LayoutGrid, PieChart } from 'lucide-vue-next';
import { calculateCategoryTotal, formatCurrency } from '../data/projectData';

const props = defineProps<{
  data: any[];
  totalBudget: number;
  totalActual: number;
}>();

const barChartRef = ref<HTMLElement | null>(null);
const pieChartRef = ref<HTMLElement | null>(null);
let barChartInstance: echarts.ECharts | null = null;
let pieChartInstance: echarts.ECharts | null = null;

const initCharts = () => {
  if (barChartRef.value) {
    barChartInstance = echarts.init(barChartRef.value);

    const barData = props.data.map(cat => ({
      name: cat.name,
      budget: cat.budget,
      actual: calculateCategoryTotal(cat.expenses)
    }));

    barChartInstance.setOption({
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: function (params: any) {
          let res = params[0].name + '<br/>';
          params.forEach((param: any) => {
            res += param.marker + param.seriesName + ': ' + formatCurrency(param.value) + '<br/>';
          });
          return res;
        },
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: '#f4f4f5',
        borderWidth: 1,
        textStyle: { color: '#333' },
        extraCssText: 'box-shadow: 0 4px 12px rgba(0,0,0,0.1); border-radius: 8px;'
      },
      legend: {
        bottom: 0,
        itemWidth: 12,
        itemHeight: 12,
        icon: 'circle'
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '10%',
        top: '10%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: barData.map(d => d.name),
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: '#71717a' }
      },
      yAxis: {
        type: 'value',
        splitLine: { lineStyle: { type: 'dashed', color: '#f4f4f5' } },
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { show: false }
      },
      series: [
        {
          name: '预算额度',
          type: 'bar',
          data: barData.map(d => d.budget),
          itemStyle: { color: '#E6F4FF', borderRadius: [4, 4, 0, 0] },
          barMaxWidth: 30,
          barGap: '20%'
        },
        {
          name: '实际支出',
          type: 'bar',
          data: barData.map(d => d.actual),
          itemStyle: { color: '#165DFF', borderRadius: [4, 4, 0, 0] },
          barMaxWidth: 30
        }
      ]
    });
  }

  if (pieChartRef.value) {
    pieChartInstance = echarts.init(pieChartRef.value);

    const pieData = props.data.map(cat => ({
      name: cat.name,
      value: calculateCategoryTotal(cat.expenses)
    })).filter(item => item.value > 0);

    const colors = ['#165DFF', '#52C41A', '#FFC107', '#FF5252', '#722ED1', '#13C2C2', '#FA8C16', '#EB2F96'];

    pieChartInstance.setOption({
      tooltip: {
        trigger: 'item',
        formatter: function(params: any) {
          return params.name + ': ' + formatCurrency(params.value) + ' (' + params.percent + '%)';
        },
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        extraCssText: 'box-shadow: 0 4px 12px rgba(0,0,0,0.1); border-radius: 8px;'
      },
      legend: {
        orient: 'vertical',
        right: 10,
        top: 'center',
        icon: 'circle'
      },
      series: [
        {
          name: '支出构成',
          type: 'pie',
          radius: ['50%', '80%'],
          center: ['40%', '50%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 0,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: { show: false },
          data: pieData,
          color: colors
        }
      ]
    });
  }
};

const handleResize = () => {
  barChartInstance?.resize();
  pieChartInstance?.resize();
};

onMounted(() => {
  initCharts();
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  barChartInstance?.dispose();
  pieChartInstance?.dispose();
});

// Watch for prop changes to update charts
watch(() => props.data, () => {
  initCharts();
}, { deep: true });
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <!-- Bar Chart -->
    <div class="bg-white p-6 rounded-xl border border-gray-200/80 shadow-sm">
      <h3 class="text-sm font-semibold text-gray-900 mb-6 flex items-center gap-2">
        <LayoutGrid :size="16" class="text-gray-400" />
        预算执行对比 (Budget vs Actual)
      </h3>
      <div ref="barChartRef" class="h-[300px] w-full"></div>
    </div>

    <!-- Pie Chart -->
    <div class="bg-white p-6 rounded-xl border border-gray-200/80 shadow-sm flex flex-col">
      <h3 class="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
        <PieChart :size="16" class="text-gray-400" />
        支出构成分析
      </h3>
      <div class="flex-1 min-h-[300px] relative">
        <div ref="pieChartRef" class="w-full h-full"></div>
        <!-- Center Text -->
        <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pr-24">
           <span class="text-xs text-gray-400">总支出</span>
           <span class="text-lg font-bold text-gray-900">{{ formatCurrency(totalActual) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
