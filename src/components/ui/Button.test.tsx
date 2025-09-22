import React from 'react';
import { render, screen } from '@testing-library/react';
import Button from './Button';

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href, ...rest }: { children: React.ReactNode; href: string }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

describe('Button', () => {
  it('renders a primary button with loading state', () => {
    render(
      <Button loading aria-label="Submit form">
        Save
      </Button>,
    );
    const button = screen.getByRole('button', { name: /submit form/i });
    expect(button).toHaveClass('bg-primary');
    expect(button).toHaveClass('cursor-wait');
    expect(button.querySelector('svg')).toBeInTheDocument();
  });

  it('renders an accessible link when using the link variant', () => {
    render(
      <Button as="link" href="/articles" variant="secondary" aria-label="Browse articles">
        Articles
      </Button>,
    );
    const link = screen.getByRole('link', { name: /browse articles/i });
    expect(link).toHaveClass('text-primary');
    expect(link).toHaveAttribute('href', '/articles');
  });

  it('renders an external link with appropriate attributes', () => {
    render(
      <Button as="link" href="https://example.com" external aria-label="External">
        External CTA
      </Button>,
    );
    const link = screen.getByRole('link', { name: /external/i });
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
