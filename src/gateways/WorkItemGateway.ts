import type { HttpClient, PaginatedList, PaginationFilter } from '@/types'
import type {
  BurndownChartResponse,
  BurnupChartResponse,
  WorkItem,
  WorkItemsStats,
} from '@/types/work-item'

export default interface WorkItemGateway {
  listWorkItems(projectId: string, filters: PaginationFilter): Promise<PaginatedList<WorkItem>>
  deleteWorkItem(projectId: string, workItemId: string): Promise<void>
  getWorkItemsStats(projectId: string, periodInDays: number): Promise<WorkItemsStats>
  getBurndownChart(projectId: string): Promise<BurndownChartResponse>
  getBurnupChart(projectId: string): Promise<BurnupChartResponse>
}

export class WorkItemGatewayHttp implements WorkItemGateway {
  constructor(readonly http: HttpClient) {}

  listWorkItems(projectId: string, filters: PaginationFilter): Promise<PaginatedList<WorkItem>> {
    return this.http.get(`/projects/${projectId}/work-items`, {
      params: filters as unknown as Record<string, string>,
    })
  }

  deleteWorkItem(projectId: string, workItemId: string): Promise<void> {
    return this.http.delete(`/projects/${projectId}/work-items/${workItemId}`)
  }

  getWorkItemsStats(projectId: string, periodInDays: number): Promise<WorkItemsStats> {
    return this.http.get(`/projects/${projectId}/work-items/stats`, {
      params: { periodInDays: periodInDays.toString() },
    })
  }

  getBurndownChart(projectId: string): Promise<BurndownChartResponse> {
    return this.http.get(`/projects/${projectId}/work-items/burndown`)
    // return new Promise((resolve) => {
    //   resolve({
    //     dataPoints: [
    //       { date: '2025-01-01', remainingWorkItems: 50 },
    //       { date: '2025-01-02', remainingWorkItems: 48 },
    //       { date: '2025-01-03', remainingWorkItems: 45 },
    //       { date: '2025-01-04', remainingWorkItems: 46 },
    //       { date: '2025-01-05', remainingWorkItems: 40 },
    //       { date: '2025-01-06', remainingWorkItems: 38 },
    //       { date: '2025-01-07', remainingWorkItems: 30 },
    //       { date: '2025-01-08', remainingWorkItems: 25 },
    //       { date: '2025-01-09', remainingWorkItems: 10 },
    //       { date: '2025-01-10', remainingWorkItems: 0 },
    //     ],
    //     startDate: '2025-01-01',
    //     endDate: '2025-01-10',
    //     remainingWorkItems: 0,
    //   })
    // })
  }

  getBurnupChart(projectId: string): Promise<BurnupChartResponse> {
    return this.http.get(`/projects/${projectId}/work-items/burnup`)
    // return new Promise((resolve) => {
    //   resolve({
    //     dataPoints: [
    //       { date: '2025-01-01', completedWorkItems: 0 },
    //       { date: '2025-01-02', completedWorkItems: 2 },
    //       { date: '2025-01-03', completedWorkItems: 5 },
    //       { date: '2025-01-04', completedWorkItems: 6 },
    //       { date: '2025-01-05', completedWorkItems: 10 },
    //       { date: '2025-01-06', completedWorkItems: 12 },
    //       { date: '2025-01-07', completedWorkItems: 20 },
    //       { date: '2025-01-08', completedWorkItems: 25 },
    //       { date: '2025-01-09', completedWorkItems: 40 },
    //       { date: '2025-01-10', completedWorkItems: 50 },
    //     ],
    //     startDate: '2025-01-01',
    //     endDate: '2025-01-10',
    //     completedWorkItems: 50,
    //   })
    // })
  }
}
