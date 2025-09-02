import http from '~/api/http'
import type { DashboardResponse } from '~/types/dashboard'

export function getDashboardData(teamId: string): Promise<DashboardResponse> {
  return http.get(`/teams/${teamId}/dashboards`)
}
