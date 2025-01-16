import type DashboardGateway from '@/gateways/DashboardGateway'
import type { DashboardResponse } from '@/types/dashboard'
import { formatDate } from '@/utils/date'
import { dashboardGatewayKey } from '@/utils/injection-keys'
import { defineStore, storeToRefs } from 'pinia'
import { computed, inject, ref } from 'vue'
import { useProjectStore } from './project'

export const useDashboardStore = defineStore('dashboards', () => {
  const dashboardGateway = inject(dashboardGatewayKey) as DashboardGateway
  const { project } = storeToRefs(useProjectStore())

  const dashboardData = ref<DashboardResponse>({
    burnupData: [],
    burndownData: [],
    startDate: '',
    endDate: '',
  })

  const burnupData = computed(() => dashboardData.value.burnupData)
  const burndownData = computed(() => dashboardData.value.burndownData)
  const formattedStartDate = computed(() => formatDate(dashboardData.value.startDate))
  const formattedEndDate = computed(() => formatDate(dashboardData.value.endDate))
  const dateRange = computed(() => `${formattedStartDate.value} - ${formattedEndDate.value}`)

  async function getDashboardData() {
    dashboardData.value = await dashboardGateway.getDashboardData(project.value!.id)
  }

  return {
    dashboardData,
    burnupData,
    burndownData,
    dateRange,
    getDashboardData,
  }
})
