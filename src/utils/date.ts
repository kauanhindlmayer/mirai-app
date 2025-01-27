import {
  addDays as _addDays,
  format as _format,
  formatDistanceToNow as _formatDistanceToNow,
  isBefore as _isBefore,
  isWeekend as _isWeekend,
} from 'date-fns'

export type DateType = Date | string

export function format(date: DateType, formatString: string = 'dd/MM/yyyy'): string {
  if (!date) return ''
  return _format(date, formatString)
}

export function formatDistanceToNow(date: string): string {
  return _formatDistanceToNow(new Date(date), { addSuffix: true })
}

export function isBefore(date: DateType, dateToCompare: DateType): boolean {
  return _isBefore(new Date(date), new Date(dateToCompare))
}

export function isWeekend(date: DateType): boolean {
  return _isWeekend(new Date(date))
}

export function addDays(date: DateType, amount: number): Date {
  return _addDays(new Date(date), amount)
}
