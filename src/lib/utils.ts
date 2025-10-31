/**
 * Utility function for merging class names
 * A simplified version of clsx/classnames
 */
export function cn(...classes: (string | string[] | undefined | null | false)[]): string {
  return classes
    .flat()
    .filter(Boolean)
    .join(' ');
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}
