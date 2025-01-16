<script setup lang="ts">
import { useLayout } from '@/layout/composables/layout'
import { useDashboardStore } from '@/stores/dashboard'
import { formatDate } from '@/utils/date'
import type { ChartData, ChartOptions } from 'chart.js'
import { storeToRefs } from 'pinia'
import { computed, ref, watch } from 'vue'
import SkeletonChart from './SkeletonChart.vue'

const { layoutConfig, isDarkTheme } = useLayout()
const dashboardStore = useDashboardStore()
const { burnupData, dateRange } = storeToRefs(dashboardStore)

defineProps<{
  isLoading: boolean
}>()

const chartData = ref<ChartData>()
const chartOptions = ref<ChartOptions>()

const storiesCompleted = computed(() => {
  return burnupData.value[burnupData.value.length - 1]?.completedWork
})

async function setColorOptions() {
  const documentStyle = getComputedStyle(document.documentElement)
  const textColor = documentStyle.getPropertyValue('--text-color')
  const textColorSecondary = documentStyle.getPropertyValue('--text-muted-color')
  const surfaceBorder = documentStyle.getPropertyValue('--surface-border')
  const primaryColor = documentStyle.getPropertyValue('--p-green-600')
  const secondaryColor = documentStyle.getPropertyValue('--p-zinc-400')

  const labels = burnupData.value.map((point) => formatDate(point.date))
  const data = burnupData.value.map((point) => point.completedWork)

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
  [() => layoutConfig.primary, () => layoutConfig.surface, () => burnupData.value, isDarkTheme],
  () => {
    setColorOptions()
  },
)
</script>

<template>
  <div v-if="!isLoading" class="card">
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
    <Chart :data="chartData" :options="chartOptions" :height="260" />
  </div>

  <SkeletonChart v-else />
</template>
