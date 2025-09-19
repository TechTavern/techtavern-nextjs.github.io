import React from 'react';
import { getBadgeClasses, type BadgeVariantProps } from '@/lib/variants';

interface BadgeProps extends BadgeVariantProps {
  children: React.ReactNode;
  className?: string;
  onRemove?: () => void;
  'aria-label'?: string;
}

export default function Badge({
  children,
  className,
  variant = 'default',
  size = 'md',
  rounded = false,
  removable = false,
  onRemove,
  'aria-label': ariaLabel,
  ...props
}: BadgeProps) {
  const badgeClasses = getBadgeClasses({
    variant,
    size,
    rounded,
    removable,
    className
  });

  return (
    <span className={badgeClasses} aria-label={ariaLabel} {...props}>
      {children}
      {removable && onRemove && (
        <button
          type="button"
          className="ml-1 h-4 w-4 inline-flex items-center justify-center rounded-full hover:bg-black/20 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-current"
          onClick={onRemove}
          aria-label={`Remove ${ariaLabel || 'badge'}`}
        >
          <svg
            className="h-3 w-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </span>
  );
}