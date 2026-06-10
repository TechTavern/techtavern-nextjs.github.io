import { fireEvent } from '@testing-library/react';
import HubSpotBookingButton from '../HubSpotBookingButton';
import { renderWithProviders } from '@/tests/test-utils';

describe('HubSpotBookingButton', () => {
  afterEach(() => {
    delete (window as any).hbspt;
    document.body.innerHTML = '';
  });

  it('creates the HubSpot meetings widget when available', () => {
    const create = jest.fn();
    (window as any).hbspt = { meetings: { create } };

    const { getByRole } = renderWithProviders(
      <HubSpotBookingButton
        bookingLink="https://meetings.hubspot.com/acme"
        label="Connect"
        className="btn"
      />,
    );

    fireEvent.click(getByRole('button', { name: 'Connect' }));
    expect(create).toHaveBeenCalled();
    expect(document.getElementById('hubspot-meetings-container')).toBeInTheDocument();
  });

  it('escapes quotes in the booking link before embedding', () => {
    const create = jest.fn();
    (window as any).hbspt = { meetings: { create } };

    const { getByRole } = renderWithProviders(
      <HubSpotBookingButton
        bookingLink={'https://meetings.hubspot.com/acme?x="onmouseover="alert(1)'}
        label="Connect"
        className="btn"
      />,
    );

    fireEvent.click(getByRole('button', { name: 'Connect' }));
    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({
        embedCode: expect.not.stringContaining('"onmouseover'),
      }),
    );
  });

  it('falls back to opening a new tab when API is unavailable', () => {
    const originalOpen = window.open;
    window.open = jest.fn();

    const { getByRole } = renderWithProviders(
      <HubSpotBookingButton
        bookingLink="https://meetings.hubspot.com/acme"
        label="Connect"
        className="btn"
      />,
    );

    fireEvent.click(getByRole('button', { name: 'Connect' }));
    expect(window.open).toHaveBeenCalledWith(
      'https://meetings.hubspot.com/acme',
      '_blank',
      'noopener,noreferrer',
    );

    (window.open as jest.Mock).mockRestore?.();
    window.open = originalOpen;
  });
});
