import React from 'react';
import { renderWithProviders } from '@/tests/test-utils';
import ConsultingProfilePage, {
  generateStaticParams,
  generateMetadata,
} from './page';
import { getAllProfiles, getProfileBySlug } from '@/lib/profiles';
import type { ProfileMeta } from '@/lib/profiles';
import { screen } from '@testing-library/react';

jest.mock('@/lib/mdx-options', () => ({
  mdxOptions: { remarkPlugins: [], rehypePlugins: [] },
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: (
    props: React.ImgHTMLAttributes<HTMLImageElement> & { fill?: boolean; priority?: boolean },
  ) => {
    const { alt, fill, priority, ...rest } = props;
    void fill;
    void priority;
    // eslint-disable-next-line @next/next/no-img-element
    return <img alt={alt ?? ''} {...rest} />;
  },
}));

const compileMDXMock = jest.fn(async () => ({
  content: (
    <article>
      <h2 id="about">About</h2>
      <p>Profile biography content from MDX.</p>
    </article>
  ),
}));

const readFileMock = jest.fn(async () => '# Consultant biography');

jest.mock('node:fs/promises', () => ({
  readFile: (...args: Parameters<typeof readFileMock>) => readFileMock(...args),
}));

jest.mock('next-mdx-remote/rsc', () => ({
  compileMDX: (...args: Parameters<typeof compileMDXMock>) => compileMDXMock(...args),
}));

const notFoundMock = jest.fn(() => {
  throw new Error('NOT_FOUND');
});

jest.mock('next/navigation', () => ({
  notFound: () => notFoundMock(),
}));

jest.mock('@/lib/profiles', () => ({
  getAllProfiles: jest.fn(),
  getProfileBySlug: jest.fn(),
}));

jest.mock('@/lib/site.server', () => ({
  getBaseUrl: () => 'https://example.com',
  withBasePath: (path: string) => path,
}));

const mockBookingComponent = jest.fn(({ label }: { label: string }) => (
  <button type="button">{label}</button>
));

jest.mock('@/components/consulting/booking', () => ({
  resolveBookingComponent: jest.fn(() => mockBookingComponent),
  buildBookingButtonProps: jest.fn((props) => ({ ...props, className: 'mock-button' })),
}));

const mockGetAllProfiles = getAllProfiles as jest.MockedFunction<typeof getAllProfiles>;
const mockGetProfileBySlug = getProfileBySlug as jest.MockedFunction<typeof getProfileBySlug>;

const profile: ProfileMeta = {
  name: 'Jordan Avery',
  slug: 'jordan-avery',
  title: 'AI Transformation Partner',
  image: '/images/profiles/jordan-avery.jpg',
  bio_short: 'Helping organizations adopt AI responsibly.',
  certifications: [
    {
      title: 'Certified AI Strategist',
      badge_image: '/images/badges/ai-strategist.png',
      link: 'https://badges.example.com/ai-strategist',
    },
  ],
  booking: {
    provider: 'google-booking',
    link: 'https://calendar.google.com/book/jordan',
    ctaLabel: 'Book Jordan',
    embedComponent: 'GoogleBookingButton',
  },
  socials: [
    { service: 'linkedin', url: 'https://linkedin.com/in/jordan' },
    { service: 'github', url: 'https://github.com/jordan' },
  ],
  services: [
    {
      title: 'AI Readiness Assessment',
      description: 'Evaluate current state and build transformation roadmap.',
      price: '$4,500',
      duration: '3 weeks',
    },
  ],
  additional_services: [
    {
      title: 'Executive Workshops',
      description: 'Interactive workshops to align leadership teams.',
      price: '$2,000',
      duration: '1 day',
    },
  ],
  case_studies: [
    {
      title: 'AI for Good Case Study',
      description: 'Scaled predictive analytics for international NGO.',
      pdf_url: '/case-studies/ai-for-good.pdf',
    },
  ],
  filePath: '/virtual/profiles/jordan-avery.mdx',
  url: '/consulting/jordan-avery',
};

describe('Consulting profile route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('generates static params with available consultant slugs', async () => {
    mockGetAllProfiles.mockResolvedValueOnce([profile]);
    await expect(generateStaticParams()).resolves.toEqual([{ slug: 'jordan-avery' }]);
  });

  it('renders consultant profile content, booking CTA, and socials', async () => {
    mockGetProfileBySlug.mockResolvedValueOnce(profile);

    const page = await ConsultingProfilePage({ params: Promise.resolve({ slug: 'jordan-avery' }) });
    renderWithProviders(page);

    expect(screen.getByRole('heading', { level: 1, name: 'Jordan Avery' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Book Jordan' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Follow on linkedin' })).toHaveAttribute(
      'href',
      'https://linkedin.com/in/jordan',
    );
    expect(screen.getByRole('link', { name: 'Follow on github' })).toHaveAttribute(
      'href',
      'https://github.com/jordan',
    );
    expect(screen.getByText(/AI Readiness Assessment/i)).toBeInTheDocument();
    expect(screen.getByText(/Executive Workshops/i)).toBeInTheDocument();
    expect(screen.getByText(/AI for Good Case Study/i)).toBeInTheDocument();
  });

  it('throws notFound when the consultant does not exist', async () => {
    mockGetProfileBySlug.mockResolvedValueOnce(null);

    await expect(
      ConsultingProfilePage({ params: Promise.resolve({ slug: 'missing-consultant' }) }),
    ).rejects.toThrow('NOT_FOUND');
  });
});

describe('Consulting profile metadata', () => {
  it('builds metadata using profile context', async () => {
    mockGetProfileBySlug.mockResolvedValueOnce(profile);

    const metadata = await generateMetadata({ params: Promise.resolve({ slug: 'jordan-avery' }) });
    expect(metadata.title).toBe('Jordan Avery | AI Transformation Partner');
    expect(metadata.alternates?.canonical).toBe('https://example.com/consulting/jordan-avery');
  });
});
