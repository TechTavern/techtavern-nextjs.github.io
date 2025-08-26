import React from 'react';
import { render, screen } from '@testing-library/react';

// Mock next/image so we can detect when it is used
jest.mock('next/image', () => {
  return function MockImage(props: any) {
    // Emulate next/image by rendering an img element
    // Add a marker so we can assert that MDXImage chose next/image path
    return <img data-testid="next-image" {...props} />;
  };
});

import MDXImage from './MDXImage';

describe('MDXImage', () => {
  it('uses next/image for local images with known dimensions', () => {
    render(<MDXImage src="/local.png" alt="local" width={640} height={480} />);
    const img = screen.getByAltText('local');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('data-testid', 'next-image');
  });

  it('falls back to native img for external URLs without dimensions', () => {
    render(<MDXImage src="https://example.com/pic.jpg" alt="external" />);
    const img = screen.getByAltText('external');
    expect(img).toBeInTheDocument();
    // Should NOT have the next-image marker
    expect(img).not.toHaveAttribute('data-testid', 'next-image');
  });
});

