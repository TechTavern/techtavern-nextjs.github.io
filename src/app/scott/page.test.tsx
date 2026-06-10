import { render, screen } from '@testing-library/react';

const mockReplace = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ replace: mockReplace }),
}));

import ScottRedirectPage from './page';

describe('/scott redirect page', () => {
  it('client-redirects to the consulting profile', () => {
    render(<ScottRedirectPage />);
    expect(mockReplace).toHaveBeenCalledWith('/consulting/scott-turnbull/');
  });

  it('renders a fallback link for no-JS visitors and crawlers', () => {
    render(<ScottRedirectPage />);
    const link = screen.getByRole('link', { name: /consulting profile/i });
    // Link normalizes the trailing slash in jsdom; production applies
    // trailingSlash + basePath at build time.
    expect(link.getAttribute('href')).toMatch(/^\/consulting\/scott-turnbull\/?$/);
  });
});
