import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import fg from "fast-glob";
import { z } from "zod";

const PROFILES_DIR = path.join(process.cwd(), "content", "profiles");

export const BOOKING_PROVIDERS = ["google-booking", "calendly", "hubspot"] as const;
export type BookingProvider = (typeof BOOKING_PROVIDERS)[number];

export const BOOKING_COMPONENT_IDS = [
  "GoogleBookingButton",
  "CalendlyBookingButton",
  "HubSpotBookingButton",
] as const;
export type BookingComponentId = (typeof BOOKING_COMPONENT_IDS)[number];

const ServiceSchema = z.object({
  title: z.string(),
  description: z.string(),
  price: z.string(),
  duration: z.string(),
});

const CaseStudySchema = z.object({
  title: z.string(),
  description: z.string(),
  pdf_url: z.string(),
});

const CertificationSchema = z.object({
  title: z.string(),
  badge_image: z.string(),
  link: z.string().url().optional(),
});

export const SOCIAL_SERVICES = [
  "linkedin",
  "twitter",
  "instagram",
  "facebook",
  "github",
  "gitlab",
  "youtube",
] as const;
export type SocialService = (typeof SOCIAL_SERVICES)[number];

const SocialProfileSchema = z.object({
  service: z.enum(SOCIAL_SERVICES),
  url: z.string().url(),
});

export const BookingSchema = z.object({
  provider: z.enum(BOOKING_PROVIDERS).default("google-booking"),
  link: z
    .string()
    .url()
    .refine((value) => value.startsWith('https://'), {
      message: 'booking link must be an https:// URL',
    }),
  ctaLabel: z.string().optional(),
  color: z.string().optional(),
  embedComponent: z.enum(BOOKING_COMPONENT_IDS).optional(),
});

export type BookingConfig = z.infer<typeof BookingSchema>;

const ProfileFrontmatterSchema = z.object({
  name: z.string(),
  slug: z.string(),
  title: z.string(),
  image: z.string(),
  bio_short: z.string(),
  certifications: z.array(CertificationSchema),
  booking: BookingSchema.optional(),
  services: z.array(ServiceSchema),
  additional_services: z.array(ServiceSchema).optional(),
  socials: z.array(SocialProfileSchema).optional(),
  case_studies: z.array(CaseStudySchema),
});

export type ProfileFrontmatter = z.infer<typeof ProfileFrontmatterSchema>;

export type ProfileMeta = ProfileFrontmatter & {
  filePath: string;
  url: string;
};

async function readProfileFile(filePath: string): Promise<ProfileMeta> {
  const raw = await fs.readFile(filePath, "utf8");
  const { data } = matter(raw);
  const parsed = ProfileFrontmatterSchema.safeParse(data);
  if (!parsed.success) {
    const message = parsed.error.issues
      .map((issue) => {
        const pathLabel = issue.path.join(".") || "frontmatter";
        return `${pathLabel}: ${issue.message}`;
      })
      .join("; ");
    throw new Error(`Invalid profile frontmatter in ${filePath}: ${message}`);
  }

  return {
    ...parsed.data,
    filePath,
    url: `/consulting/${parsed.data.slug}`,
  };
}

export async function getAllProfiles(): Promise<ProfileMeta[]> {
  const files = await fg("*.mdx", { cwd: PROFILES_DIR, absolute: true });
  const profiles = await Promise.all(files.map(readProfileFile));
  return profiles.sort((a, b) => a.name.localeCompare(b.name));
}

export async function getProfileBySlug(slug: string): Promise<ProfileMeta | null> {
  const profiles = await getAllProfiles();
  return profiles.find((profile) => profile.slug === slug) ?? null;
}
