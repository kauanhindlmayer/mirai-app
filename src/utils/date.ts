import { format } from 'date-fns'

export function formatDate(date: Date, formatString: string = 'dd/MM/yyyy'): string {
  return format(date, formatString)
}
