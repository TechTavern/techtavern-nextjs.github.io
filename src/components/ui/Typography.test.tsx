import React from 'react';
import { render, screen } from '@testing-library/react';
import Typography, { Caption, Heading3 } from './Typography';

describe('Typography', () => {
  it('derives the correct semantic element from the variant', () => {
    render(<Heading3>Section Heading</Heading3>);
    const heading = screen.getByText('Section Heading');
    expect(heading.tagName.toLowerCase()).toBe('h3');
    expect(heading.className).toContain('font-heading');
  });

  it('falls back to paragraph for body copy and allows overrides', () => {
    render(
      <Typography variant="body" color="muted" align="center">
        Body copy
      </Typography>,
    );
    const paragraph = screen.getByText('Body copy');
    expect(paragraph.tagName.toLowerCase()).toBe('p');
    expect(paragraph.className).toContain('text-dark/70');
    expect(paragraph.className).toContain('text-center');
  });

  it('supports explicit element overrides', () => {
    render(<Caption as="div">Caption text</Caption>);
    const caption = screen.getByText('Caption text');
    expect(caption.tagName.toLowerCase()).toBe('div');
    expect(caption.className).toContain('text-sm');
  });
});
