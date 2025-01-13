import type { ChartData, ChartOptions } from 'chart.js'
import { ref, type Ref } from 'vue'

export function useChart(): {
  chartOptions: Ref<ChartOptions>
  setColorOptions: (chartData?: ChartData, primaryColor?: string, secondaryColor?: string) => void
} {
  const documentStyle = getComputedStyle(document.documentElement)
  const textColor = documentStyle.getPropertyValue('--text-color')
  const textColorSecondary = documentStyle.getPropertyValue('--text-muted-color')
  const surfaceBorder = documentStyle.getPropertyValue('--surface-border')

  const chartOptions = ref<ChartOptions>({
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
  })

  function setColorOptions(chartData?: ChartData, primaryColor?: string, secondaryColor?: string) {
    const fallbackPrimaryColor = documentStyle.getPropertyValue('--p-primary-500')
    const fallbackSecondaryColor = documentStyle.getPropertyValue('--p-zinc-400')
    const [firstDataset, secondDataset] = chartData?.datasets || []
    if (!firstDataset || !secondDataset) return
    firstDataset.backgroundColor = secondaryColor || fallbackSecondaryColor
    firstDataset.borderColor = secondaryColor || fallbackSecondaryColor
    secondDataset.backgroundColor = primaryColor || fallbackPrimaryColor
    secondDataset.borderColor = primaryColor || fallbackPrimaryColor
  }

  return {
    chartOptions,
    setColorOptions,
  }
}
