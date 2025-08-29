import type { LucideIcon } from 'lucide-react';
import { Shield, TrendingUp, Code } from 'lucide-react';

// Deprecated/basic services summary retained for compatibility/tests
export interface Service {
  title: string;
  description: string;
  icon: LucideIcon;
}

export const services: Service[] = [
  {
    title: 'Cybersecurity',
    description:
      'Protecting your organization from cyber threats through comprehensive security assessments, vulnerability identification, and implementation of robust security measures to safeguard your digital assets.',
    icon: Shield,
  },
  {
    title: 'Impact',
    description:
      'Strategic IT planning and technical leadership that drives real results. We help you develop and execute technology strategies that align with your business objectives and deliver measurable outcomes.',
    icon: TrendingUp,
  },
  {
    title: 'Technology',
    description:
      'Supporting your IT needs through expert coding, data solutions, and DevOps practices. We help organizations avoid technical debt while building scalable, maintainable technology solutions.',
    icon: Code,
  },
];

// Centralized data used by the Services section component
export interface TechLogo {
  src: string;
  alt: string;
  title: string;
}

export interface TechnologyGroup {
  title: string;
  logos: TechLogo[];
}

export const technologyGroups: TechnologyGroup[] = [
  {
    title: 'Cloud',
    logos: [
      { src: '/assets/img/logos/Microsoft_Azure_Logo.svg', alt: 'Microsoft Azure Logo', title: 'Microsoft Azure' },
      { src: '/assets/img/logos/Amazon_Web_Services_Logo.svg', alt: 'Amazon Web Services Logo', title: 'Amazon Web Services' },
      { src: '/assets/img/logos/Google_Cloud_Logo.svg', alt: 'Google Cloud Logo', title: 'Google Cloud Platform' },
    ],
  },
  {
    title: 'AI',
    logos: [
      { src: '/assets/img/logos/OpenAI_Logo.svg', alt: 'OpenAI ChatGPT Logo', title: 'OpenAI ChatGPT' },
      { src: '/assets/img/logos/Anthropic_Claude_Logo.svg', alt: 'Anthropic Claude Logo', title: 'Anthropic Claude' },
      { src: '/assets/img/logos/Google_Gemini_Logo.svg', alt: 'Google Gemini Logo', title: 'Google Gemini' },
      { src: '/assets/img/logos/Grok-2025-logo.svg', alt: 'Grok Logo', title: 'Grok AI' },
    ],
  },
  {
    title: 'Code',
    logos: [
      { src: '/assets/img/logos/Python-logo-notext.svg', alt: 'Python logo', title: 'Python programming language' },
      { src: '/assets/img/logos/Go_Logo_Blue.svg', alt: 'Go Logo', title: 'Go programming language' },
      { src: '/assets/img/logos/React-icon.svg', alt: 'React logo', title: 'React' },
      { src: '/assets/img/logos/angular.svg', alt: 'Angular logo', title: 'Angular' },
    ],
  },
];

export interface ServiceArea {
  title: string;
  content: string;
  features: string[];
  image: string;
  imageAlt: string;
  layout: 'text-first' | 'image-first';
}

export const serviceAreas: ServiceArea[] = [
  {
    title: 'Tap into Skills',
    content:
      'Effective recruitment, collaborative tutorials, formal training, and development challenges are all effective ways to grow your workforce. Tech Tavern has a long history of facilitating growth and achieving real-world impact.',
    features: [
      'Designing and delivering tutorials and workshops.',
      'Fostering community engagement through technology.',
      'Running challenges, hackathons, and reverse pitches.',
      'Coordinating meetups and professional exchanges.',
    ],
    image: '/assets/img/undraw_teaching_f1cm.svg',
    imageAlt: 'line drawing of a person standing in front of a blackboard',
    layout: 'text-first',
  },
  {
    title: 'Tap into Impact',
    content:
      'Tech Tavern helps you execute your strategy through experience at all levels of IT. We move you forward by collaboratively developing and managing plans, measuring and monitoring outcomes, or providing IT leadership.',
    features: [
      'Interim CIO and IT Leadership.',
      'Strategic IT planning support.',
      'Proposal and grant support.',
      'IT and data policy development.',
    ],
    image: '/assets/img/undraw_Scrum_board_re_wk7v.svg',
    imageAlt: 'line drawing of a person in front of a scrum board',
    layout: 'image-first',
  },
  {
    title: 'Tap into Code',
    content:
      'In addition to strategic IT leadership, Tech Tavern provides direct hands-on support for your IT needs. Be it kick-starting an initiative with best practices, prototyping, and rapid development, or consolidating and streamlining operations, Tech Tavern has the right skills and partnerships for you.',
    features: [
      'Software creation and support with a focus on Python, Go, Javascript/Typescript.',
      'Data support for standard RDBMS systems, document-based or time series databases.',
      'Data structure, simulation and processing.',
      'Cloud operations and services.',
    ],
    image: '/assets/img/undraw_programming_2svr.svg',
    imageAlt:
      'line drawing of someone from behind working on a computer with several monitors',
    layout: 'text-first',
  },
];

export default services;
