import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import fg from "fast-glob";
import { z } from "zod";

const PROFILES_DIR = path.join(process.cwd(), "content", "profiles");

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

const BookingSchema = z.object({
  provider: z.enum(["google-booking", "calendly"]).default("google-booking"),
  link: z.string().url(),
  ctaLabel: z.string().optional(),
  embedComponent: z.enum(["GoogleBookingButton"]).optional(),
});

export type BookingConfig = z.infer<typeof BookingSchema>;

const ProfileFrontmatterSchema = z.object({
  name: z.string(),
  slug: z.string(),
  title: z.string(),
  image: z.string(),
  bio_short: z.string(),
  certifications: z.array(z.string()),
  booking: BookingSchema.optional(),
  services: z.array(ServiceSchema),
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
