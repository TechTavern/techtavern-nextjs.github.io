import { fireEvent } from '@testing-library/react';
import CalendlyBookingButton from '../CalendlyBookingButton';
import { renderWithProviders } from '@/tests/test-utils';

describe('CalendlyBookingButton', () => {
  afterEach(() => {
    delete (window as any).Calendly;
  });

  it('invokes Calendly popup when script is available', () => {
    const initPopupWidget = jest.fn();
    (window as any).Calendly = {
      initPopupWidget,
    };

    const { getByRole } = renderWithProviders(
      <CalendlyBookingButton
        bookingLink="https://calendly.com/acme"
        label="Schedule"
        className="btn"
      />,
    );

    fireEvent.click(getByRole('button', { name: 'Schedule' }));
    expect(initPopupWidget).toHaveBeenCalledWith({ url: 'https://calendly.com/acme' });
  });

  it('falls back to window.open when Calendly is unavailable', () => {
    const originalOpen = window.open;
    window.open = jest.fn();

    const { getByRole } = renderWithProviders(
      <CalendlyBookingButton
        bookingLink="https://calendly.com/acme"
        label="Schedule"
        className="btn"
      />,
    );

    fireEvent.click(getByRole('button', { name: 'Schedule' }));
    expect(window.open).toHaveBeenCalledWith('https://calendly.com/acme', '_blank', 'noopener,noreferrer');

    (window.open as jest.Mock).mockRestore?.();
    window.open = originalOpen;
  });
});
