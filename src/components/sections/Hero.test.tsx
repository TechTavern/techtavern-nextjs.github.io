import { render, screen } from '@testing-library/react';
import Hero from './Hero';

describe('Hero section', () => {
  const props = {
    title: 'Build resilient AI strategy',
    description: 'We help mission-driven teams adopt AI responsibly with measurable outcomes.',
  };

  it('renders primary CTAs with accessible labels', () => {
    render(<Hero {...props} />);

    expect(screen.getByRole('link', { name: /view our services/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /read our articles/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /contact us/i })).toBeInTheDocument();
  });

  it('matches the hero layout snapshot', () => {
    const { container } = render(<Hero {...props} />);
    const hero = container.querySelector('header[aria-label="Main content"]');
    expect(hero).toMatchSnapshot();
  });
});
