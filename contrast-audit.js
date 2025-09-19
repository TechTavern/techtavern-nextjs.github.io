#!/usr/bin/env node

/**
 * WCAG AA Color Contrast Audit
 * Calculates contrast ratios for all color combinations used in the application
 * WCAG AA requirement: 4.5:1 for normal text, 3:1 for large text
 */

// Color definitions from globals.css
const colors = {
  // Primary Brand Colors
  primary: '#89685d',           // Beaver - warm earth tone
  primaryDark: '#6b5049',       // Darker beaver
  primaryLight: '#a08074',      // Lighter beaver

  // Secondary Colors
  secondary: '#c1c6ce',         // Ghost - subtle gray
  secondaryDark: '#9da2aa',     // Darker ghost
  secondaryLight: '#e1e4ea',    // Lighter ghost

  // Accent Colors
  accent: '#5d8089',            // Info blue-gray
  accentDark: '#4a656c',        // Darker info
  accentLight: '#7a9ba3',       // Lighter info

  // State Colors
  danger: '#954035',            // El Salvador red
  warning: '#958f35',           // Warning yellow-olive
  success: '#35953a',           // Success green
  info: '#5d8089',              // Info blue-gray

  // Neutral Scale
  light: '#f2f7ff',             // Very light blue
  light80: '#c2d1e6',           // Light with 80% effective opacity for contrast compliance
  dark: '#232326',              // Shark dark
  dark80: '#4a4d52',            // Dark with 80% effective opacity for contrast compliance
  nero: '#1f1e1e',              // Nearly black
  sealBrown: '#260101',         // Deep brown
  maroon: '#730202',            // Deep red

  // Blue Scale
  beauBlue: '#c2e0f2',          // Light blue
  beauBlueLight: '#e6f5ff',     // Even lighter blue
  two: '#9bb1bf',               // Mid blue-gray
  three: '#d93829',             // Bright red

  // Common web colors used in components
  white: '#ffffff',
  black: '#000000',
  gray900: '#111827',
  gray800: '#1f2937',
  gray600: '#4b5563',
  blue600: '#2563eb',
  blue200: '#bfdbfe',
};

/**
 * Convert hex color to RGB
 */
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

/**
 * Calculate relative luminance according to WCAG guidelines
 */
function getLuminance(rgb) {
  const { r, g, b } = rgb;

  // Convert to 0-1 scale
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });

  // Calculate luminance
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculate contrast ratio between two colors
 */
function getContrastRatio(color1, color2) {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  if (!rgb1 || !rgb2) return 0;

  const lum1 = getLuminance(rgb1);
  const lum2 = getLuminance(rgb2);

  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if contrast meets WCAG AA standards
 */
function meetsWCAG(ratio, isLargeText = false) {
  const threshold = isLargeText ? 3.0 : 4.5;
  return {
    passes: ratio >= threshold,
    ratio: ratio,
    threshold: threshold,
    grade: ratio >= 7.0 ? 'AAA' : ratio >= threshold ? 'AA' : 'FAIL'
  };
}

// Critical color combinations used in the application
const combinations = [
  // Navigation (critical)
  { name: 'Nav text on transparent (white on dark overlay)', fg: colors.white, bg: colors.black, context: 'Navigation text on dark background overlay (rgba(0,0,0,0.7))' },
  { name: 'Nav text scrolled (gray900 on white)', fg: colors.gray900, bg: colors.white, context: 'Navigation text when scrolled' },
  { name: 'Nav hover blue600 on white', fg: colors.blue600, bg: colors.white, context: 'Navigation hover state' },
  { name: 'Nav hover blue200 on dark', fg: colors.blue200, bg: colors.black, context: 'Navigation hover on dark background' },

  // Hero section (critical)
  { name: 'Hero text (light on dark)', fg: colors.light, bg: colors.black, context: 'Hero text on dark background overlay' },
  { name: 'Hero button: dark on secondary', fg: colors.dark, bg: colors.secondary, context: 'Primary CTA button in hero' },
  { name: 'Hero button: light on transparent border', fg: colors.light, bg: colors.black, context: 'Secondary buttons in hero (border only)' },

  // Footer (critical)
  { name: 'Footer text: light on seal brown', fg: colors.light, bg: colors.sealBrown, context: 'Footer text on gradient start' },
  { name: 'Footer text: light on maroon', fg: colors.light, bg: colors.maroon, context: 'Footer text on gradient end' },
  { name: 'Footer text 80%: light-80 on seal brown', fg: colors.light80, bg: colors.sealBrown, context: 'Footer secondary text (solid color equivalent to 80% opacity)' },

  // Contact section
  { name: 'Contact heading: dark on white', fg: colors.dark, bg: colors.white, context: 'Contact section heading' },
  { name: 'Contact text: dark-80 on white', fg: colors.dark80, bg: colors.white, context: 'Contact section body text (solid color equivalent to 80% opacity)' },
  { name: 'Contact icons: primary on white', fg: colors.primary, bg: colors.white, context: 'Contact section icons' },
  { name: 'Contact link hover: primary-dark on white', fg: colors.primaryDark, bg: colors.white, context: 'Contact email link hover' },

  // Button variants (from Button.tsx)
  { name: 'Primary button: light on primary', fg: colors.light, bg: colors.primary, context: 'Primary button default state' },
  { name: 'Primary button hover: light on primary-dark', fg: colors.light, bg: colors.primaryDark, context: 'Primary button hover state' },
  { name: 'Secondary button: primary on transparent', fg: colors.primary, bg: colors.white, context: 'Secondary button (border only)' },
  { name: 'Outline button: dark on transparent', fg: colors.dark, bg: colors.white, context: 'Outline button (border only)' },

  // Focus states (critical for accessibility)
  { name: 'Focus ring: blue600 on white', fg: colors.blue600, bg: colors.white, context: 'Focus ring on light backgrounds' },
  { name: 'Focus ring light: blue200 on dark', fg: colors.blue200, bg: colors.black, context: 'Focus ring on dark backgrounds' },
];

console.log('🎨 WCAG AA Color Contrast Audit Report');
console.log('=====================================\n');

let totalCombinations = 0;
let passingCombinations = 0;
let failingCombinations = [];

combinations.forEach(({ name, fg, bg, context }) => {
  totalCombinations++;
  const ratio = getContrastRatio(fg, bg);
  const wcagResult = meetsWCAG(ratio);

  const status = wcagResult.passes ? '✅' : '❌';
  const ratioFormatted = ratio.toFixed(2);

  console.log(`${status} ${name}`);
  console.log(`   Context: ${context}`);
  console.log(`   Foreground: ${fg} | Background: ${bg}`);
  console.log(`   Contrast Ratio: ${ratioFormatted}:1 (${wcagResult.grade})`);
  console.log(`   Required: ${wcagResult.threshold}:1 for AA compliance\n`);

  if (wcagResult.passes) {
    passingCombinations++;
  } else {
    failingCombinations.push({
      name,
      context,
      fg,
      bg,
      ratio: parseFloat(ratioFormatted),
      required: wcagResult.threshold
    });
  }
});

// Summary
console.log('📊 Summary');
console.log('===========');
console.log(`Total combinations tested: ${totalCombinations}`);
console.log(`Passing AA standard: ${passingCombinations} (${((passingCombinations/totalCombinations)*100).toFixed(1)}%)`);
console.log(`Failing AA standard: ${failingCombinations.length} (${((failingCombinations.length/totalCombinations)*100).toFixed(1)}%)\n`);

if (failingCombinations.length > 0) {
  console.log('🚨 Combinations requiring fixes:');
  console.log('================================');
  failingCombinations.forEach(({ name, context, fg, bg, ratio, required }) => {
    const shortfall = (required - ratio).toFixed(2);
    console.log(`❌ ${name}`);
    console.log(`   ${context}`);
    console.log(`   Current: ${ratio}:1 | Required: ${required}:1 | Shortfall: ${shortfall}:1`);
    console.log(`   Colors: ${fg} on ${bg}\n`);
  });

  console.log('💡 Recommendations:');
  console.log('===================');
  console.log('1. Darken foreground colors or lighten background colors for failing combinations');
  console.log('2. Consider using higher contrast alternatives from the existing color palette');
  console.log('3. Test changes with actual users, especially those with visual impairments');
  console.log('4. Use browser dev tools or accessibility extensions to verify changes');

  process.exit(1);
} else {
  console.log('🎉 All color combinations meet WCAG AA standards!');
  process.exit(0);
}