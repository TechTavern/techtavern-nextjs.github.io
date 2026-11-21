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

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href, ...rest }: { children: React.ReactNode; href: string }) => (
    <a href={href} {...rest}>
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
    ).toHaveAttribute('href', '/#Services');

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

  it('returns null on non-home routes', () => {
    mockUsePathname.mockReturnValue('/articles');
    const { container } = render(<Navigation logos={logos} />);
    expect(container.firstChild).toBeNull();
  });
});
