<script setup lang="ts">
import { useLayout } from '@/layout/composables/layout'
import type { BurndownPoint } from '@/types/dashboard'
import { format } from '@/utils/date'
import type { ChartData, ChartOptions } from 'chart.js'
import { computed, ref, watch } from 'vue'
import SkeletonChart from './SkeletonChart.vue'

const { layoutConfig, isDarkTheme } = useLayout()
const { burndownData } = defineProps<{
  isLoading: boolean
  burndownData: BurndownPoint[]
  dateRange: string
}>()

const chartData = ref<ChartData>()
const chartOptions = ref<ChartOptions>()

const storiesRemaining = computed(() => {
  if (!burndownData.length) return 0
  return burndownData[burndownData.length - 1].remainingWork
})

async function setColorOptions() {
  const documentStyle = getComputedStyle(document.documentElement)
  const textColor = documentStyle.getPropertyValue('--text-color')
  const textColorSecondary = documentStyle.getPropertyValue('--text-muted-color')
  const surfaceBorder = documentStyle.getPropertyValue('--surface-border')
  const primaryColor = documentStyle.getPropertyValue('--p-primary-500')
  const secondaryColor = documentStyle.getPropertyValue('--p-zinc-400')

  const labels = burndownData.map((point) => format(point.date))
  const data = burndownData.map((point) => point.remainingWork)

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
        label: 'Remaining',
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
  [() => layoutConfig.primary, () => layoutConfig.surface, () => burndownData, isDarkTheme],
  () => {
    setColorOptions()
  },
)
</script>

<template>
  <SkeletonChart v-if="isLoading" />
  <div v-else class="card">
    <div class="flex justify-between items-center mb-4">
      <div>
        <div class="font-semibold text-xl -mb-1">Burndown</div>
        <div class="text-gray-500">{{ dateRange }}</div>
      </div>
      <div class="flex items-center text-right">
        <div class="mr-4">
          <div class="-mb-1">Stories</div>
          <div class="text-gray-500">Remaining</div>
        </div>
        <div class="text-5xl font-light">{{ storiesRemaining }}</div>
      </div>
    </div>
    <Chart :data="chartData" :options="chartOptions" :height="260" />
  </div>
</template>
