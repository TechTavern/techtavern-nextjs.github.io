import { screen } from '@testing-library/react';
import SectionHeading from '../SectionHeading';
import { renderWithProviders } from '@/tests/test-utils';

describe('SectionHeading', () => {
  it('renders an h2 with slugified id and self-link by default', () => {
    renderWithProviders(<SectionHeading>My Awesome Heading!</SectionHeading>);

    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveAccessibleName('My Awesome Heading! section');
    expect(heading).toHaveAttribute('id', 'my-awesome-heading');

    const anchor = screen.getByRole('link', { name: 'My Awesome Heading! section' });
    expect(anchor).toHaveAttribute('href', '#my-awesome-heading');
    expect(anchor).toHaveClass('no-underline');
  });

  it('supports custom heading levels', () => {
    renderWithProviders(
      <SectionHeading level={3} className="custom-class">
        Supporting Details
      </SectionHeading>,
    );

    const heading = screen.getByRole('heading', { level: 3 });
    expect(heading).toHaveAccessibleName('Supporting Details section');
    expect(heading).toHaveClass('custom-class');
  });
});
