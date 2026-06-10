/**
 * Format a yyyy-mm-dd date string for display.
 *
 * Parses the date components explicitly so the result is the calendar date the
 * author wrote, regardless of the build machine's timezone. (A bare
 * `new Date('yyyy-mm-dd')` is interpreted as UTC midnight, which renders as
 * the previous day on any machine west of UTC.)
 */
export function formatDisplayDate(dateString: string): string {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
