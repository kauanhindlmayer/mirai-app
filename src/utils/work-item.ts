import type { Tag } from '~/types/tag'
import { BacklogLevel } from '~/types/team'
import { WorkItemStatus, WorkItemType } from '~/types/work-item'

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

export function getTypeColor(type: WorkItemType): string {
  const colorMap: Record<WorkItemType, string> = {
    [WorkItemType.Bug]: '#CC293D',
    [WorkItemType.Defect]: '#CC293D',
    [WorkItemType.Epic]: '#FF7B00',
    [WorkItemType.Feature]: '#773B93',
    [WorkItemType.UserStory]: '#007ACC',
  }

  return colorMap[type] || '#4A4A4A'
}

export function getTypeBackgroundColor(type: WorkItemType): string {
  const backgroundColorMap: Record<WorkItemType, string> = {
    [WorkItemType.Bug]: '#F9D9DA',
    [WorkItemType.Defect]: '#F9D9DA',
    [WorkItemType.Epic]: '#FFE6CC',
    [WorkItemType.Feature]: '#EDE4F6',
    [WorkItemType.UserStory]: '#D6ECF8',
  }

  return backgroundColorMap[type] || '#EAEAEA'
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

export function getMoreTagsTooltip(tags: Tag[]) {
  return tags
    .slice(2)
    .map((tag) => tag.name)
    .join(', ')
}
