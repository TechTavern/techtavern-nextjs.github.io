import React from 'react';
import { render, screen } from '@testing-library/react';
import Header from './Header';
import Navigation from '@/components/ui/Navigation';

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href, ...rest }: { children: React.ReactNode; href: string }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

jest.mock('@/components/ui/Navigation', () => jest.fn(() => <nav data-testid="home-nav" />));

const MockNavigation = Navigation as unknown as jest.Mock;

describe('Header', () => {
  beforeEach(() => {
    MockNavigation.mockClear();
  });

  it('renders the Navigation component for the home variant', () => {
    render(<Header variant="home" />);
    expect(MockNavigation).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('home-nav')).toBeInTheDocument();
  });

  it('renders interior navigation links for the interior variant', () => {
    render(<Header variant="interior" />);

    expect(MockNavigation).not.toHaveBeenCalled();
    expect(
      screen.getByRole('link', { name: /tech tavern/i })
    ).toHaveAttribute('href', '/');
    expect(
      screen.getByRole('link', { name: /contact/i })
    ).toHaveAttribute('href', '/#Contact');
  });
});
