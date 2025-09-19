import React from 'react';
import Link from 'next/link';
import { getButtonClasses, type ButtonVariantProps } from '@/lib/variants';

interface BaseButtonProps {
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
  'aria-label'?: string;
  variant?: ButtonVariantProps['variant'];
  size?: ButtonVariantProps['size'];
  fullWidth?: ButtonVariantProps['fullWidth'];
  loading?: ButtonVariantProps['loading'];
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

export default function Button(props: ButtonProps) {
  const {
    children,
    disabled = false,
    className,
    'aria-label': ariaLabel,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    loading = false
  } = props;

  const buttonClasses = getButtonClasses({
    variant,
    size,
    fullWidth,
    loading,
    disabled,
    className
  });

  if (props.as === 'link') {
    const { href, external = false } = props;

    if (external) {
      return (
        <a
          href={href}
          className={buttonClasses}
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
        className={buttonClasses}
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
      className={buttonClasses}
      aria-label={ariaLabel}
      aria-disabled={disabled}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-3 h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}

