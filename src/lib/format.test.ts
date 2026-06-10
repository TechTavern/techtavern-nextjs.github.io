import { formatDisplayDate } from './format';

describe('formatDisplayDate', () => {
  it('formats yyyy-mm-dd as a long US date', () => {
    expect(formatDisplayDate('2024-06-10')).toBe('June 10, 2024');
  });

  it('does not shift the day in negative-UTC-offset timezones', () => {
    // Naive new Date('2024-01-01') is UTC midnight → "December 31, 2023" in US zones.
    expect(formatDisplayDate('2024-01-01')).toBe('January 1, 2024');
  });
});
