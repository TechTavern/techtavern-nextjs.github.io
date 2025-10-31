import { buildBookingButtonProps, resolveBookingComponent } from './index';
import GoogleBookingButton from './GoogleBookingButton';
import CalendlyBookingButton from './CalendlyBookingButton';
import HubSpotBookingButton from './HubSpotBookingButton';

describe('consulting booking registry', () => {
  it('returns the correct component for each provider by default', () => {
    expect(resolveBookingComponent('google-booking')).toBe(GoogleBookingButton);
    expect(resolveBookingComponent('calendly')).toBe(CalendlyBookingButton);
    expect(resolveBookingComponent('hubspot')).toBe(HubSpotBookingButton);
  });

  it('prefers explicit component ids when supplied', () => {
    expect(resolveBookingComponent('google-booking', 'CalendlyBookingButton')).toBe(
      CalendlyBookingButton,
    );
  });

  it('builds button props with shared classes', () => {
    const props = buildBookingButtonProps({ bookingLink: 'https://example.com', label: 'Book' });
    expect(props.className).toContain('inline-flex');
    expect(props.bookingLink).toBe('https://example.com');
    expect(props.label).toBe('Book');
  });
});
