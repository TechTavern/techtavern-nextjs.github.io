# Tech Tavern Brand Guidelines

**Version:** 1.0
**Last Updated:** October 27, 2025
**Maintained by:** Tech Tavern, LLC

---

## Table of Contents

1. [Brand Overview](#brand-overview)
2. [Color Palette](#color-palette)
3. [Typography](#typography)
4. [Spacing and Layout](#spacing-and-layout)
5. [Component Styles](#component-styles)
6. [Visual Elements](#visual-elements)
7. [Content Guidelines](#content-guidelines)
8. [Accessibility Standards](#accessibility-standards)
9. [Technical Implementation](#technical-implementation)

---

## Brand Overview

### Brand Identity

**Tech Tavern** is a veteran-owned technology consulting firm specializing in AI, data security, and strategic IT solutions. The brand conveys professionalism, expertise, and approachability with a focus on mission-driven impact.

**Tagline:** "Innovation on Tap"

**Core Values:**
- Professional yet approachable
- Technical expertise with human-centered design
- Accessibility and inclusivity
- Ethical technology stewardship

### Target Audience

- Technology leaders and decision-makers
- Public sector and nonprofit organizations
- Businesses seeking AI and digital transformation
- Technical professionals interested in AI governance and ethics

---

## Color Palette

### Primary Colors

Tech Tavern uses an earth-toned palette anchored by warm browns and cool blue-grays, evoking both stability and innovation.

| Color Name | Variable | Hex Code | RGB | Usage |
|------------|----------|----------|-----|-------|
| **Primary (Beaver)** | `--color-primary` | `#6b5049` | rgb(107, 80, 73) | Primary brand color, buttons, accents, headings |
| **Primary Dark** | `--color-primary-dark` | `#5a4239` | rgb(90, 66, 57) | Hover states, deeper emphasis |
| **Primary Light** | `--color-primary-light` | `#89685d` | rgb(137, 104, 93) | Subtle backgrounds, lighter accents |

**Usage Guidelines:**
- Primary colors meet WCAG AA compliance (4.5:1 contrast ratio on light backgrounds)
- Use Primary for main call-to-action buttons, navigation emphasis, and brand elements
- Reserve Primary Dark for hover states and interactive elements
- Primary Light works well for subtle backgrounds and section dividers

```css
/* Example: Primary button */
.btn-primary {
  background-color: var(--color-primary);
  color: var(--color-light);
  border: 1px solid var(--color-primary);
}

.btn-primary:hover {
  background-color: var(--color-primary-dark);
}
```

### Secondary Colors

| Color Name | Variable | Hex Code | RGB | Usage |
|------------|----------|----------|-----|-------|
| **Secondary (Ghost)** | `--color-secondary` | `#c1c6ce` | rgb(193, 198, 206) | Secondary buttons, borders, dividers |
| **Secondary Dark** | `--color-secondary-dark` | `#9da2aa` | rgb(157, 162, 170) | Hover states, muted text |
| **Secondary Light** | `--color-secondary-light` | ` ` | rgb(225, 228, 234) | Light backgrounds, subtle highlights |

**Usage Guidelines:**
- Secondary colors provide visual hierarchy without competing with primary
- Use for borders, dividers, and non-critical UI elements
- Secondary Light works well for card backgrounds and alternating sections

### Accent Colors

| Color Name | Variable | Hex Code | RGB | Usage |
|------------|----------|----------|-----|-------|
| **Accent (Info Blue-Gray)** | `--color-accent` | `#4a656c` | rgb(74, 101, 108) | Links, highlights, info states |
| **Accent Dark** | `--color-accent-dark` | `#3e555b` | rgb(62, 85, 91) | Link hover states |
| **Accent Light** | `--color-accent-light` | `#5d8089` | rgb(93, 128, 137) | Subtle accents |

**Usage Guidelines:**
- Accent color meets WCAG AA compliance for link text
- Primary use: hyperlinks in body content
- Secondary use: info badges and informational callouts

```css
/* Example: Link styling */
a {
  color: var(--color-accent);
  text-decoration: underline;
  text-decoration-thickness: 2px;
  text-underline-offset: 2px;
  transition: color 300ms;
}

a:hover {
  color: var(--color-accent-dark);
}
```

### State Colors

| Color Name | Variable | Hex Code | RGB | Usage |
|------------|----------|----------|-----|-------|
| **Danger** | `--color-danger` | `#954035` | rgb(149, 64, 53) | Errors, destructive actions |
| **Warning** | `--color-warning` | `#958f35` | rgb(149, 143, 53) | Warnings, caution states |
| **Success** | `--color-success` | `#35953a` | rgb(53, 149, 58) | Success messages, confirmations |
| **Info** | `--color-info` | `#4a656c` | rgb(74, 101, 108) | Informational messages |

**Usage Guidelines:**
- Use state colors sparingly and purposefully
- Always pair with appropriate icons and clear messaging
- Ensure sufficient contrast for accessibility

### Neutral Colors

| Color Name | Variable | Hex Code | RGB | Usage |
|------------|----------|----------|-----|-------|
| **Light** | `--color-light` | `#f2f7ff` | rgb(242, 247, 255) | Light backgrounds, text on dark |
| **Light 80%** | `--color-light-80` | `#c2d1e6` | rgb(194, 209, 230) | Muted text on dark backgrounds |
| **Dark** | `--color-dark` | `#232326` | rgb(35, 35, 38) | Primary text color, dark UI elements |
| **Dark 80%** | `--color-dark-80` | `#4a4d52` | rgb(74, 77, 82) | Muted text, secondary content |

**Usage Guidelines:**
- Light is the primary background color for main content areas
- Dark is the primary text color (meets WCAG AAA standards on light backgrounds)
- Use 80% variants for reduced emphasis and secondary content

### Gradient Colors

| Color Name | Variable | Hex Code | RGB | Usage |
|------------|----------|----------|-----|-------|
| **Seal Brown** | `--color-seal-brown` | `#260101` | rgb(38, 1, 1) | Gradient start, dark overlays |
| **Maroon** | `--color-maroon` | `#730202` | rgb(115, 2, 2) | Gradient end |
| **Nero** | `--color-nero` | `#1f1e1e` | rgb(31, 30, 30) | Deep backgrounds |

**Usage Guidelines:**
- Primary gradient: Header and footer backgrounds
- Gradient direction: `from-seal-brown to-maroon` (top-left to bottom-right)
- Use with white text for maximum contrast

```css
/* Example: Header gradient */
.header-gradient {
  background: linear-gradient(to bottom right, var(--color-seal-brown), var(--color-maroon));
  color: var(--color-light);
}
```

### Special Effects

| Effect Name | Variable | Value | Usage |
|-------------|----------|-------|-------|
| **Overlay Mask** | `--color-mask` | `rgba(0, 0, 0, 0.5)` | Dark overlay on hero images |
| **Glass Overlay** | `--color-mask-glass` | `rgba(38, 1, 1, 0.2)` | Glassmorphism effects |

### Blue Scale (Supporting)

| Color Name | Variable | Hex Code | RGB | Usage |
|------------|----------|----------|-----|-------|
| **Beau Blue** | `--color-beau-blue` | `#c2e0f2` | rgb(194, 224, 242) | Light accents, soft backgrounds |
| **Beau Blue Light** | `--color-beau-blue-light` | `#e6f5ff` | rgb(230, 245, 255) | Subtle highlights |

### Social Media Colors

| Platform | Variable | Hex Code | Usage |
|----------|----------|----------|-------|
| **LinkedIn** | `--color-linkedin` | `#0072b1` | LinkedIn social links |

---

## Typography

### Font Families

Tech Tavern uses a dual-font system that balances professionalism with readability.

| Purpose | Font Family | Variable | Fallback Stack |
|---------|-------------|----------|----------------|
| **Body Text** | Lato | `--font-sans` | Lato, ui-sans-serif, system-ui, sans-serif |
| **Headings** | Poppins | `--font-heading` | Poppins, ui-sans-serif, system-ui, sans-serif |
| **Code/Monospace** | System Mono | `--font-mono` | ui-monospace, SFMono-Regular, Cascadia Code, Consolas, monospace |

**Font Loading:**
- Both Lato and Poppins are self-hosted for performance
- Use `font-display: swap` for optimal loading experience
- Only essential weights are loaded (400, 600, 700)

### Font Weights

| Weight | Numeric Value | Usage |
|--------|---------------|-------|
| **Normal** | 400 | Body text, paragraphs, general content |
| **Medium** | 500-600 | Subheadings, emphasis, button text |
| **Semibold** | 600 | Card titles, minor headings |
| **Bold** | 700 | Major headings (h1-h3), strong emphasis |

### Heading Hierarchy

#### Desktop Scale

| Element | Font | Size | Weight | Line Height | Margin Bottom | Usage |
|---------|------|------|--------|-------------|---------------|-------|
| **H1** | Poppins | 3xl-5xl (48-60px) | Bold (700) | 1.2 (tight) | 24px | Page titles, hero headlines |
| **H2** | Poppins | 2xl-4xl (36-48px) | Bold (700) | 1.25 (tight) | 16px | Section headings |
| **H3** | Poppins | xl-3xl (24-36px) | Semibold (600) | 1.375 (snug) | 12px | Subsection headings |
| **H4** | Poppins | lg-2xl (20-30px) | Semibold (600) | 1.375 (snug) | 8px | Card titles, minor headings |
| **H5** | Poppins | base-xl (16-24px) | Semibold (600) | 1.5 (normal) | 8px | Small section headings |
| **H6** | Poppins | sm-lg (14-20px) | Semibold (600) | 1.5 (normal) | 8px | Tertiary headings |

**Heading Best Practices:**
- Use exactly one H1 per page for SEO and accessibility
- Maintain logical hierarchy (don't skip levels)
- Add `first:mt-0` utility to remove top margin when heading is first element
- H1 includes bottom border: `border-b-2 border-primary/20`

```tsx
/* Example: H1 in MDX */
<h1 className="text-3xl md:text-4xl font-heading font-bold text-dark mb-6 mt-8 first:mt-0 pb-2 border-b-2 border-primary/20">
  Your Heading Here
</h1>
```

### Body Text

| Element | Font | Size | Weight | Line Height | Usage |
|---------|------|------|--------|-------------|-------|
| **Body** | Lato | 16-18px (base-lg) | Normal (400) | 1.75 (relaxed) | Paragraphs, main content |
| **Subtitle** | Lato | 18-20px (lg-xl) | Medium (500-600) | 1.75 (relaxed) | Lead paragraphs, summaries |
| **Caption** | Lato | 14px (sm) | Normal (400) | 1.5 (normal) | Image captions, footnotes |
| **Overline** | Lato | 12px (xs) | Medium (500-600) | 1.5 (normal) | Labels, categories (uppercase) |

**Body Text Best Practices:**
- Maximum line length: 65-75 characters for optimal readability
- Paragraph margin bottom: 16px (1rem)
- Use `text-dark/80` for body text (provides subtle softness)
- Use `text-dark/70` for muted or secondary text

```css
/* Example: Body paragraph */
p {
  font-family: var(--font-sans);
  font-size: 1rem; /* 16px base, 18px on md+ */
  line-height: 1.75;
  color: rgba(35, 35, 38, 0.8); /* text-dark/80 */
  margin-bottom: 1rem;
}
```

### Responsive Typography Scale

Tech Tavern uses a mobile-first responsive type scale:

| Breakpoint | Base Size | Scale Factor | H1 Range | Body |
|------------|-----------|--------------|----------|------|
| **Mobile** (0-767px) | 16px | 1.2 | 32-36px | 16px |
| **Tablet** (768-1023px) | 16px | 1.25 | 40-48px | 18px |
| **Desktop** (1024px+) | 16px | 1.333 | 48-60px | 18px |

**Implementation:**
```css
/* Mobile-first responsive heading */
h1 {
  font-size: 2rem;        /* 32px mobile */
}

@media (min-width: 768px) {
  h1 {
    font-size: 2.5rem;    /* 40px tablet */
  }
}

@media (min-width: 1024px) {
  h1 {
    font-size: 3rem;      /* 48px desktop */
  }
}
```

### Code Typography

| Element | Font | Size | Background | Border | Usage |
|---------|------|------|------------|--------|-------|
| **Inline Code** | Mono | 14px (sm) | `secondary/10` | `secondary/20` | In-text code snippets |
| **Code Block** | Mono | 14-16px (sm-base) | `dark` | `primary` (left border) | Multi-line code examples |

**Code Styling:**
```tsx
/* Inline code */
<code className="text-accent bg-secondary/10 px-2 py-0.5 rounded text-sm font-mono border border-secondary/20">
  inline code
</code>

/* Code block */
<pre className="bg-dark text-light rounded-lg p-4 my-6 overflow-x-auto border-l-4 border-primary font-mono text-sm md:text-base shadow-lg">
  <code>Code block content</code>
</pre>
```

### Special Text Styles

| Style | Implementation | Usage |
|-------|----------------|-------|
| **Strong/Bold** | `font-semibold text-dark` | Important emphasis |
| **Emphasis/Italic** | `italic text-dark/90` | Subtle emphasis, citations |
| **Link** | `text-accent hover:text-accent-dark underline decoration-2 underline-offset-2` | All hyperlinks |
| **Muted** | `text-dark/70` | Secondary information |

---

## Spacing and Layout

### Spacing Scale

Tech Tavern follows an 8-point grid system based on Tailwind CSS defaults:

| Name | Value | Tailwind Class | Usage |
|------|-------|----------------|-------|
| **Tiny** | 4px | `space-1` or `p-1` | Icon spacing, tight elements |
| **Small** | 8px | `space-2` or `p-2` | Compact layouts |
| **Base** | 16px | `space-4` or `p-4` | Default spacing |
| **Medium** | 24px | `space-6` or `p-6` | Section padding |
| **Large** | 32px | `space-8` or `p-8` | Major sections |
| **XLarge** | 48px | `space-12` or `p-12` | Hero sections, large cards |
| **2XLarge** | 64px | `space-16` or `p-16` | Page sections |

**Custom Spacing:**
- Header offset: `--spacing-header-offset: 4rem` (64px)
- Icon size: `--size-icon: 5rem` (80px)
- Shape divider: `--size-shape-divider: 98px`

### Container Widths

| Breakpoint | Container Max Width | Usage |
|------------|---------------------|-------|
| Mobile | 100% | Full width with padding |
| Tablet (768px+) | 768px | Contained content |
| Desktop (1024px+) | 1024px | Standard layout |
| Wide (1280px+) | 1280px | Maximum content width |

**Implementation:**
```tsx
<div className="container mx-auto px-4">
  {/* Content constrained to max-width with responsive padding */}
</div>
```

### Responsive Breakpoints

Tech Tavern uses Tailwind's default breakpoint system:

| Name | Min Width | Prefix | Usage |
|------|-----------|--------|-------|
| **Mobile** | 0px | (none) | Base/mobile-first styles |
| **Tablet** | 768px | `md:` | Tablet and up |
| **Desktop** | 1024px | `lg:` | Desktop and up |
| **Wide** | 1280px | `xl:` | Large desktop |
| **Ultra-wide** | 1536px | `2xl:` | Extra large screens |

**Best Practices:**
- Always design mobile-first
- Test responsive behavior at breakpoint boundaries
- Use `sm:` (640px) sparingly; focus on md/lg/xl

### Grid System

**Two-Column Layout (Common Pattern):**
```tsx
<div className="grid md:grid-cols-2 gap-8">
  <div>Column 1</div>
  <div>Column 2</div>
</div>
```

**Service Cards (Responsive Grid):**
```tsx
<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Cards */}
</div>
```

### Padding and Margins

**Component Padding:**
- Cards: `p-4 md:p-6` (16-24px responsive)
- Sections: `py-12 md:py-16` (48-64px vertical)
- Hero: `p-8 md:p-12` (32-48px)

**Element Margins:**
- Headings: `mb-4` to `mb-6` (16-24px)
- Paragraphs: `mb-4` (16px)
- Sections: `mt-8` or `my-8` (32px)

---

## Component Styles

### Buttons

Tech Tavern uses a comprehensive button variant system with six visual styles and four size options.

#### Button Variants

**Primary Button** (Default)
- Background: `primary`
- Text: `light`
- Border: `primary`
- Hover: `primary-dark` background
- Use: Main call-to-action, primary actions

```tsx
<Button variant="primary" size="md">
  Get Started
</Button>
```

**Secondary Button**
- Background: `transparent`
- Text: `primary`
- Border: `primary`
- Hover: `primary/10` background
- Use: Secondary actions, alternative options

**Outline Button**
- Background: `transparent`
- Text: `dark`
- Border: `secondary`
- Hover: `secondary/20` background
- Use: Tertiary actions, less emphasis

**Ghost Button**
- Background: `transparent`
- Text: `dark`
- Border: `transparent`
- Hover: `secondary/10` background, visible border
- Use: Minimal emphasis, text-like buttons

**Danger Button**
- Background: `danger`
- Text: `light`
- Border: `danger`
- Use: Destructive actions, delete operations

**Success Button**
- Background: `success`
- Text: `light`
- Border: `success`
- Use: Confirmations, success actions

#### Button Sizes

| Size | Padding | Min Height | Text Size | Usage |
|------|---------|------------|-----------|-------|
| **sm** | 16px 16px | 36px | 14px | Compact UIs, tables |
| **md** | 24px 12px | 44px | 16px | Default size (meets WCAG touch target) |
| **lg** | 32px 16px | 48px | 18px | Hero CTAs, prominent actions |
| **xl** | 40px 20px | 52px | 20px | Extra large CTAs |

#### Button States

- **Default:** Full color, shadow-md
- **Hover:** Darker shade, shadow-lg, subtle scale
- **Focus:** Ring (2px offset), primary/50 color
- **Active:** Slight scale-down effect
- **Disabled:** 50% opacity, no hover effects, `cursor-not-allowed`
- **Loading:** Wait cursor, spinning icon

#### Button Accessibility

- Minimum touch target: 44x44px (WCAG AAA)
- Clear focus indicators (2px ring with offset)
- Disabled state uses `aria-disabled` attribute
- Loading state uses `aria-busy` (if implemented)
- Always provide `aria-label` for icon-only buttons

### Cards

Cards are versatile containers used throughout the site for content grouping.

#### Card Variants

**Default Card**
- Background: `light`
- Border: 1px `secondary/20`
- Shadow: none (can be added)
- Use: Standard content containers

**Elevated Card**
- Background: `light`
- Shadow: `shadow-lg`, hover `shadow-xl`
- Use: Featured content, important items

**Bordered Card**
- Background: `light`
- Border: 2px `secondary`, hover `primary/30`
- Use: Emphasis through borders

**Glass Card**
- Background: Gradient white with transparency
- Backdrop blur: 8px
- Border: 1px `white/20`
- Use: Overlays on images, modern aesthetic

**Feature Card**
- Background: Gradient `primary/5` to `secondary/5`
- Border: 1px `primary/10`
- Use: Highlighting features

**Service Card**
- Background: `light`
- Border: 1px `secondary/20`
- Hover: `primary/30` border, `shadow-md`
- Use: Service offerings

#### Card Compound Components

```tsx
import Card, { CardHeader, CardContent, CardFooter } from '@/components/ui/Card';

<Card variant="elevated" padding="lg" rounded="lg" shadow="md">
  <CardHeader>
    <h3>Card Title</h3>
  </CardHeader>
  <CardContent>
    <p>Card body content</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

#### Interactive Cards

Add `interactive={true}` for clickable cards:
- Cursor changes to pointer
- Slight scale-up on hover (1.02)
- Focus ring appears
- Scale-down on active (0.98)

### Badges

Badges are small status indicators for tags, categories, and states.

#### Badge Variants

| Variant | Background | Text | Border | Usage |
|---------|------------|------|--------|-------|
| **Default** | `secondary/20` | `dark` | `secondary/30` | General tags |
| **Primary** | `primary` | `light` | `primary` | Important labels |
| **Secondary** | `secondary` | `dark` | `secondary` | Alternative labels |
| **Accent** | `accent` | `light` | `accent` | Info tags |
| **Success** | `success` | `light` | `success` | Success states |
| **Warning** | `warning` | `dark` | `warning` | Warning states |
| **Danger** | `danger` | `light` | `danger` | Error states |
| **Outline** | `transparent` | `dark` | `secondary` | Minimal badges |

#### Badge Sizes

- **sm:** `px-2 py-1 text-xs` (height: 20px)
- **md:** `px-3 py-1 text-sm` (height: 24px) - Default
- **lg:** `px-4 py-2 text-base` (height: 32px)

#### Badge Options

- **Rounded:** `rounded="true"` for pill shape
- **Removable:** `removable="true"` adds close button

### Forms

#### Input Fields

**Variant Styles:**
- **Default:** Light background, subtle border, clear focus ring
- **Filled:** Gray background, becomes white on focus
- **Outlined:** Transparent background, bold border
- **Underlined:** Minimal border-bottom only
- **Error:** Red border, red focus ring
- **Success:** Green border, green focus ring

**Input Sizes:**
- **sm:** 36px height, 14px text
- **md:** 44px height, 16px text (default, WCAG compliant)
- **lg:** 52px height, 18px text

**Input States:**
- **Default:** Subtle border `secondary/30`
- **Hover:** Slightly darker border `secondary/50`
- **Focus:** Primary color ring, 2px with 1px offset
- **Disabled:** 50% opacity, gray background
- **Error:** Red border and ring
- **Success:** Green border and ring

#### Labels

**Label Variants:**
- **Default:** Block label above input, 8px margin-bottom
- **Floating:** Positioned inside input, moves up on focus
- **Inline:** Inline with input (checkboxes, radios)
- **Stacked:** Minimal spacing for compact forms

**Required Fields:**
- Add red asterisk after label text
- Use `after:content-['*'] after:text-danger after:ml-1`

### Navigation

**Header Navigation (Home):**
- Transparent background with scroll-triggered solid background
- Smooth color transitions
- Sticky positioning

**Header Navigation (Interior):**
- Solid gradient background: `from-seal-brown to-maroon`
- Light text with hover states
- Contact button with secondary background

**Navigation Links:**
- Default: `text-light/90`
- Hover: `text-light`
- Active: `text-secondary-light` with font-medium
- Focus: Light focus ring (2px)

**Mobile Navigation:**
- Hamburger menu (when implemented)
- Full-screen overlay
- Touch-friendly 44px targets

### Pagination

Pagination follows a standard centered layout with clear page indicators.

**Elements:**
- Previous/Next buttons: Icon buttons with borders
- Page numbers: Numbered buttons
- Current page: Primary background, white text
- Ellipsis: Shown when many pages exist
- Page counter: "Page X of Y" below controls

**Pagination Styling:**
```tsx
/* Active page */
className="border-primary bg-primary text-white shadow"

/* Inactive page */
className="border-dark/20 bg-white text-dark hover:bg-secondary/10"

/* Navigation buttons */
className="touch-target h-12 w-12 border border-dark/20 bg-white"
```

**Accessibility:**
- Keyboard navigation with arrow keys
- `aria-current="page"` on active page
- `aria-label` on navigation buttons
- Minimum 44x44px touch targets

### Tables

Tables use subtle borders and alternating backgrounds for readability.

**Table Structure:**
```tsx
<div className="overflow-x-auto my-6">
  <table className="min-w-full border-collapse border border-secondary/30 rounded-lg overflow-hidden shadow-sm">
    <thead className="bg-primary/10">
      <tr>
        <th className="border border-secondary/30 px-4 py-3 text-left font-heading font-semibold text-dark">
          Header
        </th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td className="border border-secondary/30 px-4 py-3 text-dark/80">
          Data
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

**Table Best Practices:**
- Always wrap in responsive container (`overflow-x-auto`)
- Use semantic HTML (`thead`, `tbody`, `th`, `td`)
- Add `scope` attribute to header cells
- Consider card-based layout on mobile for complex tables

### Lists

**Unordered Lists:**
- Style: Disc bullets
- Spacing: 8px between items
- Indentation: 16px left margin
- Text: `text-dark/80`, relaxed line-height

**Ordered Lists:**
- Style: Decimal numbers
- Same spacing and styling as unordered

**Feature Lists (Custom):**
- Checkmark icon instead of bullets
- Background image: `/assets/img/check.svg`
- 32px left padding, 16px bottom margin

### Blockquotes

Blockquotes have distinctive left border styling:

```tsx
<blockquote className="border-l-4 border-primary bg-primary/5 p-4 my-6 rounded-r-lg italic text-dark/80 text-base md:text-lg">
  Quote content
</blockquote>
```

**Styling:**
- 4px left border in primary color
- Light primary background tint
- Italic text
- Rounded right corners
- 24px vertical margin

### Horizontal Rules

```tsx
<hr className="my-8 border-t-2 border-secondary/30" />
```

- 2px solid border
- Secondary color with 30% opacity
- 32px vertical margin

---

## Visual Elements

### Border Radius

Tech Tavern uses consistent border radius values across components:

| Name | Variable | Value | Usage |
|------|----------|-------|-------|
| **Subtle** | `--radius-subtle` | 6px (0.375rem) | Small elements, inputs |
| **Card** | `--radius-card` | 5% | Large cards (responsive to size) |
| **Icon** | `--radius-icon` | 100% (full) | Circular elements |
| **Small** | N/A | 4px (rounded-sm) | Tight corners |
| **Medium** | N/A | 8px (rounded-lg) | Buttons, cards (default) |
| **Large** | N/A | 12px (rounded-xl) | Large containers |
| **Extra Large** | N/A | 16px (rounded-2xl) | Hero sections |

**Usage:**
```css
/* Button */
.button { border-radius: 0.5rem; /* 8px */ }

/* Card */
.card { border-radius: 0.5rem; /* 8px */ }

/* Badge */
.badge { border-radius: 0.375rem; /* 6px */ }
.badge-pill { border-radius: 9999px; /* full circle */ }
```

### Shadows

Shadows add depth and hierarchy to the interface.

| Level | Class | CSS Value | Usage |
|-------|-------|-----------|-------|
| **None** | `shadow-none` | none | Flat elements |
| **Small** | `shadow-sm` | 0 1px 2px rgba(0,0,0,0.05) | Subtle depth |
| **Medium** | `shadow-md` | 0 4px 6px rgba(0,0,0,0.1) | Buttons, cards |
| **Large** | `shadow-lg` | 0 10px 15px rgba(0,0,0,0.1) | Elevated cards, modals |
| **Extra Large** | `shadow-xl` | 0 20px 25px rgba(0,0,0,0.1) | Prominent elements |
| **2XL** | `shadow-2xl` | 0 25px 50px rgba(0,0,0,0.25) | Floating elements |

**Hover Effects:**
- Buttons: `shadow-md` → `shadow-lg` on hover
- Cards: `shadow-lg` → `shadow-xl` on hover

**Global Shadow Setting:**
- `--shadow-enabled: true` (can disable for flat design)

### Transitions and Animations

**Standard Transitions:**
```css
transition: all 0.3s ease-in-out;
/* Or specific properties: */
transition: colors 300ms;
transition: transform 200ms;
```

**Timing Functions:**
- **Ease-in-out:** Default for most interactions
- **Ease-out:** For entering elements
- **Ease-in:** For exiting elements

**Common Durations:**
- **200ms:** Quick interactions (hover states)
- **300ms:** Standard animations (color changes)
- **500ms:** Slower transitions (layout changes)

**Animation Classes:**
```css
/* Fade in */
.animate-fade-in { animation: fadeIn 300ms ease-out; }

/* Slide in from bottom */
.animate-slide-in { animation: slideIn 300ms ease-out; }

/* Scale in */
.animate-scale-in { animation: scaleIn 200ms ease-out; }
```

**Hover Transforms:**
- Cards: `hover:scale-[1.02]` (2% scale-up)
- Active state: `active:scale-[0.98]` (2% scale-down)
- Smooth transitions with `transition-transform duration-200`

### Icons

**Icon System:**
- Primary: Lucide React icons (`lucide-react` package)
- Size: 20px (w-5 h-5) for inline, 24px (w-6 h-6) for standalone
- Color: Inherits from parent text color

**Usage Examples:**
```tsx
import { StepBack, StepForward, Check, X } from 'lucide-react';

<StepBack className="h-5 w-5" aria-hidden="true" />
```

**Icon Best Practices:**
- Always include `aria-hidden="true"` if decorative
- Provide text alternative if icon has meaning
- Maintain 1:1 aspect ratio
- Use consistent sizing within contexts

### Images

**Featured Images:**
- Aspect ratio: 16:9 (1200x675px standard)
- Format: WebP for modern browsers
- Alt text: Always provide descriptive alt text
- Loading: Lazy loading for below-fold images

**Hero Background:**
- Responsive images at breakpoints:
  - Mobile: 375w
  - Tablet: 768w
  - Desktop: 1200w
  - Wide: 1920w
- Format: WebP
- Preloaded via `<link rel="preload">` in head

**Logo and Brand Assets:**
- Logo: SVG format preferred
- Square logo: 512x512px (android-chrome-512x512.png)
- Favicon: Multiple sizes (16x16, 32x32)
- Apple touch icon: 180x180px

### Custom Clip Paths

**Side Notch:**
```css
.side-notch {
  clip-path: polygon(20% 0%, 100% 0, 100% 80%, 80% 100%, 0 100%, 0 19%);
}
```

Used for geometric design elements and modern card shapes.

### Backdrop Filters

**Glassmorphism Effect:**
```css
.glass {
  backdrop-filter: var(--backdrop-blur-glass); /* blur(8px) */
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}
```

Used in hero overlays and modern UI effects.

---

## Content Guidelines

### Voice and Tone

Tech Tavern's content voice balances professional expertise with approachable clarity.

**Core Principles:**
1. **Conversational yet Professional** - Write in first person where appropriate, maintain polished grammar
2. **Technically Accurate but Accessible** - Explain complex concepts with analogies and examples
3. **Human-Centered** - Focus on practical impact, not just technical features
4. **Authority with Humility** - Demonstrate expertise without arrogance

**Writing Rules (from Writing Style Guide):**
- Never use em dashes (use alternatives)
- Write in conversational, first-person tone with professional polish
- Keep paragraphs short (2-5 sentences)
- Use headings and subheadings to structure content
- Favor plain English; avoid jargon unless explained
- Use light humor only if it clarifies or humanizes
- Demonstrate authority with examples, analogies, or explanations
- Prefer narrative over lists (unless explicitly needed)
- Avoid stiff transitions; use natural ones ("So," "Still though")
- End with professional close inviting engagement

**Tone Examples:**

✅ **Good (Tech Tavern Voice):**
> "In the 1980s, people spoke of Cray supercomputers in hushed tones. These were the machines of miracles—vast, expensive, and unimaginably powerful. Yet today, the phone in your pocket quietly exceeds their capability by orders of magnitude."

❌ **Bad (Too Corporate):**
> "Tech Tavern leverages cutting-edge AI solutions to synergize with your digital transformation initiatives, providing best-in-class outcomes that maximize ROI."

✅ **Good (Explanatory):**
> "AI doesn't 'think' in words; it thinks in patterns. DeepSeek's approach treats vision as a more compact, structured form of those patterns—one that an AI can decode back into language when needed."

❌ **Bad (Too Technical Without Context):**
> "The model utilizes visual token compression via latent space optimization to achieve 10x reduction in computational overhead during inference."

### Article Structure

**Typical Article Flow:**
1. **Opening Hook** (1-2 paragraphs) - Compelling analogy or timely observation
2. **Context Setting** (2-3 paragraphs) - Background and relevance
3. **Main Sections** (3-5 H2 sections) - Core content with clear headings
4. **Practical Implications** - "What this means for..." section
5. **Closing** (1-2 paragraphs) - Thoughtful conclusion with invitation to engage

**Article Length:**
- Short posts: 600-1000 words
- Standard articles: 1000-1500 words
- Long-form pieces: 1500-2500 words

### Heading Guidelines

**H1 (Page Title):**
- One per page
- Descriptive and engaging
- 50-70 characters for SEO
- Examples: "The AI Efficiency Revolution Has Begun"

**H2 (Section Headings):**
- Clear topic indicators
- Parallel structure when possible
- Examples: "The Discovery: Compressing Context Through Vision", "The Implication: Lower Power and Longer Memory"

**H3 (Subsections):**
- Support H2 sections
- More specific than H2
- Can be questions or statements

### Link Policy

**Internal Links:**
- Use Next.js `<Link>` component
- Relative paths (`/articles`, `/#Contact`)
- No `target="_blank"` or `rel` attributes

**External Links:**
- Always open in new tab: `target="_blank"`
- Include security attributes: `rel="nofollow noopener noreferrer external"`
- Underline with 2px thickness
- Visible hover state (darker accent color)

```tsx
/* External link example */
<a
  href="https://example.com"
  target="_blank"
  rel="nofollow noopener noreferrer external"
  className="text-accent hover:text-accent-dark underline decoration-2 underline-offset-2"
>
  External Resource
</a>
```

### MDX Content Styling

All MDX content automatically receives styled components via `src/mdx-components.tsx`:

**Paragraph Styling:**
- Text: `text-dark/80` (slightly muted for readability)
- Size: `text-base md:text-lg` (16-18px responsive)
- Line height: `leading-relaxed` (1.625)
- Margin: `mb-4` (16px)

**List Styling:**
- List style position: inside
- Item spacing: 8px vertical
- Nested indentation: 16px

**Code Blocks:**
- Inline code: Light background, accent text, border
- Code blocks: Dark background, light text, primary left border, shadow

**Emphasis:**
- Bold: `font-semibold text-dark`
- Italic: `italic text-dark/90`

### Image Guidelines

**Featured Images:**
- Required for all articles
- Dimensions: 1200x675px (16:9 ratio)
- Format: WebP
- File naming: `slug_1200x675.webp`
- Location: `/public/images/`

**In-Article Images:**
- Use `<Image>` component from Next.js
- Always provide `alt` text
- Specify width and height for optimization
- Consider responsive sizes

**Alt Text Standards:**
- Descriptive and concise
- Describe content and context
- Don't start with "Image of..."
- For decorative images, use empty alt (`alt=""`)

### Metadata Requirements

**Required Frontmatter:**
```yaml
---
title: Article Title Here
date: '2025-10-23'
slug: article-slug-here
featuredImage: /images/filename.webp
ogTitle: Open Graph Title (can match title)
ogDescription: Summary for social media sharing
ogImage: /images/filename.webp
canonicalUrl: 'https://techtavern.com/articles/2025/10/23/article-slug-here/'
draft: false
tags:
  - Tag One
  - Tag Two
excerpt: Brief summary of the article for listings and previews
---
```

**SEO Best Practices:**
- Title: 50-70 characters, includes primary keyword
- OG Description: 120-160 characters, compelling summary
- Tags: 2-5 relevant tags, use existing tags when possible
- Excerpt: 150-200 characters, engaging summary
- Canonical URL: Full absolute URL to article

---

## Accessibility Standards

Tech Tavern is committed to WCAG 2.1 Level AA compliance minimum, with AAA goals where practical.

### Color Contrast

**Text Contrast Requirements:**
- Body text (18px+): Minimum 4.5:1 ratio (AA)
- Large text (24px+): Minimum 3:1 ratio (AA)
- Primary color on light: 4.5:1 ✓ (AA compliant)
- Dark on light: 14.1:1 ✓ (AAA compliant)

**Interactive Elements:**
- Buttons: 4.5:1 minimum contrast
- Links: Distinct from surrounding text (color + underline)
- Focus indicators: 3:1 contrast against background

**Testing:**
- Use WebAIM Contrast Checker
- Test with browser DevTools accessibility panel
- Verify in high contrast mode

### Focus Indicators

**Standard Focus Ring:**
```css
.focus-ring:focus {
  outline: none;
  border-radius: 0.375rem;
  box-shadow: 0 0 0 2px var(--focus-ring-color); /* #2563eb */
}
```

**Light Focus Ring (Dark Backgrounds):**
```css
.focus-ring-light:focus {
  box-shadow: 0 0 0 2px var(--focus-ring-color-light); /* #93c5fd */
}
```

**Focus Requirements:**
- Minimum 2px ring thickness
- 2px offset from element
- High contrast color (blue-600 or blue-300)
- Never remove focus indicators
- Visible on all interactive elements

### Touch Targets

**Minimum Sizes (WCAG 2.5.5):**
- Standard: 44x44px (Level AA)
- Preferred: 48x48px or larger
- Applies to: Buttons, links, form controls, interactive icons

**Implementation:**
```css
.touch-target {
  min-height: 44px;
  min-width: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1rem;
}
```

**Spacing:**
- Minimum 8px spacing between touch targets
- Prefer 16px spacing for comfortable tapping

### Semantic HTML

**Required Structure:**
- One `<h1>` per page
- Logical heading hierarchy (don't skip levels)
- Semantic landmarks: `<header>`, `<nav>`, `<main>`, `<footer>`, `<aside>`
- Lists use `<ul>`, `<ol>`, `<li>` (not div-based)
- Tables use proper structure: `<table>`, `<thead>`, `<tbody>`, `<th>`, `<td>`

**ARIA Labels:**
- Navigation: `aria-label="Main navigation"`
- Sections: `aria-labelledby` referencing heading ID
- Buttons: `aria-label` when text isn't sufficient
- Links: `aria-label` for icon-only links

### Keyboard Navigation

**Requirements:**
- All interactive elements keyboard accessible
- Logical tab order (follows visual flow)
- Skip links for keyboard users
- Keyboard shortcuts don't conflict with screen readers
- Escape key closes modals/menus

**Skip Link:**
```tsx
<a href="#main-content" className="skip-link">
  Skip to main content
</a>
```

Skip link is visually hidden but appears on focus at top of page.

### Screen Reader Support

**Best Practices:**
- Use `aria-hidden="true"` for decorative icons
- Provide text alternatives for all meaningful images
- Use `aria-live` for dynamic content updates
- Label form inputs with `<label>` elements
- Use `aria-describedby` for additional context
- Mark up button states: `aria-pressed`, `aria-expanded`

**Screen Reader Only Text:**
```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

### Motion and Animation

**Reduced Motion:**
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Best Practices:**
- Respect `prefers-reduced-motion` setting
- Avoid autoplay videos with sound
- Provide pause controls for animations
- Don't use animation as only indicator of state change

### Form Accessibility

**Input Requirements:**
- Every input has associated `<label>`
- Use `aria-required="true"` or `required` attribute
- Error messages linked with `aria-describedby`
- Error states use color + icon (not color alone)
- Placeholder is not a substitute for label

**Error Handling:**
```tsx
<input
  type="email"
  id="email"
  aria-required="true"
  aria-invalid={hasError}
  aria-describedby={hasError ? "email-error" : undefined}
/>
{hasError && (
  <span id="email-error" className="text-danger text-sm">
    Please enter a valid email address
  </span>
)}
```

### Testing Checklist

- [ ] Keyboard navigation works throughout site
- [ ] Focus indicators visible on all interactive elements
- [ ] Color contrast meets WCAG AA standards
- [ ] Images have descriptive alt text
- [ ] Headings follow logical hierarchy
- [ ] Forms have proper labels and error handling
- [ ] Touch targets meet 44x44px minimum
- [ ] Screen reader announces content correctly
- [ ] Skip link functions properly
- [ ] Reduced motion preference respected
- [ ] Automated tests pass (axe, Lighthouse)

---

## Technical Implementation

### Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS v4
- **Content:** MDX with frontmatter
- **Components:** React 18+
- **Icons:** Lucide React
- **Deployment:** GitHub Pages (static export)

### File Organization

```
src/
├── app/                    # Next.js app router pages
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── articles/          # Blog pages
│   └── globals.css        # Global styles and theme
├── components/
│   ├── ui/                # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Typography.tsx
│   │   └── ...
│   └── sections/          # Page sections
│       ├── Hero.tsx
│       ├── Services.tsx
│       └── ...
├── lib/
│   ├── variants.ts        # Component variant system
│   ├── utils.ts           # Utility functions
│   └── site.ts            # Site constants
└── mdx-components.tsx     # MDX component overrides

content/
└── articles/              # MDX blog posts
    └── YYYY-MM-DD-slug.mdx

public/
├── images/                # Images and featured images
├── assets/               # Icons, logos, illustrations
└── fonts/                # Self-hosted fonts
```

### CSS Custom Properties

All theme values are defined as CSS custom properties in `globals.css`:

```css
@theme {
  /* Colors */
  --color-primary: #6b5049;
  --color-secondary: #c1c6ce;
  --color-accent: #4a656c;

  /* Typography */
  --font-sans: 'Lato', ui-sans-serif, system-ui, sans-serif;
  --font-heading: 'Poppins', ui-sans-serif, system-ui, sans-serif;

  /* Spacing */
  --spacing-header-offset: 4rem;

  /* Border Radius */
  --radius-card: 5%;
  --radius-subtle: 0.375rem;

  /* Effects */
  --backdrop-blur-glass: blur(8px);
}
```

**Accessing in Code:**
```tsx
/* Tailwind classes (preferred) */
<div className="bg-primary text-light rounded-lg" />

/* Direct CSS variables (when needed) */
<div style={{ color: 'var(--color-primary)' }} />
```

### Component Variant System

Tech Tavern uses a CVA-inspired variant system in `src/lib/variants.ts`:

```typescript
import { cn } from '@/lib/utils';

// Define variant types
export interface ButtonVariantProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

// Define variant classes
export const buttonVariants = {
  base: ['inline-flex', 'items-center', 'rounded-lg'],
  variants: {
    primary: ['bg-primary', 'text-light'],
    secondary: ['bg-secondary', 'text-dark'],
  },
  sizes: {
    sm: ['px-4', 'py-2', 'text-sm'],
    md: ['px-6', 'py-3', 'text-base'],
  },
};

// Helper function
export function getButtonClasses({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className,
}: ButtonVariantProps & { className?: string }) {
  return cn(
    buttonVariants.base,
    buttonVariants.variants[variant],
    buttonVariants.sizes[size],
    fullWidth && 'w-full',
    className
  );
}
```

**Usage:**
```tsx
import { getButtonClasses } from '@/lib/variants';

const classes = getButtonClasses({
  variant: 'primary',
  size: 'lg',
  className: 'mt-4'
});
```

### Utility Function (cn)

The `cn` utility combines class names using `clsx` and `tailwind-merge`:

```typescript
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

**Benefits:**
- Handles conditional classes
- Merges Tailwind classes intelligently
- Removes conflicts (e.g., `bg-red-500 bg-blue-500` → `bg-blue-500`)

### TypeScript Standards

**Strict Mode Enabled:**
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

**Never Use `any`:**
```typescript
// ❌ Bad
function process(data: any) { }

// ✓ Good
function process(data: unknown) {
  if (typeof data === 'string') {
    // Type narrowing
  }
}

// ✓ Better with specific types
interface ProcessData {
  id: string;
  value: number;
}
function process(data: ProcessData) { }
```

**Component Props:**
```typescript
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  className?: string;
  'aria-label'?: string;
}

export default function Button({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  className,
  'aria-label': ariaLabel,
}: ButtonProps) {
  // Implementation
}
```

### Responsive Design Implementation

**Mobile-First Approach:**
```tsx
{/* Base styles apply to mobile, then override at breakpoints */}
<div className="text-base md:text-lg lg:text-xl">
  {/* 16px mobile, 18px tablet, 20px desktop */}
</div>

{/* Grid example */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* 1 column mobile, 2 tablet, 3 desktop */}
</div>
```

**Container Pattern:**
```tsx
<div className="container mx-auto px-4 py-8 md:py-12 lg:py-16">
  {/* Responsive container with padding */}
</div>
```

### Performance Optimization

**Image Optimization:**
```tsx
import Image from 'next/image';

<Image
  src="/images/featured.webp"
  alt="Descriptive alt text"
  width={1200}
  height={675}
  quality={85}
  loading="lazy"
  placeholder="blur"
  blurDataURL="..." // Low quality placeholder
/>
```

**Font Loading:**
- Self-hosted fonts for better performance
- `font-display: swap` to prevent FOIT
- Only essential weights loaded (400, 600, 700)
- Preload primary font in `<head>`

**CSS Optimization:**
- Tailwind CSS purges unused styles in production
- Critical CSS inlined (if needed)
- CSS custom properties for theme values

### Browser Support

- **Modern Browsers:** Chrome, Firefox, Safari, Edge (last 2 versions)
- **Mobile:** iOS Safari 12+, Chrome Android
- **Features:** ES2020, CSS Grid, CSS Custom Properties, WebP images
- **Graceful Degradation:** Fallbacks for older browsers where critical

### Build and Deployment

**Build Commands:**
```bash
# Development
npm run dev

# Production build
npm run build

# Type checking
npm run typecheck

# Linting
npm run lint
```

**Static Export:**
```javascript
// next.config.js
export default {
  output: 'export',
  images: { unoptimized: true },
  // ...
};
```

**Deployment:**
- Static files output to `/out` directory
- Deploy to GitHub Pages or any static host
- No server-side rendering (SSR disabled)

---

## Appendix: Quick Reference

### Color Variables Quick List

```css
/* Primary */
--color-primary: #6b5049
--color-primary-dark: #5a4239
--color-primary-light: #89685d

/* Secondary */
--color-secondary: #c1c6ce
--color-secondary-dark: #9da2aa
--color-secondary-light: #e1e4ea

/* Accent */
--color-accent: #4a656c
--color-accent-dark: #3e555b
--color-accent-light: #5d8089

/* States */
--color-danger: #954035
--color-warning: #958f35
--color-success: #35953a
--color-info: #4a656c

/* Neutrals */
--color-light: #f2f7ff
--color-dark: #232326

/* Gradients */
--color-seal-brown: #260101
--color-maroon: #730202
```

### Common Tailwind Class Patterns

```tsx
/* Buttons */
className="px-6 py-3 rounded-lg bg-primary text-light hover:bg-primary-dark transition-colors duration-300 shadow-md hover:shadow-lg focus-ring"

/* Cards */
className="bg-light border border-secondary/20 rounded-lg p-4 md:p-6 shadow-lg hover:shadow-xl transition-shadow"

/* Headings */
className="text-2xl md:text-3xl font-heading font-bold text-dark mb-4"

/* Body Text */
className="text-base md:text-lg text-dark/80 leading-relaxed mb-4"

/* Links */
className="text-accent hover:text-accent-dark underline decoration-2 underline-offset-2 transition-colors"

/* Containers */
className="container mx-auto px-4 py-8 md:py-12"

/* Grid */
className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
```

### Accessibility Checklist

- [ ] Color contrast ≥ 4.5:1 for text
- [ ] Touch targets ≥ 44x44px
- [ ] Focus indicators visible (2px ring)
- [ ] Keyboard navigation works
- [ ] Semantic HTML structure
- [ ] Alt text on all images
- [ ] ARIA labels where needed
- [ ] Form labels properly associated
- [ ] Heading hierarchy logical
- [ ] Skip link present

---

## Version History

### Version 1.0 - October 27, 2025
- Initial comprehensive brand guidelines
- Complete color palette documentation
- Typography system specifications
- Component variant documentation
- Accessibility standards
- Technical implementation guide

---

## Contact

For questions about brand guidelines or usage:
- **Email:** info@tech-tavern.com
- **Website:** https://techtavern.com

**Maintained by Tech Tavern, LLC**
Veteran-owned | Innovation on Tap