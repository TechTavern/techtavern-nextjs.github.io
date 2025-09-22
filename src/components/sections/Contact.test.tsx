import React from 'react';
import { render, screen } from '@testing-library/react';
import Contact from './Contact';

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

describe('Contact section', () => {
  it('displays contact details and mailto link', () => {
    render(<Contact />);

    expect(
      screen.getByRole('heading', { level: 2, name: /contact us/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/Glen Allen, Virginia/i)).toBeInTheDocument();

    const emailLink = screen.getByRole('link', { name: /info@tech-tavern.com/i });
    expect(emailLink).toHaveAttribute('href', 'mailto:info@tech-tavern.com');
  });
});
