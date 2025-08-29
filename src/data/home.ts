import type { LucideIcon } from 'lucide-react';
import { Shield, Smartphone, Code, Linkedin } from 'lucide-react';
import { DEFAULT_FEATURED_IMAGE } from '@/lib/site';

export const info = {
  image: { src: DEFAULT_FEATURED_IMAGE, alt: 'Tech Tavern - Professional technology consulting and AI services' },
  title: 'Introducing Tech Tavern',
  intro:
    'Helping businesses and communities supercharge their workforce, achieve undeniable impact, and leverage best-in-class coding, data, and DevOps.',
  bullets: [
    'Develop an IT workforce with cutting-edge skills.',
    'Plan and adopt technology for the highest impact.',
    'Supercharge your IT development and operations with best practice implementations.',
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
    title: 'Cybersecurity',
    description:
      'In a digital world, strong cybersecurity measures are essential to protect against cyber attacks. Our team of experts can help identify vulnerabilities and implement security measures to keep your business safe.',
  },
  {
    icon: Smartphone,
    title: 'Impact',
    description:
      'Delivering returns on IT strategies can be difficult without the right planning. It takes talented technical leadership with the right mix of experience and expertise. We help you achieve maximum impact.',
  },
  {
    icon: Code,
    title: 'Technology',
    description:
      'Building the right solutions and avoiding technical debt is critical for long-term IT success. We supplement your IT needs through best practice coding, data, and DevOps to launch you to the next level.',
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

