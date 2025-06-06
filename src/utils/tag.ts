import { TagImportJobStatus } from '~/types/tag'

export function getColorName(code: string) {
  return colors.find((c) => c.code === code)?.name || 'Unknown'
}

export const colors = [
  { name: 'Emerald', code: '#a4d9c7' },
  { name: 'Green', code: '#b9e6ae' },
  { name: 'Lime', code: '#d6ec9a' },
  { name: 'Orange', code: '#f7c9a1' },
  { name: 'Amber', code: '#f8d7a1' },
  { name: 'Yellow', code: '#f9e7a5' },
  { name: 'Teal', code: '#a8dcd7' },
  { name: 'Cyan', code: '#a9e1ec' },
  { name: 'Sky', code: '#b1dff2' },
  { name: 'Blue', code: '#a6c8f7' },
  { name: 'Indigo', code: '#b4baf7' },
  { name: 'Violet', code: '#ccb7f7' },
  { name: 'Purple', code: '#d7c3f7' },
  { name: 'Fuchsia', code: '#e4bcec' },
  { name: 'Pink', code: '#f7c3d6' },
  { name: 'Rose', code: '#f7b9c1' },
]

export function getJobStatusSeverity(status: string) {
  const severityMap: Record<string, string> = {
    [TagImportJobStatus.Completed]: 'success',
    [TagImportJobStatus.Failed]: 'danger',
    [TagImportJobStatus.Pending]: 'info',
    [TagImportJobStatus.Processing]: 'warning',
  }

  return severityMap[status] || 'info'
}
