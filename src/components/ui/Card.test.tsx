import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Card, { CardContent, CardFooter, CardHeader } from './Card';

describe('Card', () => {
  it('renders a default card container with composition helpers', () => {
    const { container } = render(
      <Card>
        <CardHeader>
          <h3>Header</h3>
        </CardHeader>
        <CardContent>
          <p>Body content</p>
        </CardContent>
        <CardFooter>
          <span>Footer</span>
        </CardFooter>
      </Card>,
    );

    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('bg-light');
    expect(screen.getByText('Header')).toBeInTheDocument();
    expect(screen.getByText('Footer')).toBeInTheDocument();
  });

  it('enables interactive behaviour when interactive prop is set', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();

    render(
      <Card interactive onClick={handleClick} aria-label="Interactive card">
        Click me
      </Card>,
    );

    const card = screen.getByRole('button', { name: /interactive card/i });
    expect(card).toHaveAttribute('tabIndex', '0');

    await user.click(card);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('supports custom elements and variant props', () => {
    render(
      <Card as="section" variant="glass" shadow="lg">
        Glass Card
      </Card>,
    );

    const card = screen.getByText('Glass Card');
    expect(card.tagName.toLowerCase()).toBe('section');
    expect(card.className).toContain('bg-gradient-to-br');
    expect(card.className).toContain('shadow-lg');
  });
});
