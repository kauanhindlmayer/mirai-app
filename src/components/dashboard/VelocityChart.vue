<script setup lang="ts">
import type { ChartData, ChartOptions } from 'chart.js'
import type { VelocityPoint } from '~/types/dashboard'

const { layoutConfig, isDarkTheme } = useLayout()
const { velocityData = [] } = defineProps<{
  isLoading: boolean
  velocityData?: VelocityPoint[]
  dateRange: string
}>()

const chartData = ref<ChartData>()
const chartOptions = ref<ChartOptions>()

const averageVelocity = computed(() => {
  if (!velocityData.length) return 0
  const hasStoryPoints = velocityData.some((point) => point.completedStoryPoints > 0)
  const total = velocityData.reduce(
    (sum, point) => sum + (hasStoryPoints ? point.completedStoryPoints : point.completedWorkItems),
    0,
  )
  return Math.round((total / velocityData.length) * 10) / 10
})

const velocityMetric = computed(() => {
  const hasStoryPoints = velocityData.some((point) => point.completedStoryPoints > 0)
  return hasStoryPoints ? 'Story Points' : 'Work Items'
})

async function setColorOptions() {
  const documentStyle = getComputedStyle(document.documentElement)
  const textColor = documentStyle.getPropertyValue('--text-color')
  const textColorSecondary = documentStyle.getPropertyValue('--text-muted-color')
  const surfaceBorder = documentStyle.getPropertyValue('--surface-border')
  const primaryColor = documentStyle.getPropertyValue('--p-orange-500')
  const secondaryColor = documentStyle.getPropertyValue('--p-zinc-400')

  const labels = velocityData.map((point) => point.sprintName)
  const hasStoryPoints = velocityData.some((point) => point.completedStoryPoints > 0)
  const data = velocityData.map((point) =>
    hasStoryPoints ? point.completedStoryPoints : point.completedWorkItems,
  )

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
        label: 'Velocity',
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
  [() => layoutConfig.primary, () => layoutConfig.surface, () => velocityData, isDarkTheme],
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
        <div class="font-semibold text-xl -mb-1">Velocity</div>
        <div class="text-gray-500">{{ dateRange }}</div>
      </div>
      <div class="flex items-center text-right">
        <div class="mr-4">
          <div class="-mb-1">Average</div>
          <div class="text-gray-500">{{ velocityMetric }}</div>
        </div>
        <div class="text-5xl font-light">{{ averageVelocity }}</div>
      </div>
    </div>
    <Chart type="bar" :data="chartData" :options="chartOptions" :height="260" />
  </div>
</template>
