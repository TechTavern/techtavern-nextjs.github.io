// rehype-autolink-headings (next.config.mjs) wraps every heading in an anchor;
// without this reset, headings render underlined in the link color.
export const proseHeadingAnchorReset =
  '[&_h1_a]:no-underline [&_h2_a]:no-underline [&_h3_a]:no-underline [&_h4_a]:no-underline [&_h5_a]:no-underline [&_h6_a]:no-underline ' +
  '[&_h1_a]:text-inherit [&_h2_a]:text-inherit [&_h3_a]:text-inherit [&_h4_a]:text-inherit [&_h5_a]:text-inherit [&_h6_a]:text-inherit';
