/**
 * Extracts initials from a person's name.
 */
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

/**
 * Converts an enum object into an array of label-value option pairs.
 */
export function formatEnumOptions<T extends object>(
  enumObject: T,
): { label: string; value: string }[] {
  return Object.keys(enumObject).map((key) => ({
    label: key.replace(/([a-z])([A-Z])/g, '$1 $2'),
    value: key,
  }))
}
