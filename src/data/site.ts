export type NavItem = { href: string; label: string };

export const brand = {
  name: 'Tech Tavern',
};

export const hero = {
  title: 'Tech Tavern',
  description:
    'Empowering businesses through innovative technology solutions, cybersecurity expertise, and strategic IT leadership.',
};

export const navigation: NavItem[] = [
  { href: '/#', label: 'Home' },
  { href: '/#Services', label: 'Services' },
  { href: '/#About', label: 'About' },
  { href: '/#Contact', label: 'Contact' },
  { href: '/articles', label: 'Articles' },
];

export const contact = {
  heading: 'Contact us:',
  intro:
    'To reach out with questions, talk about how we might be able to work together, or anything else...',
  city: 'Glen Allen, Virginia',
  country: 'United States',
  email: 'info@tech-tavern.com',
};

export const analytics = {
  gaMeasurementId: 'G-T9WJ69XJMF',
};
