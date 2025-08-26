import { z } from 'zod';

// Define the schema for environment variables we care about
const EnvSchema = z.object({
  SITE_URL: z.string().url().optional(),
  NEXT_PUBLIC_BASE_PATH: z.string().optional().default(''),
});

// Parse selectively from process.env to avoid pulling in unrelated keys
function parseEnv() {
  const raw = {
    SITE_URL: process.env.SITE_URL,
    NEXT_PUBLIC_BASE_PATH: process.env.NEXT_PUBLIC_BASE_PATH,
  } as Record<string, unknown>;
  const result = EnvSchema.safeParse(raw);
  if (!result.success) {
    const issues = result.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join('; ');
    throw new Error(`Invalid environment configuration: ${issues}`);
  }
  return result.data;
}

export const env = parseEnv();

