/**
 * Extracts initials from a person's name.
 * Returns the first letter of the first word if only one word is provided,
 * or the first letters of the first and last words for multi-word names.
 *
 * @param name - The full name to extract initials from
 * @returns The uppercase initials (e.g., "John Doe" -> "JD", "Alice" -> "A")
 *
 * @example
 * getInitials("John Doe") // "JD"
 * getInitials("Alice") // "A"
 * getInitials("") // ""
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
 * Transforms PascalCase or camelCase enum keys into human-readable labels
 * by adding spaces between words.
 *
 * @param enumObject - The enum object to convert
 * @returns Array of options with `label` and `value` properties
 *
 * @example
 * enum Status { Active, InProgress, Completed }
 * formatEnumOptions(Status)
 * // [
 * //   { label: "Active", value: "Active" },
 * //   { label: "In Progress", value: "InProgress" },
 * //   { label: "Completed", value: "Completed" }
 * // ]
 */
export function formatEnumOptions<T extends object>(
  enumObject: T,
): { label: string; value: string }[] {
  return Object.keys(enumObject).map((key) => ({
    label: key.replace(/([a-z])([A-Z])/g, '$1 $2'),
    value: key,
  }))
}
