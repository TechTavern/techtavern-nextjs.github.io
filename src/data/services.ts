import type { LucideIcon } from 'lucide-react';
import { Shield, TrendingUp, Code } from 'lucide-react';

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

export default services;
