<script setup lang="ts">
import { useChart } from '@/composables/useChart'
import { useLayout } from '@/layout/composables/layout'
import { useWorkItemStore } from '@/stores/work-item'
import { formatDate } from '@/utils/date'
import type { ChartData } from 'chart.js'
import { storeToRefs } from 'pinia'
import { computed, onBeforeMount, ref, watch } from 'vue'

const { layoutConfig, isDarkTheme } = useLayout()
const workItemStore = useWorkItemStore()
const { burnupChartData } = storeToRefs(workItemStore)

const chartData = ref<ChartData>()
const { chartOptions, setColorOptions } = useChart()
const dateRange = computed(() => {
  const { startDate, endDate } = burnupChartData.value
  return `${formatDate(startDate)} - ${formatDate(endDate)}`
})

async function getBurnupChartData() {
  await workItemStore.getBurnupChart()
  const labels = burnupChartData.value.dataPoints.map((point) => formatDate(point.date))
  const data = burnupChartData.value.dataPoints.map((point) => point.completedWorkItems)

  chartData.value = {
    labels,
    datasets: [
      {
        type: 'line',
        label: 'Burnup',
        data,
      },
      {
        type: 'bar',
        label: 'Completed',
        data,
      },
    ],
  }
}

function setChartColorOptions() {
  const documentStyle = getComputedStyle(document.documentElement)
  const primaryColor = documentStyle.getPropertyValue('--p-green-600')
  setColorOptions(chartData.value, primaryColor)
}

watch([() => layoutConfig.primary, () => layoutConfig.surface, isDarkTheme], () => {
  setChartColorOptions()
})

onBeforeMount(async () => {
  await getBurnupChartData()
  setChartColorOptions()
})
</script>

<template>
  <div class="card">
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
        <div class="text-5xl font-light">{{ burnupChartData.completedWorkItems }}</div>
      </div>
    </div>
    <Chart :data="chartData" :options="chartOptions" />
  </div>
</template>
