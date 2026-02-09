<script setup lang="ts">
import { type Ref, onMounted, watch, h } from 'vue'
import * as echarts from 'echarts'
import { type Category } from '~/data/projectData'
import { calculateCategoryTotal, formatCurrency } from '~/data/projectData'

const props = defineProps<{
  data: Category[]
  totalBudget: number
  totalActual: Ref<number>
}>()

const chartRef = ref<HTMLElement | null>(null)
let chartInstance: echarts.ECharts | null = null

const createChart = () => {
  if (!chartRef.value) return

  const categoryNames = props.data.map(category => category.name)
  const budgetData = props.data.map(category => category.budget)
  const actualData = props.data.map(category => calculateCategoryTotal(category.expenses))

  const option: echarts.EChartsOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: function(params: any) {
        const category = params[0].name
        const budget = params[0].value
        const actual = params[1] ? params[1].value : 0
        const remaining = budget - actual
        return `${category}<br/>预算: ${formatCurrency(budget)}<br/>实际: ${formatCurrency(actual)}<br/>剩余: ${formatCurrency(remaining)}`
      }
    },
    legend: {
      data: ['预算', '实际支出'],
      bottom: 0
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      axisLabel: {
        formatter: function(value: number) {
          return formatCurrency(value)
        }
      }
    },
    yAxis: {
      type: 'category',
      data: categoryNames,
      axisLabel: {
        interval: 0
      }
    },
    series: [
      {
        name: '预算',
        type: 'bar',
        data: budgetData,
        itemStyle: {
          color: '#E5E7EB',
          borderRadius: [0, 4, 4, 0]
        },
        barWidth: '40%'
      },
      {
        name: '实际支出',
        type: 'bar',
        data: actualData,
        itemStyle: {
          color: function(params: any) {
            const budget = budgetData[params.dataIndex]
            const actual = actualData[params.dataIndex]
            return actual > budget ? '#EF4444' : '#3B82F6'
          },
          borderRadius: [0, 4, 4, 0]
        },
        barWidth: '40%'
      }
    ]
  }

  chartInstance = echarts.init(chartRef.value)
  chartInstance.setOption(option)
}

onMounted(() => {
  createChart()
  window.addEventListener('resize', () => {
    chartInstance?.resize()
  })
})

watch(() => props.data, () => {
  if (chartInstance) {
    createChart()
  }
}, { deep: true })

watch(() => props.totalActual.value, () => {
  if (chartInstance) {
    createChart()
  }
})

onUnmounted(() => {
  chartInstance?.dispose()
})
</script>

<template>
  <div class="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
    <div class="p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-900">预算执行分析</h3>
        <div class="text-sm text-gray-600">
          总预算: {{ formatCurrency(props.totalBudget) }} |
          总实际支出: {{ formatCurrency(props.totalActual) }}
        </div>
      </div>
      <div ref="chartRef" style="width: 100%; height: 400px;"></div>
    </div>
  </div>
</template>
