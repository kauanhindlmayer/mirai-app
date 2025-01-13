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
const { burndownChartData } = storeToRefs(workItemStore)

const chartData = ref<ChartData>()
const { chartOptions, setColorOptions } = useChart()
const dateRange = computed(() => {
  const { startDate, endDate } = burndownChartData.value
  return `${formatDate(startDate)} - ${formatDate(endDate)}`
})

async function getBurndownChartData() {
  await workItemStore.getBurndownChart()
  const labels = burndownChartData.value.dataPoints.map((point) => formatDate(point.date))
  const data = burndownChartData.value.dataPoints.map((point) => point.remainingWorkItems)

  chartData.value = {
    labels,
    datasets: [
      {
        type: 'line',
        label: 'Burndown',
        data,
      },
      {
        type: 'bar',
        label: 'Remaining',
        data,
      },
    ],
  }
}

watch([() => layoutConfig.primary, () => layoutConfig.surface, isDarkTheme], () => {
  setColorOptions(chartData.value)
})

onBeforeMount(async () => {
  await getBurndownChartData()
  setColorOptions(chartData.value)
})
</script>

<template>
  <div class="card">
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
        <div class="text-5xl font-light">{{ burndownChartData.remainingWorkItems }}</div>
      </div>
    </div>
    <Chart :data="chartData" :options="chartOptions" />
  </div>
</template>
