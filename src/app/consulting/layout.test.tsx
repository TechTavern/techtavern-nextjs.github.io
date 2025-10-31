import { screen } from '@testing-library/react';
import ConsultingLayout from './layout';
import { renderWithProviders } from '@/tests/test-utils';

jest.mock('@/components/ui/Header', () => {
  const MockHeader = ({ variant }: { variant: string }) => (
    <header data-testid="header" data-variant={variant} />
  );
  MockHeader.displayName = 'MockHeader';
  return { __esModule: true, default: MockHeader };
});

jest.mock('@/components/ui/Footer', () => {
  const MockFooter = () => <footer data-testid="footer" />;
  MockFooter.displayName = 'MockFooter';
  return { __esModule: true, default: MockFooter };
});

describe('Consulting layout', () => {
  it('wraps children with header and footer', () => {
    renderWithProviders(
      <ConsultingLayout>
        <div data-testid="content">Hello</div>
      </ConsultingLayout>,
    );

    expect(screen.getByTestId('header')).toHaveAttribute('data-variant', 'interior');
    expect(screen.getByTestId('content')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });
});
