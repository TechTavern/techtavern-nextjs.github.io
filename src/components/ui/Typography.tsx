import React from 'react';
import { getTypographyClasses, type TypographyVariantProps } from '@/lib/variants';

interface TypographyProps extends TypographyVariantProps {
  children: React.ReactNode;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div' | 'blockquote';
}

export default function Typography({
  children,
  className,
  as: Component,
  variant = 'body',
  size,
  weight,
  color = 'dark',
  align = 'left',
  transform = 'none',
  ...props
}: TypographyProps) {
  // Auto-select appropriate HTML element based on variant if not specified
  const defaultElement = (() => {
    switch (variant) {
      case 'h1': return 'h1';
      case 'h2': return 'h2';
      case 'h3': return 'h3';
      case 'h4': return 'h4';
      case 'h5': return 'h5';
      case 'h6': return 'h6';
      case 'subtitle': return 'h2';
      case 'overline': return 'span';
      case 'caption': return 'span';
      default: return 'p';
    }
  })();

  const ElementType = Component || defaultElement;

  const typographyClasses = getTypographyClasses({
    variant,
    size,
    weight,
    color,
    align,
    transform,
    className
  });

  return (
    <ElementType className={typographyClasses} {...props}>
      {children}
    </ElementType>
  );
}

// Convenience components for common patterns
export function Heading1(props: Omit<TypographyProps, 'variant' | 'as'>) {
  return <Typography {...props} variant="h1" as="h1" />;
}

export function Heading2(props: Omit<TypographyProps, 'variant' | 'as'>) {
  return <Typography {...props} variant="h2" as="h2" />;
}

export function Heading3(props: Omit<TypographyProps, 'variant' | 'as'>) {
  return <Typography {...props} variant="h3" as="h3" />;
}

export function Heading4(props: Omit<TypographyProps, 'variant' | 'as'>) {
  return <Typography {...props} variant="h4" as="h4" />;
}

export function Heading5(props: Omit<TypographyProps, 'variant' | 'as'>) {
  return <Typography {...props} variant="h5" as="h5" />;
}

export function Heading6(props: Omit<TypographyProps, 'variant' | 'as'>) {
  return <Typography {...props} variant="h6" as="h6" />;
}

export function BodyText(props: Omit<TypographyProps, 'variant'>) {
  return <Typography {...props} variant="body" />;
}

export function Subtitle(props: Omit<TypographyProps, 'variant'>) {
  return <Typography {...props} variant="subtitle" />;
}

export function Caption(props: Omit<TypographyProps, 'variant'>) {
  return <Typography {...props} variant="caption" />;
}

export function Overline(props: Omit<TypographyProps, 'variant'>) {
  return <Typography {...props} variant="overline" />;
}