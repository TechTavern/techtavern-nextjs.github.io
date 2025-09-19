import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface BaseButtonProps {
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
  'aria-label'?: string;
}

interface ButtonElementProps extends BaseButtonProps {
  as?: 'button';
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
}

interface LinkElementProps extends BaseButtonProps {
  as: 'link';
  href: string;
  external?: boolean;
}

type ButtonProps = ButtonElementProps | LinkElementProps;

const buttonVariants = {
  base: [
    'inline-flex items-center justify-center',
    'px-6 py-3 text-base font-semibold',
    'rounded-lg shadow-md hover:shadow-lg',
    'transition-all duration-300',
    'touch-target focus-ring',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'disabled:hover:shadow-md'
  ],
  primary: [
    'text-light bg-primary hover:bg-primary-dark',
    'border border-primary hover:border-primary-dark'
  ],
  secondary: [
    'text-primary bg-transparent hover:bg-primary/10',
    'border border-primary hover:border-primary-dark'
  ],
  outline: [
    'text-dark bg-transparent hover:bg-secondary/20',
    'border border-secondary hover:border-dark'
  ]
};

export default function Button(props: ButtonProps) {
  const {
    children,
    disabled = false,
    className,
    'aria-label': ariaLabel
  } = props;

  const baseClasses = cn(
    buttonVariants.base,
    buttonVariants.primary, // Default to primary variant
    className
  );

  if (props.as === 'link') {
    const { href, external = false } = props;

    if (external) {
      return (
        <a
          href={href}
          className={baseClasses}
          aria-label={ariaLabel}
          target="_blank"
          rel="noopener noreferrer"
        >
          {children}
        </a>
      );
    }

    return (
      <Link
        href={href}
        className={baseClasses}
        aria-label={ariaLabel}
      >
        {children}
      </Link>
    );
  }

  const { type = 'button', onClick } = props;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={baseClasses}
      aria-label={ariaLabel}
      aria-disabled={disabled}
    >
      {children}
    </button>
  );
}

