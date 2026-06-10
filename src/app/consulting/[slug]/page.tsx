import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { compileMDX } from "next-mdx-remote/rsc";
import type { Metadata } from "next";
import {
  Camera,
  ChevronDown,
  Code,
  ExternalLink,
  GitFork,
  MessageCircle,
  Users,
  Video,
  type LucideIcon,
} from "lucide-react";
import { getAllProfiles, getProfileBySlug, type SocialService } from "@/lib/profiles";
import { getMDXComponents } from "@/mdx-components";
import { mdxOptions } from "@/lib/mdx-options";
import { getBaseUrl, withBasePath } from "@/lib/site.server";
import { proseHeadingAnchorReset } from "@/lib/prose";
import {
  resolveBookingComponent,
  buildBookingButtonProps,
} from "@/components/consulting/booking";
import SectionHeading from "@/components/consulting/SectionHeading";

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
  const BookingComponent = booking
    ? resolveBookingComponent(booking.provider, booking.embedComponent)
    : null;
  const bookingButtonProps = booking
    ? buildBookingButtonProps({
        bookingLink: booking.link,
        label: ctaLabel,
        color: booking.color,
      })
    : null;

  const SOCIAL_ICON_MAP: Partial<Record<SocialService, LucideIcon>> = {
    linkedin: Users,
    twitter: MessageCircle,
    instagram: Camera,
    facebook: Users,
    github: Code,
    gitlab: GitFork,
    youtube: Video,
  };


  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 max-w-5xl">
      <header className="border-b border-secondary/20 pb-10 mb-12">
        {/* Desktop: Side-by-side layout, Mobile: Stacked */}
        <div className="flex flex-col md:flex-row md:items-start gap-8 mb-8">
          {/* Profile Image - Larger and more prominent */}
          <div className="flex-shrink-0 mx-auto md:mx-0">
            <Image
              src={profile.image}
              alt={profile.name}
              width={200}
              height={200}
              className="rounded-full object-cover ring-4 ring-secondary/20 shadow-lg"
              priority
            />
          </div>

          {/* Content Section - Left aligned on desktop */}
          <div className="flex-1 text-center md:text-left space-y-4">
            {/* Name - Primary emphasis */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-dark leading-tight">
              {profile.name}
            </h1>

            {/* Title/Tagline - Secondary emphasis */}
            <p className="text-xl md:text-2xl text-accent font-semibold leading-snug">
              {profile.title}
            </p>

            {/* Bio - Tertiary emphasis */}
            <p className="text-base md:text-lg text-dark/70 leading-relaxed max-w-2xl">
              {profile.bio_short}
            </p>

            {/* Social Links - Inline with content */}
            {profile.socials && profile.socials.length > 0 && (
              <div className="flex items-center justify-center md:justify-start gap-3 pt-2">
                {profile.socials.map((social) => {
                  const Icon = SOCIAL_ICON_MAP[social.service as SocialService];
                  if (!Icon) return null;
                  return (
                    <Link
                      key={`${social.service}-${social.url}`}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-secondary/10 text-dark/60 transition-all duration-200 hover:bg-accent/10 hover:text-accent hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
                      aria-label={`Follow on ${social.service}`}
                    >
                      <Icon className="h-5 w-5" aria-hidden />
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* CTA Section - Full width, visually separated */}
        {booking && (
          <div className="flex justify-center md:justify-start mt-6 pt-6 border-t border-secondary/10">
            {BookingComponent && bookingButtonProps ? (
              // eslint-disable-next-line react-hooks/static-components -- resolved from a top-level booking component registry
              <BookingComponent {...bookingButtonProps} />
            ) : (
              <Link
                href={booking.link}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold text-light bg-primary hover:bg-primary-dark transition-all duration-300 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                target="_blank"
                rel="noopener noreferrer"
              >
                {ctaLabel}
                <ExternalLink className="h-5 w-5" aria-hidden />
              </Link>
            )}
          </div>
        )}
      </header>

      <section
        className={`prose prose-lg md:prose-xl max-w-none mb-16
          prose-headings:font-heading prose-headings:text-dark prose-headings:scroll-mt-24
          prose-h2:text-2xl md:prose-h2:text-3xl prose-h2:font-bold prose-h2:mb-6 prose-h2:mt-10 prose-h2:border-b prose-h2:border-secondary/20 prose-h2:pb-3
          prose-h3:text-xl md:prose-h3:text-2xl prose-h3:font-semibold prose-h3:mb-4 prose-h3:mt-8
          prose-p:text-dark/80 prose-p:leading-relaxed prose-p:mb-5
          prose-a:text-accent prose-a:underline hover:prose-a:text-accent-dark prose-a:font-medium prose-a:decoration-2 prose-a:underline-offset-4 prose-a:transition-colors
          ${proseHeadingAnchorReset}
          prose-strong:text-dark prose-strong:font-semibold
          prose-code:text-accent prose-code:bg-secondary/10 prose-code:px-1 prose-code:rounded prose-code:text-sm prose-code:font-mono
          prose-blockquote:border-l-4 prose-blockquote:border-accent/40 prose-blockquote:bg-accent/5 prose-blockquote:p-6 prose-blockquote:rounded-r-lg prose-blockquote:italic prose-blockquote:text-dark/70
          prose-ul:space-y-2 prose-ol:space-y-2
          prose-li:text-dark/80
          prose-img:rounded-lg prose-img:shadow-lg`}
      >
        {content}
      </section>

      <section className="mb-16 bg-gradient-to-br from-light/50 to-secondary/10 rounded-2xl p-8 md:p-10 shadow-sm">
        <SectionHeading className="mb-8 text-dark border-b-0">Certifications</SectionHeading>
        <div className="flex flex-wrap justify-center md:justify-start gap-6">
          {profile.certifications.map((certification) => {
            const card = (
              <div className="group flex flex-col items-center justify-center gap-4 w-44 h-44 rounded-2xl border-2 border-secondary/30 bg-white shadow-md hover:shadow-xl hover:border-accent/50 transition-all duration-300 hover:-translate-y-1 px-4 text-center">
                <Image
                  src={certification.badge_image}
                  alt={`${certification.title} badge`}
                  width={80}
                  height={80}
                  className="h-20 w-20 object-contain transition-transform duration-300 group-hover:scale-110"
                />
                <span className="text-sm font-semibold text-dark leading-tight group-hover:text-accent transition-colors">
                  {certification.title}
                </span>
              </div>
            );

            if (certification.link) {
              return (
                <Link
                  key={certification.title}
                  href={certification.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 rounded-2xl"
                >
                  {card}
                </Link>
              );
            }

            return <div key={certification.title}>{card}</div>;
          })}
        </div>
      </section>

      <section className="mb-16">
        <SectionHeading>Service Offerings</SectionHeading>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {profile.services.map((service) => (
            <div
              key={service.title}
              className="group relative border-2 border-secondary/30 rounded-xl p-6 md:p-8 bg-white hover:border-accent/40 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Subtle gradient accent */}
              <div className="absolute inset-0 bg-gradient-to-br from-accent/0 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />

              <div className="relative z-10">
                <h3 className="text-xl md:text-2xl font-heading font-bold text-dark mb-4 group-hover:text-accent transition-colors">
                  {service.title}
                </h3>
                <p className="text-base md:text-lg text-dark/70 leading-relaxed mb-5">
                  {service.description}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-secondary/20">
                  <span className="text-lg font-bold text-accent">{service.price}</span>
                  <span className="text-sm text-dark/60 font-medium bg-secondary/10 px-3 py-1 rounded-full">
                    {service.duration}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {profile.additional_services && profile.additional_services.length > 0 && (
        <section className="mb-16">
          <details className="group border-2 border-secondary/30 rounded-xl p-6 md:p-8 bg-gradient-to-br from-light/30 to-white shadow-sm hover:shadow-md transition-shadow" role="group">
            <summary className="flex items-center justify-between cursor-pointer list-none select-none [&::-webkit-details-marker]:hidden">
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-dark m-0">
                Additional Services
              </h2>
              <div className="ml-4 flex items-center justify-center h-10 w-10 rounded-full bg-accent/10 group-open:bg-accent/20 transition-colors">
                <ChevronDown className="h-5 w-5 text-accent transition-transform duration-300 group-open:rotate-180" />
              </div>
            </summary>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 animate-in fade-in duration-300">
              {profile.additional_services.map((service) => (
                <div
                  key={service.title}
                  className="border-2 border-secondary/30 rounded-xl p-6 md:p-8 bg-white hover:border-accent/40 hover:shadow-lg transition-all duration-300"
                >
                  <h3 className="text-xl md:text-2xl font-heading font-bold text-dark mb-4">
                    {service.title}
                  </h3>
                  <p className="text-base md:text-lg text-dark/70 leading-relaxed mb-5">
                    {service.description}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-secondary/20">
                    <span className="text-lg font-bold text-accent">{service.price}</span>
                    <span className="text-sm text-dark/60 font-medium bg-secondary/10 px-3 py-1 rounded-full">
                      {service.duration}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </details>
        </section>
      )}

      <section className="mb-16">
        <SectionHeading>Case Studies</SectionHeading>
        <div className="grid grid-cols-1 gap-6 md:gap-8">
          {profile.case_studies.map((study) => (
            <Link
              key={study.title}
              href={study.pdf_url}
              className="group relative border-2 border-secondary/30 rounded-xl p-6 md:p-8 bg-white hover:border-accent/40 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              target="_blank"
              rel="noopener noreferrer"
            >
              {/* Hover gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-accent/0 via-accent/5 to-accent/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />

              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl md:text-2xl font-heading font-bold text-dark group-hover:text-accent transition-colors flex-1">
                    {study.title}
                  </h3>
                  <span className="ml-4 text-accent opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-2 transition-all duration-300">
                    →
                  </span>
                </div>
                <p className="text-base md:text-lg text-dark/70 leading-relaxed mb-4">
                  {study.description}
                </p>
                <span className="inline-flex items-center gap-2 text-accent font-semibold text-base group-hover:gap-3 transition-all">
                  View Case Study
                  <span className="text-lg">→</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
