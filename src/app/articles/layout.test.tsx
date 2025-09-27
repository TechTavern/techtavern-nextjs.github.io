import { render, screen } from '@testing-library/react';
import ArticlesLayout, { metadata } from './layout';

jest.mock('@/components/ui/Header', () => ({
  __esModule: true,
  default: () => <header data-testid="articles-header" />,
}));

jest.mock('@/components/ui/Footer', () => ({
  __esModule: true,
  default: () => <footer data-testid="articles-footer" />,
}));

describe('Articles layout', () => {
  it('exposes metadata defaults for the articles section', () => {
    expect(metadata.title?.default).toBe('Articles | Tech Tavern');
    expect(metadata.title?.template).toBe('%s | Tech Tavern Articles');
    expect(metadata.description).toMatch(/Insights and expertise/);
  });

  it('renders header, footer, and main content shell', () => {
    render(
      <ArticlesLayout>
        <p>Inner content</p>
      </ArticlesLayout>,
    );

    expect(screen.getByTestId('articles-header')).toBeInTheDocument();
    expect(screen.getByTestId('articles-footer')).toBeInTheDocument();
    expect(screen.getByText('Inner content')).toBeInTheDocument();
  });
});
