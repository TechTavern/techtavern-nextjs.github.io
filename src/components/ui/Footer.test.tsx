import React from 'react';
import { render, screen, within } from '@testing-library/react';
import Footer from './Footer';

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href, ...rest }: { children: React.ReactNode; href: string }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

describe('Footer', () => {
  it('renders footer navigation links with expected anchors', () => {
    render(<Footer />);

    const nav = screen.getByRole('navigation', { name: /footer navigation/i });
    const links = within(nav).getAllByRole('link');

    expect(links.map((link) => link.getAttribute('href'))).toEqual([
      '/',
      '/#Services',
      '/#About',
      '/articles',
      '/#Contact',
    ]);
  });

  it('shows the current year in the copyright notice', () => {
    render(<Footer />);
    const year = new Date().getFullYear();
    expect(screen.getByText(new RegExp(`${year}`))).toBeInTheDocument();
  });
});
