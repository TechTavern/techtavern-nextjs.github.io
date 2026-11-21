import React from 'react';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Navigation from './Navigation';

const mockUsePathname = jest.fn<string, []>();

// Resolved, basePath-prefixed logo srcs come from the server parent (Header).
const logos = {
  onDark: '/base/assets/img/logos/inverted.svg',
  onLight: '/base/assets/img/logos/standard.svg',
};

// Stand-in for next/link applying basePath, so links that bypass Link
// (raw <a href="/...">) show up unprefixed.
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href, ...rest }: { children: React.ReactNode; href: string }) => (
    <a href={`/base${href}`} {...rest}>
      {children}
    </a>
  ),
}));

jest.mock('next/navigation', () => ({
  usePathname: () => mockUsePathname(),
}));

describe('Navigation', () => {
  beforeEach(() => {
    mockUsePathname.mockReturnValue('/');
  });

  it('renders links on the home page and controls the mobile menu', async () => {
    render(<Navigation logos={logos} />);

    expect(
      screen.getByRole('navigation', { name: /main navigation/i })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('menuitem', { name: /navigate to services section/i })
    ).toHaveAttribute('href', '/base/#Services');

    const toggle = screen.getByRole('button', { name: /open mobile menu/i });
    await userEvent.click(toggle);
    expect(
      screen.getByRole('menu', { name: /mobile navigation menu/i })
    ).toBeInTheDocument();

    const contactItems = screen.getAllByRole('menuitem', { name: /navigate to contact section/i });
    await userEvent.click(contactItems[contactItems.length - 1]);
    expect(
      screen.queryByRole('menu', { name: /mobile navigation menu/i })
    ).not.toBeInTheDocument();
  });

  it('updates styling after scrolling', () => {
    render(<Navigation logos={logos} />);
    const nav = screen.getByRole('navigation', { name: /main navigation/i });
    expect(nav.className).toContain('bg-transparent');

    Object.defineProperty(window, 'scrollY', { value: 80, writable: true });
    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });

    expect(nav.className).toContain('bg-white/95');
  });

  it('renders the logo src it is given, switching variants on scroll', () => {
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true });
    render(<Navigation logos={logos} />);
    expect(screen.getByRole('img', { name: 'Tech Tavern' })).toHaveAttribute('src', logos.onDark);

    Object.defineProperty(window, 'scrollY', { value: 80, writable: true });
    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });
    expect(screen.getByRole('img', { name: 'Tech Tavern' })).toHaveAttribute('src', logos.onLight);
  });

  it('routes every root-relative link through next/link so basePath applies', async () => {
    render(<Navigation logos={logos} />);
    await userEvent.click(screen.getByRole('button', { name: /open mobile menu/i }));
    const hrefs = screen
      .getAllByRole('link')
      .concat(screen.getAllByRole('menuitem'))
      .map((el) => el.getAttribute('href') ?? '')
      .filter((href) => href.startsWith('/'));
    expect(hrefs.length).toBeGreaterThan(5);
    for (const href of hrefs) {
      expect(href.startsWith('/base/')).toBe(true);
    }
  });

  it('returns null on non-home routes', () => {
    mockUsePathname.mockReturnValue('/articles');
    const { container } = render(<Navigation logos={logos} />);
    expect(container.firstChild).toBeNull();
  });
});
