import { z } from 'zod';

// Define the schema for environment variables we care about
const EnvSchema = z.object({
  SITE_URL: z.preprocess(
    (value) => {
      if (typeof value !== 'string') {
        return undefined;
      }
      const trimmed = value.trim();
      return trimmed.length === 0 ? undefined : trimmed;
    },
    z.string().url().optional()
  ),
  NEXT_PUBLIC_BASE_PATH: z.preprocess(
    (value) => {
      if (typeof value !== 'string') {
        return '';
      }
      return value.trim();
    },
    z
      .string()
      .regex(/^$|^\/(?!\/).*$/, {
        message:
          'NEXT_PUBLIC_BASE_PATH must be empty or start with a single leading slash (e.g. "/preview")',
      })
      .transform((val) => {
        if (val === '' || val === '/') {
          return '';
        }
        return val.replace(/\/+$/, '');
      })
  ),
  NEXT_PUBLIC_GA_ID: z.preprocess(
    (value) => {
      if (typeof value !== 'string') {
        return undefined;
      }
      const trimmed = value.trim();
      return trimmed.length === 0 ? undefined : trimmed;
    },
    z.string().optional()
  ),
});

// Parse selectively from process.env to avoid pulling in unrelated keys
export function parseEnv() {
  const raw = {
    SITE_URL: process.env.SITE_URL,
    NEXT_PUBLIC_BASE_PATH: process.env.NEXT_PUBLIC_BASE_PATH,
    NEXT_PUBLIC_GA_ID: process.env.NEXT_PUBLIC_GA_ID,
  } as Record<string, unknown>;
  const result = EnvSchema.safeParse(raw);
  if (!result.success) {
    const issues = result.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join('; ');
    throw new Error(`Invalid environment configuration: ${issues}`);
  }
  return result.data;
}

export const env = parseEnv();
