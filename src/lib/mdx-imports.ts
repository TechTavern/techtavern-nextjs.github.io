// Auto-generated imports for all MDX posts
// This allows Next.js to statically analyze and bundle the MDX files

import HelloWorld from "../../content/posts/2025-08-24-hello-world.mdx";

// Map of filename to MDX component
export const mdxComponents = {
  "2025-08-24-hello-world.mdx": HelloWorld,
};

export function getMDXComponent(filename: string) {
  return mdxComponents[filename as keyof typeof mdxComponents];
}