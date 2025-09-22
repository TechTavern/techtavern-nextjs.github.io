import React from 'react';
import { render, screen } from '@testing-library/react';
import Services from './Services';

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

describe('Services section', () => {
  it('renders technology groups with accessible labels', () => {
    render(<Services />);

    const groups = screen.getAllByRole('group');
    expect(groups).toHaveLength(3);

    expect(screen.getByRole('heading', { level: 3, name: /cloud/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: /ai/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: /code/i })).toBeInTheDocument();
  });

  it('lists each service area with supporting copy', () => {
    render(<Services />);

    expect(
      screen.getByRole('heading', { level: 3, name: /tap into insights/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 3, name: /tap into impact/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 3, name: /tap into solutions/i })
    ).toBeInTheDocument();

    expect(
      screen.getByText(/ai readiness assessments/i)
    ).toBeInTheDocument();
  });
});
