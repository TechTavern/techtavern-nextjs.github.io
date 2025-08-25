import type { MDXComponents } from "mdx/types";
import React from "react";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Example: style <a> tags or code blocks globally for posts
    a: (props) => <a {...props} className="underline" />,
    code: (props) => <code {...props} className="px-1 rounded bg-gray-100" />,
    ...components,
  };
}
