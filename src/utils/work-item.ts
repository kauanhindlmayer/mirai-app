import { BacklogLevel } from '@/types/team'
import { WorkItemStatus, WorkItemType } from '@/types/work-item'

export function getStatusSeverity(status: WorkItemStatus): string {
  const severityMap: Record<WorkItemStatus, string> = {
    [WorkItemStatus.New]: 'info',
    [WorkItemStatus.InProgress]: 'warning',
    [WorkItemStatus.Resolved]: 'success',
    [WorkItemStatus.Closed]: 'success',
    [WorkItemStatus.Reopened]: 'warning',
    [WorkItemStatus.Removed]: 'danger',
  }

  return severityMap[status] || 'info'
}

export function getStatusLabel(status: WorkItemStatus): string {
  const statusMap: Record<WorkItemStatus, string> = {
    [WorkItemStatus.New]: 'New',
    [WorkItemStatus.InProgress]: 'In Progress',
    [WorkItemStatus.Resolved]: 'Resolved',
    [WorkItemStatus.Closed]: 'Closed',
    [WorkItemStatus.Reopened]: 'Reopened',
    [WorkItemStatus.Removed]: 'Removed',
  }

  return statusMap[status] || 'Unknown'
}

export function getTypeSeverity(type: WorkItemType): string {
  const severityMap: Record<WorkItemType, string> = {
    [WorkItemType.UserStory]: 'info',
    [WorkItemType.Bug]: 'danger',
    [WorkItemType.Defect]: 'danger',
    [WorkItemType.Epic]: 'primary',
    [WorkItemType.Feature]: 'primary',
  }

  return severityMap[type] || 'info'
}

export function getTypeLabel(type: WorkItemType): string {
  const typeMap: Record<WorkItemType, string> = {
    [WorkItemType.UserStory]: 'User Story',
    [WorkItemType.Bug]: 'Bug',
    [WorkItemType.Defect]: 'Defect',
    [WorkItemType.Epic]: 'Epic',
    [WorkItemType.Feature]: 'Feature',
  }

  return typeMap[type] || 'Unknown'
}

export function getBacklogLevelLabel(level: BacklogLevel): string {
  const levelMap: Record<BacklogLevel, string> = {
    [BacklogLevel.Epic]: 'Epic',
    [BacklogLevel.Feature]: 'Feature',
    [BacklogLevel.UserStory]: 'User Story',
  }

  return levelMap[level] || 'Unknown'
}

export function getTypeColor(type: WorkItemType): string {
  const colorMap: Record<WorkItemType, string> = {
    [WorkItemType.Bug]: '#D32F2F',
    [WorkItemType.Defect]: '#D32F2F',
    [WorkItemType.Epic]: '#FF5722',
    [WorkItemType.Feature]: '#9C27B0',
    [WorkItemType.UserStory]: '#03A9F4',
  }

  return colorMap[type] || '#9E9E9E'
}
