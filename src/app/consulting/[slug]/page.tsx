import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { compileMDX } from "next-mdx-remote/rsc";
import type { Metadata } from "next";
import {
  ChevronDown,
  Linkedin,
  Twitter,
  Instagram,
  Facebook,
  Github,
  Gitlab,
  Youtube,
} from "lucide-react";
import { getAllProfiles, getProfileBySlug, type SocialService } from "@/lib/profiles";
import { getMDXComponents } from "@/mdx-components";
import { mdxOptions } from "@/lib/mdx-options";
import { getBaseUrl, withBasePath } from "@/lib/site.server";
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

  const SOCIAL_ICON_MAP: Partial<Record<SocialService, typeof Linkedin>> = {
    linkedin: Linkedin,
    twitter: Twitter,
    instagram: Instagram,
    facebook: Facebook,
    github: Github,
    gitlab: Gitlab,
    youtube: Youtube,
  };

  const CARD_TITLE_CLASS = "text-xl font-heading font-semibold text-dark";
  const CARD_BODY_CLASS = "text-base text-dark/70 leading-relaxed";
  const CARD_META_CLASS = "text-sm text-dark/60 font-medium";

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
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-dark leading-tight mb-3">
          {profile.name}
        </h1>
        <p className="text-lg md:text-xl text-dark/70 leading-relaxed mb-6">{profile.title}</p>
        {booking ? (
          BookingComponent && bookingButtonProps ? (
            <BookingComponent {...bookingButtonProps} />
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

        {profile.socials && profile.socials.length > 0 ? (
          <div className="mt-6 flex items-center justify-center gap-3">
            {profile.socials.map((social) => {
              const Icon = SOCIAL_ICON_MAP[social.service as SocialService];
              if (!Icon) return null;
              return (
                <Link
                  key={`${social.service}-${social.url}`}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-secondary/10 text-dark/60 transition-colors duration-200 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
                  aria-label={`Follow on ${social.service}`}
                >
                  <Icon className="h-5 w-5" aria-hidden />
                </Link>
              );
            })}
          </div>
        ) : null}
      </header>

      <section
        className="prose prose-lg max-w-none mb-12
          prose-headings:font-heading prose-headings:text-dark
          prose-h1:text-3xl prose-h1:font-bold prose-h1:mb-6
          prose-h2:text-2xl prose-h2:font-semibold prose-h2:mb-4 prose-h2:mt-8
          prose-h3:text-xl prose-h3:font-semibold prose-h3:mb-3 prose-h3:mt-6
          prose-p:text-dark/80 prose-p:leading-relaxed prose-p:mb-4
          prose-a:text-accent prose-a:underline hover:prose-a:text-accent-dark prose-a:font-medium prose-a:decoration-2 prose-a:underline-offset-2
          [&_h1_a]:no-underline [&_h2_a]:no-underline [&_h3_a]:no-underline [&_h4_a]:no-underline [&_h5_a]:no-underline [&_h6_a]:no-underline
          [&_h1_a]:text-inherit [&_h2_a]:text-inherit [&_h3_a]:text-inherit [&_h4_a]:text-inherit [&_h5_a]:text-inherit [&_h6_a]:text-inherit
          prose-strong:text-dark prose-strong:font-semibold
          prose-code:text-accent prose-code:bg-secondary/10 prose-code:px-1 prose-code:rounded prose-code:text-sm prose-code:font-mono
          prose-blockquote:border-l-4 prose-blockquote:border-primary/40 prose-blockquote:bg-primary/5 prose-blockquote:p-4 prose-blockquote:italic
          prose-ul:list-disc prose-ul:ml-6 prose-ol:list-decimal prose-ol:ml-6
          prose-img:rounded-lg prose-img:shadow-md"
      >
        {content}
      </section>

      <section className="mb-12">
        <SectionHeading>Certifications</SectionHeading>
        <div className="flex flex-wrap gap-4">
          {profile.certifications.map((certification) => {
            const card = (
              <div className="flex flex-col items-center justify-center gap-3 w-40 h-40 rounded-xl border border-secondary/30 bg-white shadow-sm hover:shadow-md transition-shadow duration-200 px-4 text-center">
                <Image
                  src={certification.badge_image}
                  alt={`${certification.title} badge`}
                  width={72}
                  height={72}
                  className="h-16 w-16 object-contain"
                />
                <span className="text-sm font-semibold text-dark leading-tight">{certification.title}</span>
              </div>
            );

            if (certification.link) {
              return (
                <Link
                  key={certification.title}
                  href={certification.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 rounded-xl"
                >
                  {card}
                </Link>
              );
            }

            return (
              <div key={certification.title} className="rounded-xl">
                {card}
              </div>
            );
          })}
        </div>
      </section>

      <section className="mb-12">
        <SectionHeading>Service Offerings</SectionHeading>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {profile.services.map((service) => (
            <div
              key={service.title}
              className="border border-secondary/30 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <h3 className={`${CARD_TITLE_CLASS} mb-3`}>{service.title}</h3>
              <p className={`${CARD_BODY_CLASS} mb-4`}>{service.description}</p>
              <div className={CARD_META_CLASS}>
                <span className="font-semibold">{service.price}</span> • {service.duration}
              </div>
            </div>
          ))}
        </div>
      </section>

      {profile.additional_services && profile.additional_services.length > 0 ? (
        <section className="mb-12">
          <details className="group border border-secondary/30 rounded-lg p-6 bg-light/80" role="group">
            <summary className="flex items-center justify-between cursor-pointer list-none select-none [&::-webkit-details-marker]:hidden">
              <SectionHeading className="m-0 flex-1" level={3}>
                Additional Services
              </SectionHeading>
              <ChevronDown className="ml-4 h-5 w-5 text-dark/60 transition-transform duration-200 group-open:-rotate-180" />
            </summary>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {profile.additional_services.map((service) => (
                <div
                  key={service.title}
                  className="border border-secondary/30 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <h3 className={`${CARD_TITLE_CLASS} mb-3`}>{service.title}</h3>
                  <p className={`${CARD_BODY_CLASS} mb-4`}>{service.description}</p>
                  <div className={CARD_META_CLASS}>
                    <span className="font-semibold">{service.price}</span> • {service.duration}
                  </div>
                </div>
              ))}
            </div>
          </details>
        </section>
      ) : null}

      <section>
        <SectionHeading>Case Studies</SectionHeading>
        <div className="grid grid-cols-1 gap-6">
          {profile.case_studies.map((study) => (
            <Link
              key={study.title}
              href={study.pdf_url}
              className="border border-secondary/30 rounded-lg p-6 hover:shadow-lg transition-shadow"
              target="_blank"
              rel="noopener noreferrer"
            >
              <h3 className={`${CARD_TITLE_CLASS} mb-3`}>{study.title}</h3>
              <p className={`${CARD_BODY_CLASS} mb-3`}>{study.description}</p>
              <span className="text-accent font-semibold">View PDF →</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
