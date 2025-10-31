import { fireEvent } from '@testing-library/react';
import GoogleBookingButton from '../GoogleBookingButton';
import { renderWithProviders } from '@/tests/test-utils';

describe('GoogleBookingButton', () => {
  const originalOpen = window.open;

  beforeEach(() => {
    window.open = jest.fn();
  });

  afterEach(() => {
    (window.open as jest.Mock).mockRestore?.();
    window.open = originalOpen;
  });

  it('opens a new tab when clicked', () => {
    const { getByRole } = renderWithProviders(
      <GoogleBookingButton
        bookingLink="https://calendar.google.com/book"
        label="Reserve"
        className="btn"
      />,
    );

    fireEvent.click(getByRole('button', { name: 'Reserve' }));
    expect(window.open).toHaveBeenCalledWith(
      'https://calendar.google.com/book',
      '_blank',
      'noopener,noreferrer',
    );
  });
});
