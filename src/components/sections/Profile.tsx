import Image from 'next/image';
import { Linkedin } from 'lucide-react';

const profile = {
  heading: 'Who We Are',
  image: { src: '/assets/img/ScottSpeakingSCC.jpg', alt: 'Scott Turnbull speaking at Smart Cities Connect', width: 700, height: 500 },
  leaderName: 'Scott Turnbull',
  leaderLinkedIn: 'https://www.linkedin.com/in/scott-turnbull-b2b01b8/',
  leaderBio:
    'a veteran tech executive with over 25 years of experience guiding mission-driven organizations — from universities and nonprofits to municipalities and federal agencies like the UN, NSF, NIST, and DoD — through digital transformation, AI strategy, and data modernization.',
  connectLabel: 'Connect with Scott:',
  social: {
    linkedin: {
      label: "Scott Turnbull's LinkedIn Profile",
      url: 'https://www.linkedin.com/in/scott-turnbull-b2b01b8/',
    },
  },
  expertiseHeading: 'Expertise & Leadership',
  expertise: [
    '<strong><u>Visionary</u></strong> leader in the Smart City and civic innovation movement',
    '<strong><u>Trusted bridge-builder</u></strong>, delivering complex national infrastructure programs',
    '<strong><u>AI and data modernization expert</u></strong>, blending governance, systems design, and engineering',
    'Seasoned <strong><u>public speaker</u></strong> on data strategy, privacy, and tech-fueled economic development',
    '<strong><u>Startup mentor and advisor</u></strong> for early-stage innovation',
    '<strong><u>Community-focused technologist</u></strong>, bridging business strategy and public impact',
  ],
  whyWorkHeading: 'Why Work With Scott?',
  whyWork: [
    'Strategic execution: Balances visionary thinking with disciplined delivery (PMP-certified)',
    'Responsible AI champion: Advocates for mission-aligned, responsible and pragmatic innovation (Gen-AI certified)',
    'Collaborative leadership: Known for aligning stakeholders across sectors and skill levels',
  ],
  certifications: {
    pmp: {
      altText: 'Project Management Professional (PMP) Badge',
      url: 'https://www.credly.com/badges/395bccda-4036-4d3e-8b8b-0d356df16d67/public_url',
      badgeImage: '/images/badges/project-management-professional-pmp.webp',
    },
    genAiLeader: {
      altText: 'Generative AI Leader Certification Badge',
      url: 'https://www.credly.com/badges/6e2064c6-2270-4a4d-8c2b-0a9a3f02b57f/public_url',
      badgeImage: '/images/badges/generative-ai-leader-certification.webp',
    },
  }
};

export default function Profile() {
  const LinkedInIcon = Linkedin;
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center py-12">
      {/* Image Column - appears second on mobile, first on desktop */}
      <div className="order-2 lg:order-1">
        <div className="relative">
          <Image
            src={profile.image.src}
            alt={profile.image.alt}
            width={profile.image.width}
            height={profile.image.height}
            className="w-full h-auto rounded-lg shadow-xl object-cover"
            loading="lazy"
          />
        </div>
        {/* Certifications badges */}
        <div className="mt-6 grid grid-cols-2 gap-6 w-4/5 mx-auto">
          <a
            href={profile.certifications.pmp.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={profile.certifications.pmp.altText}
            className="block"
          >
            <div className="relative w-full aspect-square">
              <Image
                src={profile.certifications.pmp.badgeImage}
                alt={profile.certifications.pmp.altText}
                fill
                sizes="(min-width: 1024px) 300px, (min-width: 768px) 240px, 160px"
                className="object-contain hover:scale-110 transition-transform duration-200"
                priority={false}
              />
            </div>
          </a>
          <a
            href={profile.certifications.genAiLeader.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={profile.certifications.genAiLeader.altText}
            className="block"
          >
            <div className="relative w-full aspect-square">
              <Image
                src={profile.certifications.genAiLeader.badgeImage}
                alt={profile.certifications.genAiLeader.altText}
                fill
                sizes="(min-width: 1024px) 300px, (min-width: 768px) 240px, 160px"
                className="object-contain hover:scale-110 transition-transform duration-200"
                priority={false}
              />
            </div>
          </a>
        </div>
      </div>

      {/* Content Column - appears first on mobile, second on desktop */}
      <div className="order-1 lg:order-2 space-y-6">
        <h2 className="text-4xl md:text-5xl font-heading font-bold text-light leading-tight">
          {profile.heading}
        </h2>
        
        <div className="text-lg text-light/90 leading-relaxed space-y-4">
          <p>
            Tech Tavern is led by{' '}
            <a 
              href={profile.leaderLinkedIn}
              target="_blank" 
              rel="noopener noreferrer"
              className="text-accent-light hover:text-accent transition-colors underline decoration-2 underline-offset-2"
            >
              {profile.leaderName}
            </a>
            , {profile.leaderBio}
          </p>
          
          <div className="flex items-center gap-3">
            <span>{profile.connectLabel}</span>
            <a
              href={profile.social.linkedin.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-linkedin hover:bg-linkedin/90 text-white transition-colors"
              aria-label={profile.social.linkedin.label}
            >
              <LinkedInIcon size={20} />
            </a>
          </div>
        </div>
        
        <div>
          <h3 className="text-2xl font-heading font-semibold text-light mb-4">
            {profile.expertiseHeading}
          </h3>
          <ul className="feature-list space-y-2 text-light">
            {profile.expertise.map((item, i) => (
              <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-2xl font-heading font-semibold text-light mb-4">
            {profile.whyWorkHeading}
          </h3>
          <ul className="feature-list space-y-2 text-light">
            {profile.whyWork.map((item, i) => (
              <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
