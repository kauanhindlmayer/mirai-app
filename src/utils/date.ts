import { format, formatDistanceToNow } from 'date-fns'

export function formatDate(date: Date | string, formatString: string = 'dd/MM/yyyy'): string {
  if (!date) return ''
  return format(date, formatString)
}

export function formatRelativeTime(date: string): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}
