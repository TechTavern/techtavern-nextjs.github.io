import type { LucideIcon } from 'lucide-react';
import { Shield, Brain, Rocket, Linkedin } from 'lucide-react';
import { DEFAULT_FEATURED_IMAGE } from '@/lib/site';

export const info = {
  image: { src: DEFAULT_FEATURED_IMAGE, alt: 'Tech Tavern - Professional technology consulting and AI services' },
  title: 'Introducing Tech Tavern',
  intro:
    'We help you harness AI, data, and cloud to transform your mission into impact—strategically and responsibly.',
  bullets: [
    'Strategic Roadmaps – Insight-driven plans for AI, data governance, and digital transformation.',
    'Prototype to Production – We build pilots, proofs of concept, and production-ready tech.',
    'Mission First – Technology that amplifies purpose, tailored to nonprofits, public sector, and beyond.'
  ],
  note: 'Tech Tavern is a veteran-owned business.',
};

export type MissionItem = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export const mission: MissionItem[] = [
  {
    icon: Shield,
    title: 'Data Security',
    description:
      'Build trust with governance, compliance, and responsible data practices.',
  },
  {
    icon: Brain,
    title: 'Artificial Intelligence',
    description:
      'Harness the power of AI to drive innovation and efficiency - from roadmap to porotype to policy.',
  },
  {
    icon: Rocket,
    title: 'Digital Transformation',
    description:
      'Reimagine how your organization delivers mission with modern infrastructure and leadership support.',
  },
];

export const profile = {
  heading: 'Who We Are',
  image: { src: '/assets/img/ScottSpeakingSCC.jpg', alt: 'Scott Turnbull speaking at an event', width: 700, height: 500 },
  leaderName: 'Scott Turnbull',
  leaderLinkedIn: 'https://www.linkedin.com/in/scott-turnbull-b2b01b8/',
  leaderBio:
    'Scott Turnbull, a seasoned IT professional with over 25 years of experience with national, regional, and local IT programs. His expertise includes work with universities, local government, non-profits, and includes partnerships with federal agencies like the National Science Foundation, NIST, and the Department of Defense.',
  connectLabel: 'Connect with Scott:',
  social: {
    linkedin: {
      label: "Scott Turnbull's LinkedIn Profile",
      url: 'https://www.linkedin.com/in/scott-turnbull-b2b01b8/',
      icon: Linkedin as LucideIcon,
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

