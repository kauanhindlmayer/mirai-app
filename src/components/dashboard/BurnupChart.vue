<script setup lang="ts">
import type { ChartData, ChartOptions } from 'chart.js'
import { useLayout } from '~/layout/composables/layout'
import type { BurnupPoint } from '~/types/dashboard'
import { format } from '~/utils/date'

const { layoutConfig, isDarkTheme } = useLayout()
const { burnupData = [] } = defineProps<{
  isLoading: boolean
  burnupData: BurnupPoint[]
  dateRange: string
}>()

const chartData = ref<ChartData>()
const chartOptions = ref<ChartOptions>()

const storiesCompleted = computed(() => {
  if (!burnupData.length) return 0
  return burnupData[burnupData.length - 1].completedWork
})

async function setColorOptions() {
  const documentStyle = getComputedStyle(document.documentElement)
  const textColor = documentStyle.getPropertyValue('--text-color')
  const textColorSecondary = documentStyle.getPropertyValue('--text-muted-color')
  const surfaceBorder = documentStyle.getPropertyValue('--surface-border')
  const primaryColor = documentStyle.getPropertyValue('--p-green-600')
  const secondaryColor = documentStyle.getPropertyValue('--p-zinc-400')

  const labels = burnupData.map((point) => format(point.date))
  const data = burnupData.map((point) => point.completedWork)

  chartData.value = {
    labels,
    datasets: [
      {
        type: 'line',
        label: 'Burndown',
        backgroundColor: secondaryColor,
        borderColor: secondaryColor,
        data,
      },
      {
        type: 'bar',
        label: 'Completed',
        backgroundColor: primaryColor,
        borderColor: primaryColor,
        data,
      },
    ],
  }

  chartOptions.value = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        align: 'start',
        labels: {
          usePointStyle: true,
          pointStyle: 'rect',
          color: textColor,
          boxWidth: 20,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: textColorSecondary,
          font: {
            weight: 500,
          },
        },
        grid: {
          display: false,
        },
      },
      y: {
        ticks: {
          color: textColorSecondary,
        },
        grid: {
          color: surfaceBorder,
        },
      },
    },
  }
}

watch(
  [() => layoutConfig.primary, () => layoutConfig.surface, () => burnupData, isDarkTheme],
  () => {
    setColorOptions()
  },
)

onMounted(() => {
  setColorOptions()
})
</script>

<template>
  <SkeletonChart v-if="isLoading" />
  <div v-else class="card">
    <div class="flex justify-between items-center mb-4">
      <div>
        <div class="font-semibold text-xl -mb-1">Burnup</div>
        <div class="text-gray-500">{{ dateRange }}</div>
      </div>
      <div class="flex items-center text-right">
        <div class="mr-4">
          <div class="-mb-1">Stories</div>
          <div class="text-gray-500">Completed</div>
        </div>
        <div class="text-5xl font-light">{{ storiesCompleted }}</div>
      </div>
    </div>
    <Chart type="bar" :data="chartData" :options="chartOptions" :height="260" />
  </div>
</template>
