import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from './page';
import { siteMeta } from '@/lib/site';

jest.mock('@/components/ui/Header', () => jest.fn(() => (
  <nav aria-label="Main navigation" role="navigation" data-testid="header-nav" />
)));

jest.mock('next/image', () => ({
  __esModule: true,
  default: (
    props: React.ImgHTMLAttributes<HTMLImageElement> & { fill?: boolean; priority?: boolean }
  ) => {
    const { alt, ...rest } = props;
    const imgProps = { ...rest } as Record<string, unknown>;
    delete imgProps.fill;
    delete imgProps.priority;

    return React.createElement('img', {
      alt: alt ?? '',
      ...(imgProps as React.ImgHTMLAttributes<HTMLImageElement>),
    });
  },
}));

describe('Home page', () => {
  it('renders hero content and key sections', () => {
    render(<Home />);

    expect(screen.getByRole('navigation', { name: /main navigation/i })).toBeInTheDocument();

    expect(
      screen.getByRole('heading', { level: 1, name: siteMeta.title })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('link', { name: /view our services/i })
    ).toHaveAttribute('href', '#Services');

    expect(
      screen.getByRole('heading', { level: 2, name: /our technology stack/i })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('heading', { level: 2, name: /contact us/i })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('contentinfo')
    ).toHaveTextContent(/created by tech tavern/i);
  });
});
