import type { LucideIcon } from 'lucide-react';
import { GraduationCap, TrendingUp, Code } from 'lucide-react';

export interface Service {
  title: string;
  description: string;
  icon: LucideIcon;
}

export const services: Service[] = [
  {
    title: 'Tap into Skills',
    description:
      'Effective recruitment, collaborative tutorials, formal training, and development challenges are all effective ways to grow your workforce. Tech Tavern has a long history of facilitating growth and achieving real-world impact.',
    icon: GraduationCap,
  },
  {
    title: 'Tap into Impact',
    description:
      'Tech Tavern helps you execute your strategy through experience at all levels of IT. We move you forward by collaboratively developing and managing plans, measuring and monitoring outcomes, or providing IT leadership.',
    icon: TrendingUp,
  },
  {
    title: 'Tap into Code',
    description:
      'In addition to strategic IT leadership, Tech Tavern provides direct hands-on support for your IT needs. Be it kick-starting an initiative with best practices, prototyping, and rapid development, or consolidating and streamlining operations, Tech Tavern has the right skills and partnerships for you.',
    icon: Code,
  },
];

export default services;
