import { z } from 'zod';
import services from './services';
import type { ComponentType } from 'react';

const ServiceSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  // icon is a React component (function)
  icon: z.custom<ComponentType>(() => true, {
    message: 'icon must be a valid React component',
  }),
});

describe('services data', () => {
  it('matches expected shape', () => {
    const ArraySchema = z.array(ServiceSchema).min(1);
    expect(ArraySchema.parse(services)).toBeTruthy();
  });

  it('rejects invalid shape example', () => {
    const ArraySchema = z.array(ServiceSchema);
    const invalid = [{ title: '', description: 42 }];
    const res = ArraySchema.safeParse(invalid);
    expect(res.success).toBe(false);
  });
});
