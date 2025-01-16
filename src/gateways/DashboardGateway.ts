import type { HttpClient } from '@/types'
import type { DashboardResponse } from '@/types/dashboard'

export default interface DashboardGateway {
  getDashboardData(projectId: string): Promise<DashboardResponse>
}

export class DashboardGatewayHttp implements DashboardGateway {
  constructor(readonly http: HttpClient) {}

  getDashboardData(projectId: string): Promise<DashboardResponse> {
    return this.http.get(`/projects/${projectId}/dashboards`)
  }
}

export class DashboardGatewayFake implements DashboardGateway {
  getDashboardData(_projectId: string): Promise<DashboardResponse> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          burnupData: [
            { date: '2025-01-01', completedWork: 0 },
            { date: '2025-01-02', completedWork: 2 },
            { date: '2025-01-03', completedWork: 5 },
            { date: '2025-01-04', completedWork: 6 },
            { date: '2025-01-05', completedWork: 10 },
            { date: '2025-01-06', completedWork: 12 },
            { date: '2025-01-07', completedWork: 20 },
            { date: '2025-01-08', completedWork: 25 },
            { date: '2025-01-09', completedWork: 40 },
            { date: '2025-01-10', completedWork: 50 },
          ],
          burndownData: [
            { date: '2025-01-01', remainingWork: 50 },
            { date: '2025-01-02', remainingWork: 48 },
            { date: '2025-01-03', remainingWork: 45 },
            { date: '2025-01-04', remainingWork: 46 },
            { date: '2025-01-05', remainingWork: 40 },
            { date: '2025-01-06', remainingWork: 38 },
            { date: '2025-01-07', remainingWork: 30 },
            { date: '2025-01-08', remainingWork: 25 },
            { date: '2025-01-09', remainingWork: 10 },
            { date: '2025-01-10', remainingWork: 0 },
          ],
          startDate: '2025-01-01',
          endDate: '2025-01-05',
        })
      }, 1000)
    })
  }
}
