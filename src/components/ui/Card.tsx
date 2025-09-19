import React from 'react';
import { getCardClasses, type CardVariantProps } from '@/lib/variants';

interface CardProps extends CardVariantProps {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
  onClick?: () => void;
  'aria-label'?: string;
  tabIndex?: number;
}

export default function Card({
  children,
  className,
  as: Component = 'div',
  variant = 'default',
  padding = 'md',
  rounded = 'md',
  shadow = 'none',
  interactive = false,
  onClick,
  'aria-label': ariaLabel,
  tabIndex,
  ...props
}: CardProps) {
  const cardClasses = getCardClasses({
    variant,
    padding,
    rounded,
    shadow,
    interactive,
    className
  });

  return (
    <Component
      className={cardClasses}
      onClick={onClick}
      aria-label={ariaLabel}
      tabIndex={interactive ? tabIndex || 0 : tabIndex}
      role={interactive ? 'button' : undefined}
      {...props}
    >
      {children}
    </Component>
  );
}

// Compound components for common card patterns
export function CardHeader({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`border-b border-secondary/20 pb-4 mb-4 ${className}`}>
      {children}
    </div>
  );
}

export function CardContent({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}

export function CardFooter({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`border-t border-secondary/20 pt-4 mt-4 ${className}`}>
      {children}
    </div>
  );
}