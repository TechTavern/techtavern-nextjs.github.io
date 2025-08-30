import Image from 'next/image';
import { Linkedin } from 'lucide-react';

const profile = {
  heading: 'Who We Are',
  image: { src: '/assets/img/ScottSpeakingSCC.jpg', alt: 'Scott Turnbull speaking at Smart Cities Connect', width: 700, height: 500 },
  leaderName: 'Scott Turnbull',
  leaderLinkedIn: 'https://www.linkedin.com/in/scott-turnbull-b2b01b8/',
  leaderBio:
    'a veteran tech executive with over 25 years of experience guiding mission-driven organizations — from universities and nonprofits to municipalities and federal agencies like the UN,NSF, NIST, and DoD — through digital transformation, AI strategy, and data modernization.”',
  connectLabel: 'Connect with Scott:',
  social: {
    linkedin: {
      label: "Scott Turnbull's LinkedIn Profile",
      url: 'https://www.linkedin.com/in/scott-turnbull-b2b01b8/',
    },
  },
  expertiseHeading: 'Expertise & Leadership',
  expertise: [
    'Bold visionary in the Smart City movement.',
    'IT leader with numerous national infrastructure projects.',
    'Expert on data and software engineering.',
    'Frequent speaker on data, privacy, and economic development through technology.',
    'Start-up mentor.',
    'Community and business IT planner with proven results.',
  ],
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
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
