import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import GoogleAnalytics from './GoogleAnalytics';

const mockUsePathname = jest.fn<string, []>();
const mockUseSearchParams = jest.fn<URLSearchParams | null, []>();

jest.mock('next/navigation', () => ({
  usePathname: () => mockUsePathname(),
  useSearchParams: () => mockUseSearchParams(),
}));

jest.mock('next/script', () => ({
  __esModule: true,
  default: ({ id, children, ...props }: { id?: string; children?: React.ReactNode }) => (
    <script data-testid={id ? `script-${id}` : 'script-loader'} {...props}>
      {children}
    </script>
  ),
}));

describe('GoogleAnalytics', () => {
  beforeEach(() => {
    mockUsePathname.mockReturnValue('/articles');
    mockUseSearchParams.mockReturnValue(new URLSearchParams('ref=hero'));
    document.title = 'Articles | Tech Tavern';
  });

  it('renders analytics scripts and sends pageview updates', async () => {
    const gtag = jest.fn();
    (window as typeof window & { gtag?: typeof gtag }).gtag = gtag;

    render(<GoogleAnalytics measurementId="G-123" />);

    expect(screen.getByTestId('script-loader')).toHaveAttribute(
      'src',
      'https://www.googletagmanager.com/gtag/js?id=G-123',
    );
    expect(screen.getByTestId('script-google-analytics')).toBeInTheDocument();

    await waitFor(() => {
      expect(gtag).toHaveBeenCalledWith(
        'config',
        'G-123',
        expect.objectContaining({
          page_path: '/articles?ref=hero',
          page_title: 'Articles | Tech Tavern',
        }),
      );
    });
  });
});
