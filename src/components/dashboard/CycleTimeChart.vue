<script setup lang="ts">
import type { ChartData, ChartOptions } from 'chart.js'
import type { CycleTimePoint } from '~/types/dashboard'

const { layoutConfig, isDarkTheme } = useLayout()
const { cycleTimeData = [] } = defineProps<{
  isLoading: boolean
  cycleTimeData?: CycleTimePoint[]
  dateRange: string
}>()

const chartData = ref<ChartData>()
const chartOptions = ref<ChartOptions>()

const averageCycleTime = computed(() => {
  if (!cycleTimeData.length) return 0
  const total = cycleTimeData.reduce((sum, point) => sum + point.cycleTimeDays, 0)
  return Math.round((total / cycleTimeData.length) * 10) / 10
})

async function setColorOptions() {
  const documentStyle = getComputedStyle(document.documentElement)
  const textColor = documentStyle.getPropertyValue('--text-color')
  const textColorSecondary = documentStyle.getPropertyValue('--text-muted-color')
  const surfaceBorder = documentStyle.getPropertyValue('--surface-border')
  const primaryColor = documentStyle.getPropertyValue('--p-blue-500')
  const secondaryColor = documentStyle.getPropertyValue('--p-zinc-400')

  const labels = cycleTimeData.map((point) => format(point.completedDate))
  const data = cycleTimeData.map((point) => point.cycleTimeDays)

  chartData.value = {
    labels,
    datasets: [
      {
        type: 'line',
        label: 'Trend',
        backgroundColor: secondaryColor,
        borderColor: secondaryColor,
        data,
      },
      {
        type: 'bar',
        label: 'Cycle Time',
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
  [() => layoutConfig.primary, () => layoutConfig.surface, () => cycleTimeData, isDarkTheme],
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
        <div class="font-semibold text-xl -mb-1">Cycle Time</div>
        <div class="text-gray-500">{{ dateRange }}</div>
      </div>
      <div class="flex items-center text-right">
        <div class="mr-4">
          <div class="-mb-1">Average</div>
          <div class="text-gray-500">Days</div>
        </div>
        <div class="text-5xl font-light">{{ averageCycleTime }}</div>
      </div>
    </div>
    <Chart type="bar" :data="chartData" :options="chartOptions" :height="260" />
  </div>
</template>
