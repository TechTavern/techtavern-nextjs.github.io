import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { compileMDX } from "next-mdx-remote/rsc";
import type { Metadata } from "next";
import { getAllProfiles, getProfileBySlug } from "@/lib/profiles";
import { getMDXComponents } from "@/mdx-components";
import { mdxOptions } from "@/lib/mdx-options";
import GoogleBookingButton from "@/components/consulting/GoogleBookingButton";
import { getBaseUrl, withBasePath } from "@/lib/site.server";

type PageParams = Promise<{ slug: string }>;

export async function generateStaticParams() {
  const profiles = await getAllProfiles();
  return profiles.map((profile) => ({ slug: profile.slug }));
}

export async function generateMetadata({ params }: { params: PageParams }): Promise<Metadata> {
  const { slug } = await params;
  const profile = await getProfileBySlug(slug);
  if (!profile) return {};

  const baseUrl = getBaseUrl();
  const pageUrl = new URL(withBasePath(profile.url) ?? profile.url, baseUrl).toString();
  const imageUrl = profile.image
    ? new URL(withBasePath(profile.image) ?? profile.image, baseUrl).toString()
    : undefined;

  return {
    title: `${profile.name} | ${profile.title}`,
    description: profile.bio_short,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: profile.name,
      description: profile.bio_short,
      url: pageUrl,
      type: "profile",
      images: imageUrl ? [{ url: imageUrl, alt: profile.name }] : undefined,
    },
  };
}

export default async function ConsultingProfilePage({ params }: { params: PageParams }) {
  const { slug } = await params;
  const profile = await getProfileBySlug(slug);

  if (!profile) {
    notFound();
  }

  const fs = await import("node:fs/promises");
  const source = await fs.readFile(profile.filePath, "utf8");
  const { content } = await compileMDX({
    source,
    options: {
      parseFrontmatter: true,
      mdxOptions,
    },
    components: getMDXComponents({}),
  });

  const booking = profile.booking;
  const ctaLabel = booking?.ctaLabel ?? "Book a Consultation";

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <header className="text-center border-b border-secondary/20 pb-8 mb-12">
        <Image
          src={profile.image}
          alt={profile.name}
          width={150}
          height={150}
          className="mx-auto rounded-full object-cover mb-6"
          priority
        />
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-dark mb-2">{profile.name}</h1>
        <p className="text-xl text-dark/70 mb-6">{profile.title}</p>
        {booking ? (
          booking.embedComponent === "GoogleBookingButton" ? (
            <GoogleBookingButton bookingLink={booking.link} label={ctaLabel} />
          ) : (
            <Link
              href={booking.link}
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-light bg-primary hover:bg-primary-dark transition-colors duration-300 rounded-lg shadow-lg"
              target="_blank"
              rel="noopener noreferrer"
            >
              {ctaLabel}
            </Link>
          )
        ) : null}
      </header>

      <section className="prose prose-lg max-w-none mb-12">{content}</section>

      <section className="mb-12">
        <h2 className="text-3xl font-heading font-bold text-dark mb-6">Certifications</h2>
        <ul className="feature-list space-y-2">
          {profile.certifications.map((certification) => (
            <li key={certification}>{certification}</li>
          ))}
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-heading font-bold text-dark mb-6">Service Offerings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {profile.services.map((service) => (
            <div
              key={service.title}
              className="border border-secondary/30 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <h3 className="text-xl font-heading font-semibold mb-3">{service.title}</h3>
              <p className="text-dark/70 mb-4">{service.description}</p>
              <div className="text-sm text-dark/60">
                <span className="font-semibold">{service.price}</span> • {service.duration}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-heading font-bold text-dark mb-6">Case Studies</h2>
        <div className="grid grid-cols-1 gap-6">
          {profile.case_studies.map((study) => (
            <Link
              key={study.title}
              href={study.pdf_url}
              className="border border-secondary/30 rounded-lg p-6 hover:shadow-lg transition-shadow"
              target="_blank"
              rel="noopener noreferrer"
            >
              <h3 className="text-xl font-heading font-semibold mb-3">{study.title}</h3>
              <p className="text-dark/70 mb-3">{study.description}</p>
              <span className="text-accent font-semibold">View PDF →</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
