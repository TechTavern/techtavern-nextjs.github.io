export type NavItem = { href: string; label: string };

export const brand = {
  name: 'Tech Tavern',
};

export const hero = {
  title: 'Tech Tavern',
  description:
    'We help you harness AI, data, and cloud to transform your mission into impact—strategically and responsibly.',
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
