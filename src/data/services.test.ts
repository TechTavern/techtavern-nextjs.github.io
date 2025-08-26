import { z } from 'zod';
import services from './services';

const ServiceSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  // icon is a React component (function). We allow any here.
  icon: z.any(),
});

describe('services data', () => {
  it('matches expected shape', () => {
    const ArraySchema = z.array(ServiceSchema).min(1);
    expect(ArraySchema.parse(services)).toBeTruthy();
  });

  it('rejects invalid shape example', () => {
    const ArraySchema = z.array(ServiceSchema);
    const invalid = [{ title: '', description: 42 } as any];
    const res = ArraySchema.safeParse(invalid);
    expect(res.success).toBe(false);
  });
});

