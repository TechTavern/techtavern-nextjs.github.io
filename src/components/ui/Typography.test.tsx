import React from 'react';
import { render, screen } from '@testing-library/react';
import Typography, { Caption, Heading3, Overline, Subtitle } from './Typography';

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

  it('selects default elements for subtitle and overline variants', () => {
    render(
      <div>
        <Subtitle>Subheading</Subtitle>
        <Overline transform="uppercase">Lead-in</Overline>
      </div>,
    );

    const subtitle = screen.getByText('Subheading');
    expect(subtitle.tagName.toLowerCase()).toBe('h2');

    const overline = screen.getByText('Lead-in');
    expect(overline.tagName.toLowerCase()).toBe('span');
    expect(overline.className).toContain('uppercase');
  });

  it.each([
    ['h1', 'h1'],
    ['h2', 'h2'],
    ['h4', 'h4'],
    ['h5', 'h5'],
    ['h6', 'h6'],
  ] as const)('defaults variant %s to <%s> element', (variant, tag) => {
    render(
      <Typography variant={variant}>
        {variant} text
      </Typography>,
    );

    const element = screen.getByText(`${variant} text`);
    expect(element.tagName.toLowerCase()).toBe(tag);
  });
});
