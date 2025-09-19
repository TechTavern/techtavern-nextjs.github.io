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