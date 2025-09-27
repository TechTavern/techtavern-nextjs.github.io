import { render, screen, fireEvent } from '@testing-library/react';
import Badge from './Badge';

jest.mock('@/lib/variants', () => ({
  getBadgeClasses: jest.fn(({ variant, size, rounded, removable, className }) =>
    [
      `variant-${variant}`,
      `size-${size}`,
      rounded ? 'rounded' : 'not-rounded',
      removable ? 'removable' : 'static',
      className,
    ]
      .filter(Boolean)
      .join(' '),
  ),
}));

describe('Badge', () => {
  it('renders static badges with composed classes', () => {
    render(
      <Badge variant="primary" size="lg" aria-label="New">
        New
      </Badge>,
    );

    const badge = screen.getByLabelText('New');
    expect(badge).toHaveTextContent('New');
    expect(badge.className).toContain('variant-primary');
    expect(badge.className).toContain('size-lg');
    expect(badge.className).toContain('static');
  });

  it('renders removable badges with a dismiss control', () => {
    const onRemove = jest.fn();
    render(
      <Badge removable rounded onRemove={onRemove} aria-label="Filter">
        Filter
      </Badge>,
    );

    const removeButton = screen.getByRole('button', { name: 'Remove Filter' });
    fireEvent.click(removeButton);
    expect(onRemove).toHaveBeenCalledTimes(1);
  });
});
