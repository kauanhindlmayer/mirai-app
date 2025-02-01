export function getInitials(name?: string): string {
  if (!name) return ''
  const parts = name.split(' ')
  if (parts.length < 2) {
    return parts[0][0].toUpperCase()
  }
  const firstNameInitial = parts[0][0]
  const lastNameInitial = parts[parts.length - 1][0]
  return (firstNameInitial + lastNameInitial).toUpperCase()
}
