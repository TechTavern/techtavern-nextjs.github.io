/**
 * Component Variant System using Class Variance Authority (CVA) patterns
 * Tech Tavern Design System - Phase 2 Implementation
 *
 * This file provides a comprehensive variant system for consistent component styling
 * across the Tech Tavern application, following design system principles and
 * accessibility best practices.
 */

import { cn } from '@/lib/utils';

// ===== BUTTON VARIANTS =====

export interface ButtonVariantProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
}

/**
 * Button variant system following CVA patterns
 * Provides consistent button styling with WCAG AA+ compliance
 */
export const buttonVariants = {
  base: [
    // Core layout and interaction
    'inline-flex items-center justify-center',
    'font-semibold text-center',
    'rounded-lg shadow-md hover:shadow-lg',
    'transition-all duration-300 ease-in-out',
    'touch-target focus-ring',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'disabled:hover:shadow-md disabled:hover:transform-none',
    // Loading state
    'relative overflow-hidden',
    // Focus and interaction states
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
  ],
  variants: {
    // Visual variants
    primary: [
      'text-light bg-primary hover:bg-primary-dark',
      'border border-primary hover:border-primary-dark',
      'focus:ring-primary/50',
    ],
    secondary: [
      'text-primary bg-transparent hover:bg-primary/10',
      'border border-primary hover:border-primary-dark',
      'focus:ring-primary/50',
    ],
    outline: [
      'text-dark bg-transparent hover:bg-secondary/20',
      'border border-secondary hover:border-dark',
      'focus:ring-secondary/50',
    ],
    ghost: [
      'text-dark bg-transparent hover:bg-secondary/10',
      'border border-transparent hover:border-secondary/30',
      'shadow-none hover:shadow-sm',
      'focus:ring-secondary/50',
    ],
    danger: [
      'text-light bg-danger hover:bg-danger/90',
      'border border-danger hover:border-danger/90',
      'focus:ring-danger/50',
    ],
    success: [
      'text-light bg-success hover:bg-success/90',
      'border border-success hover:border-success/90',
      'focus:ring-success/50',
    ],
  },
  sizes: {
    sm: ['px-4 py-2 text-sm', 'min-h-[36px]'],
    md: ['px-6 py-3 text-base', 'min-h-[44px]'], // Default WCAG touch target
    lg: ['px-8 py-4 text-lg', 'min-h-[48px]'],
    xl: ['px-10 py-5 text-xl', 'min-h-[52px]'],
  },
  fullWidth: {
    true: ['w-full'],
    false: ['w-auto'],
  },
  loading: {
    true: ['cursor-wait'],
    false: [],
  },
};

export function getButtonClasses({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  className,
}: ButtonVariantProps & { className?: string }) {
  return cn(
    buttonVariants.base,
    buttonVariants.variants[variant],
    buttonVariants.sizes[size],
    fullWidth ? buttonVariants.fullWidth.true : buttonVariants.fullWidth.false,
    loading ? buttonVariants.loading.true : buttonVariants.loading.false,
    disabled && 'disabled:opacity-50 disabled:cursor-not-allowed',
    className
  );
}

// ===== CARD VARIANTS =====

export interface CardVariantProps {
  variant?: 'default' | 'elevated' | 'bordered' | 'glass' | 'feature' | 'service';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  interactive?: boolean;
}

/**
 * Card variant system for consistent content containers
 * Supports various layouts and interaction states
 */
export const cardVariants = {
  base: [
    'relative overflow-hidden',
    'transition-all duration-300 ease-in-out',
  ],
  variants: {
    default: [
      'bg-light border border-secondary/20',
    ],
    elevated: [
      'bg-light shadow-lg hover:shadow-xl',
    ],
    bordered: [
      'bg-light border-2 border-secondary hover:border-primary/30',
    ],
    glass: [
      'bg-gradient-to-br from-white/25 to-white/15',
      'backdrop-blur-sm border border-white/20',
      'hover:from-white/35 hover:to-white/25',
    ],
    feature: [
      'bg-gradient-to-br from-primary/5 to-secondary/5',
      'border border-primary/10 hover:border-primary/20',
    ],
    service: [
      'bg-light border border-secondary/20',
      'hover:border-primary/30 hover:shadow-md',
    ],
  },
  padding: {
    none: ['p-0'],
    sm: ['p-3'],
    md: ['p-4 md:p-6'],
    lg: ['p-6 md:p-8'],
    xl: ['p-8 md:p-12'],
  },
  rounded: {
    none: ['rounded-none'],
    sm: ['rounded-sm'],
    md: ['rounded-lg'],
    lg: ['rounded-xl'],
    xl: ['rounded-2xl'],
    full: ['rounded-full'],
  },
  shadow: {
    none: ['shadow-none'],
    sm: ['shadow-sm'],
    md: ['shadow-md'],
    lg: ['shadow-lg'],
    xl: ['shadow-xl'],
  },
  interactive: {
    true: [
      'cursor-pointer hover:scale-[1.02]',
      'focus:outline-none focus:ring-2 focus:ring-primary/50',
      'active:scale-[0.98]',
    ],
    false: [],
  },
};

export function getCardClasses({
  variant = 'default',
  padding = 'md',
  rounded = 'md',
  shadow = 'none',
  interactive = false,
  className,
}: CardVariantProps & { className?: string }) {
  return cn(
    cardVariants.base,
    cardVariants.variants[variant],
    cardVariants.padding[padding],
    cardVariants.rounded[rounded],
    cardVariants.shadow[shadow],
    interactive ? cardVariants.interactive.true : cardVariants.interactive.false,
    className
  );
}

// ===== TYPOGRAPHY VARIANTS =====

export interface TypographyVariantProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body' | 'caption' | 'overline' | 'subtitle';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  color?: 'primary' | 'secondary' | 'dark' | 'light' | 'muted' | 'accent' | 'danger' | 'success';
  align?: 'left' | 'center' | 'right' | 'justify';
  transform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
}

/**
 * Typography variant system following Tech Tavern brand guidelines
 * Provides consistent text hierarchy and responsive scaling
 */
export const typographyVariants = {
  base: [
    'transition-colors duration-200',
  ],
  variants: {
    h1: [
      'font-heading font-bold',
      'text-3xl md:text-4xl lg:text-5xl',
      'leading-tight tracking-tight',
      'mb-6',
    ],
    h2: [
      'font-heading font-bold',
      'text-2xl md:text-3xl lg:text-4xl',
      'leading-tight tracking-tight',
      'mb-4',
    ],
    h3: [
      'font-heading font-semibold',
      'text-xl md:text-2xl lg:text-3xl',
      'leading-snug',
      'mb-3',
    ],
    h4: [
      'font-heading font-semibold',
      'text-lg md:text-xl lg:text-2xl',
      'leading-snug',
      'mb-2',
    ],
    h5: [
      'font-heading font-semibold',
      'text-base md:text-lg lg:text-xl',
      'leading-normal',
      'mb-2',
    ],
    h6: [
      'font-heading font-semibold',
      'text-sm md:text-base lg:text-lg',
      'leading-normal',
      'mb-2',
    ],
    body: [
      'font-sans font-normal',
      'text-base md:text-lg',
      'leading-relaxed',
    ],
    subtitle: [
      'font-sans font-medium',
      'text-lg md:text-xl',
      'leading-relaxed',
    ],
    caption: [
      'font-sans font-normal',
      'text-sm',
      'leading-normal',
    ],
    overline: [
      'font-sans font-medium',
      'text-xs',
      'leading-normal',
      'uppercase tracking-wide',
    ],
  },
  sizes: {
    xs: ['text-xs'],
    sm: ['text-sm'],
    md: ['text-base'],
    lg: ['text-lg'],
    xl: ['text-xl'],
    '2xl': ['text-2xl'],
    '3xl': ['text-3xl'],
    '4xl': ['text-4xl'],
    '5xl': ['text-5xl'],
  },
  weights: {
    normal: ['font-normal'],
    medium: ['font-medium'],
    semibold: ['font-semibold'],
    bold: ['font-bold'],
  },
  colors: {
    primary: ['text-primary'],
    secondary: ['text-secondary'],
    dark: ['text-dark'],
    light: ['text-light'],
    muted: ['text-dark/70'],
    accent: ['text-accent'],
    danger: ['text-danger'],
    success: ['text-success'],
  },
  align: {
    left: ['text-left'],
    center: ['text-center'],
    right: ['text-right'],
    justify: ['text-justify'],
  },
  transform: {
    none: ['normal-case'],
    uppercase: ['uppercase'],
    lowercase: ['lowercase'],
    capitalize: ['capitalize'],
  },
};

export function getTypographyClasses({
  variant = 'body',
  size,
  weight,
  color = 'dark',
  align = 'left',
  transform = 'none',
  className,
}: TypographyVariantProps & { className?: string }) {
  return cn(
    typographyVariants.base,
    typographyVariants.variants[variant],
    size && typographyVariants.sizes[size],
    weight && typographyVariants.weights[weight],
    typographyVariants.colors[color],
    typographyVariants.align[align],
    typographyVariants.transform[transform],
    className
  );
}

// ===== FORM INPUT VARIANTS =====

export interface InputVariantProps {
  variant?: 'default' | 'filled' | 'outlined' | 'underlined' | 'error' | 'success';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  required?: boolean;
}

/**
 * Form input variant system with accessibility focus
 * Supports various input states and validation feedback
 */
export const inputVariants = {
  base: [
    'transition-all duration-200 ease-in-out',
    'focus:outline-none focus:ring-2 focus:ring-offset-1',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'disabled:bg-secondary/10',
  ],
  variants: {
    default: [
      'bg-light border border-secondary/30',
      'text-dark placeholder-dark/50',
      'hover:border-secondary/50 focus:border-primary',
      'focus:ring-primary/20',
    ],
    filled: [
      'bg-secondary/10 border border-transparent',
      'text-dark placeholder-dark/50',
      'hover:bg-secondary/15 focus:bg-light',
      'focus:border-primary focus:ring-primary/20',
    ],
    outlined: [
      'bg-transparent border-2 border-secondary',
      'text-dark placeholder-dark/50',
      'hover:border-primary/50 focus:border-primary',
      'focus:ring-primary/20',
    ],
    underlined: [
      'bg-transparent border-0 border-b-2 border-secondary',
      'text-dark placeholder-dark/50',
      'rounded-none hover:border-primary/50 focus:border-primary',
      'focus:ring-0 focus:ring-offset-0',
    ],
    error: [
      'bg-light border-2 border-danger',
      'text-dark placeholder-dark/50',
      'focus:border-danger focus:ring-danger/20',
    ],
    success: [
      'bg-light border-2 border-success',
      'text-dark placeholder-dark/50',
      'focus:border-success focus:ring-success/20',
    ],
  },
  sizes: {
    sm: ['px-3 py-2 text-sm rounded-md', 'min-h-[36px]'],
    md: ['px-4 py-3 text-base rounded-lg', 'min-h-[44px]'],
    lg: ['px-5 py-4 text-lg rounded-lg', 'min-h-[52px]'],
  },
  fullWidth: {
    true: ['w-full'],
    false: ['w-auto'],
  },
  required: {
    true: [],
    false: [],
  },
};

export function getInputClasses({
  variant = 'default',
  size = 'md',
  fullWidth = true,
  disabled = false,
  className,
}: Omit<InputVariantProps, 'required'> & { className?: string }) {
  return cn(
    inputVariants.base,
    inputVariants.variants[variant],
    inputVariants.sizes[size],
    fullWidth ? inputVariants.fullWidth.true : inputVariants.fullWidth.false,
    disabled && 'disabled:opacity-50 disabled:cursor-not-allowed',
    className
  );
}

// ===== FORM LABEL VARIANTS =====

export interface LabelVariantProps {
  variant?: 'default' | 'floating' | 'inline' | 'stacked';
  size?: 'sm' | 'md' | 'lg';
  required?: boolean;
  error?: boolean;
}

export const labelVariants = {
  base: [
    'block font-medium transition-colors duration-200',
  ],
  variants: {
    default: [
      'text-dark mb-2',
    ],
    floating: [
      'absolute left-4 transition-all duration-200',
      'pointer-events-none',
    ],
    inline: [
      'inline-flex items-center text-dark',
    ],
    stacked: [
      'text-dark mb-1',
    ],
  },
  sizes: {
    sm: ['text-sm'],
    md: ['text-base'],
    lg: ['text-lg'],
  },
  required: {
    true: ["after:content-['*'] after:text-danger after:ml-1"],
    false: [],
  },
  error: {
    true: ['text-danger'],
    false: [],
  },
};

export function getLabelClasses({
  variant = 'default',
  size = 'md',
  required = false,
  error = false,
  className,
}: LabelVariantProps & { className?: string }) {
  return cn(
    labelVariants.base,
    labelVariants.variants[variant],
    labelVariants.sizes[size],
    required ? labelVariants.required.true : labelVariants.required.false,
    error ? labelVariants.error.true : labelVariants.error.false,
    className
  );
}

// ===== BADGE VARIANTS =====

export interface BadgeVariantProps {
  variant?: 'default' | 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  rounded?: boolean;
  removable?: boolean;
}

export const badgeVariants = {
  base: [
    'inline-flex items-center justify-center',
    'font-medium whitespace-nowrap',
    'transition-all duration-200',
  ],
  variants: {
    default: [
      'bg-secondary/20 text-dark',
      'border border-secondary/30',
    ],
    primary: [
      'bg-primary text-light',
      'border border-primary',
    ],
    secondary: [
      'bg-secondary text-dark',
      'border border-secondary',
    ],
    accent: [
      'bg-accent text-light',
      'border border-accent',
    ],
    success: [
      'bg-success text-light',
      'border border-success',
    ],
    warning: [
      'bg-warning text-dark',
      'border border-warning',
    ],
    danger: [
      'bg-danger text-light',
      'border border-danger',
    ],
    outline: [
      'bg-transparent text-dark',
      'border border-secondary hover:bg-secondary/10',
    ],
  },
  sizes: {
    sm: ['px-2 py-1 text-xs', 'h-5'],
    md: ['px-3 py-1 text-sm', 'h-6'],
    lg: ['px-4 py-2 text-base', 'h-8'],
  },
  rounded: {
    true: ['rounded-full'],
    false: ['rounded-md'],
  },
  removable: {
    true: ['pr-1'],
    false: [],
  },
};

export function getBadgeClasses({
  variant = 'default',
  size = 'md',
  rounded = false,
  removable = false,
  className,
}: BadgeVariantProps & { className?: string }) {
  return cn(
    badgeVariants.base,
    badgeVariants.variants[variant],
    badgeVariants.sizes[size],
    rounded ? badgeVariants.rounded.true : badgeVariants.rounded.false,
    removable ? badgeVariants.removable.true : badgeVariants.removable.false,
    className
  );
}

// ===== UTILITY FUNCTIONS =====

/**
 * Responsive utility for conditional class application
 */
export function responsive(
  mobile: string,
  tablet?: string,
  desktop?: string,
  wide?: string
): string {
  const classes = [mobile];

  if (tablet) classes.push(`md:${tablet}`);
  if (desktop) classes.push(`lg:${desktop}`);
  if (wide) classes.push(`xl:${wide}`);

  return classes.join(' ');
}

/**
 * Focus utilities for accessibility
 */
export const focusVariants = {
  ring: 'focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2',
  visible: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
  within: 'focus-within:ring-2 focus-within:ring-primary/50',
  none: 'focus:outline-none',
};

/**
 * Animation utilities
 */
export const animationVariants = {
  fadeIn: 'animate-in fade-in duration-300',
  slideIn: 'animate-in slide-in-from-bottom-4 duration-300',
  scaleIn: 'animate-in zoom-in-95 duration-200',
  slideOut: 'animate-out slide-out-to-bottom-4 duration-200',
  fadeOut: 'animate-out fade-out duration-200',
};

/**
 * State utilities
 */
export const stateVariants = {
  loading: 'cursor-wait opacity-70',
  disabled: 'opacity-50 cursor-not-allowed pointer-events-none',
  interactive: 'cursor-pointer hover:opacity-80 active:scale-95',
  selected: 'ring-2 ring-primary/50 bg-primary/5',
};