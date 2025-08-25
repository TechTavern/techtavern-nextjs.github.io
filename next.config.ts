import createMDX from "@next/mdx";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

const withMDX = createMDX({
  options: {
    // If you installed these remark/rehype plugins:
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: "wrap" }],
    ],
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export" as const,  // produce /out for GitHub Pages
  trailingSlash: true,        // friendlier with static hosting
  images: { unoptimized: true },
  pageExtensions: ["ts", "tsx", "mdx"],

  // For project pages like https://username.github.io/my-repo
  // set NEXT_PUBLIC_BASE_PATH=/my-repo in the build environment
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH || "",

  experimental: {
    mdxRs: true,              // Next’s Rust MDX compiler path
  },
};

export default withMDX(nextConfig);
