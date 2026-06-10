import { BookingSchema } from './profiles';

const validBooking = {
  provider: 'calendly',
  link: 'https://calendly.com/foo',
};

describe('BookingSchema link scheme validation', () => {
  it('accepts an https booking link', () => {
    const result = BookingSchema.safeParse(validBooking);
    expect(result.success).toBe(true);
  });

  it('rejects an http booking link', () => {
    const result = BookingSchema.safeParse({ ...validBooking, link: 'http://calendly.com/foo' });
    expect(result.success).toBe(false);
  });

  it('rejects javascript: booking links', () => {
    const result = BookingSchema.safeParse({ ...validBooking, link: 'javascript:void(0)' });
    expect(result.success).toBe(false);
  });
});
