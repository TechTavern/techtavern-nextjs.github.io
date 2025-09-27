import {
  badgeVariants,
  buttonVariants,
  cardVariants,
  getBadgeClasses,
  getButtonClasses,
  getCardClasses,
  getInputClasses,
  getLabelClasses,
  getTypographyClasses,
  inputVariants,
  labelVariants,
  typographyVariants,
  responsive,
  focusVariants,
  animationVariants,
  stateVariants,
} from './variants';

describe('variants helpers', () => {
  it('builds button classes combining variant, size, and state options', () => {
    const classes = getButtonClasses({
      variant: 'secondary',
      size: 'lg',
      fullWidth: true,
      loading: true,
      disabled: true,
      className: 'custom-class',
    });

    const tokens = classes.split(/\s+/);
    const expected = [
      'inline-flex',
      'bg-transparent',
      'hover:bg-primary/10',
      'px-8',
      'py-4',
      'text-lg',
      'w-full',
      'cursor-wait',
      'disabled:cursor-not-allowed',
      'custom-class',
    ];

    expected.forEach((token) => expect(tokens).toContain(token));
  });

  it('builds default button classes when optional flags are omitted', () => {
    const classes = getButtonClasses({});
    const tokens = classes.split(/\s+/);
    expect(tokens).toContain('text-light');
    expect(tokens).toContain('bg-primary');
    expect(tokens).toContain('w-auto');
    expect(tokens).not.toContain('cursor-wait');
  });

  it.each([
    ['outline', 'hover:bg-secondary/20'],
    ['ghost', 'shadow-none'],
    ['danger', 'bg-danger'],
    ['success', 'bg-success'],
  ] as const)('builds %s button variants with distinct styling', (variant, expectedToken) => {
    const tokens = getButtonClasses({ variant }).split(/\s+/);
    expect(tokens).toContain(expectedToken);
  });

  it('builds card classes with interactive styling', () => {
    const classes = getCardClasses({
      variant: 'glass',
      padding: 'lg',
      rounded: 'xl',
      shadow: 'lg',
      interactive: true,
    });

    const tokens = classes.split(/\s+/);
    const expected = [
      'bg-gradient-to-br',
      'from-white/25',
      'hover:from-white/35',
      'p-6',
      'md:p-8',
      'rounded-2xl',
      'shadow-lg',
      'cursor-pointer',
      'hover:scale-[1.02]',
      'focus:ring-primary/50',
    ];

    expected.forEach((token) => expect(tokens).toContain(token));
  });

  it('builds typography classes that respect overrides', () => {
    const classes = getTypographyClasses({
      variant: 'h2',
      size: 'lg',
      weight: 'bold',
      color: 'accent',
      align: 'center',
      transform: 'uppercase',
      className: 'tracking-wide',
    });

    const tokens = classes.split(/\s+/);
    const expected = [
      'font-heading',
      'text-2xl',
      'lg:text-4xl',
      'text-lg',
      'font-bold',
      'text-accent',
      'text-center',
      'uppercase',
      'tracking-wide',
    ];

    expected.forEach((token) => expect(tokens).toContain(token));
  });

  it('builds input classes with density and disabled state handling', () => {
    const classes = getInputClasses({
      variant: 'outlined',
      size: 'sm',
      fullWidth: false,
      disabled: true,
    });

    const tokens = classes.split(/\s+/);
    const expected = [
      'border-2',
      'border-secondary',
      'px-3',
      'py-2',
      'text-sm',
      'rounded-md',
      'w-auto',
      'disabled:opacity-50',
    ];

    expected.forEach((token) => expect(tokens).toContain(token));
  });

  it('builds label classes with required and error states', () => {
    const classes = getLabelClasses({
      variant: 'floating',
      size: 'sm',
      required: true,
      error: true,
    });

    const tokens = classes.split(/\s+/);
    const expected = [
      'absolute',
      "after:content-['*']",
      'after:text-danger',
      'text-danger',
      'text-sm',
    ];

    expected.forEach((token) => expect(tokens).toContain(token));
  });

  it('builds badge classes with rounded removable pills', () => {
    const classes = getBadgeClasses({
      variant: 'primary',
      size: 'lg',
      rounded: true,
      removable: true,
    });

    const tokens = classes.split(/\s+/);
    const expected = [
      'bg-primary',
      'border-primary',
      'px-4',
      'py-2',
      'text-base',
      'rounded-full',
      'pr-1',
    ];

    expected.forEach((token) => expect(tokens).toContain(token));
  });

  it('builds responsive classchains for breakpoints', () => {
    expect(responsive('block', 'flex', 'grid', 'contents')).toBe('block md:flex lg:grid xl:contents');
  });

  it.each(Object.entries(buttonVariants.variants))('supports button variant %s', (variant, styles) => {
    const classes = getButtonClasses({ variant: variant as Parameters<typeof getButtonClasses>[0]['variant'] });
    expect(classes).toContain((styles as string[])[0]);
  });

  it.each(Object.entries(cardVariants.variants))('supports card variant %s', (variant, styles) => {
    const classes = getCardClasses({ variant: variant as Parameters<typeof getCardClasses>[0]['variant'] });
    expect(classes).toContain((styles as string[])[0]);
  });

  it.each(Object.entries(inputVariants.variants))('supports input variant %s', (variant, styles) => {
    const classes = getInputClasses({ variant: variant as Parameters<typeof getInputClasses>[0]['variant'] });
    expect(classes).toContain((styles as string[])[0]);
  });

  it.each(Object.entries(labelVariants.variants))('supports label variant %s', (variant, styles) => {
    const classes = getLabelClasses({ variant: variant as Parameters<typeof getLabelClasses>[0]['variant'] });
    expect(classes).toContain((styles as string[])[0]);
  });

  it.each(Object.entries(badgeVariants.variants))('supports badge variant %s', (variant, styles) => {
    const classes = getBadgeClasses({ variant: variant as Parameters<typeof getBadgeClasses>[0]['variant'] });
    expect(classes).toContain((styles as string[])[0]);
  });

  it.each(Object.entries(typographyVariants.colors))('supports typography color %s', (color, styles) => {
    const classes = getTypographyClasses({ color: color as Parameters<typeof getTypographyClasses>[0]['color'] });
    expect(classes).toContain((styles as string[])[0]);
  });

  it('exposes focus, animation, and state helpers for reuse', () => {
    expect(focusVariants.ring).toContain('focus:ring-primary/50');
    expect(animationVariants.fadeIn).toContain('fade-in');
    expect(stateVariants.loading).toContain('cursor-wait');
  });
});
