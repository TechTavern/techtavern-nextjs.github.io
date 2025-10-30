import createMDX from "@next/mdx";
import bundleAnalyzer from "@next/bundle-analyzer";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import type { NextConfig } from "next";

const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: "wrap" }]],
  }
});

const withBundleAnalyzer = bundleAnalyzer({ enabled: process.env.ANALYZE === "true" });

const nextConfig: NextConfig = {
  // Only use export mode in production builds
  ...(process.env.NODE_ENV === 'production' && {
    output: 'export',
    trailingSlash: true,
    // Only set base path and asset prefix when explicitly provided and not empty
    ...(process.env.NEXT_PUBLIC_BASE_PATH && 
        process.env.NEXT_PUBLIC_BASE_PATH !== '' && {
      basePath: process.env.NEXT_PUBLIC_BASE_PATH,
      assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH,
    }),
  }),
  
  // Ensure all pages are statically generated
  experimental: {
    workerThreads: false,
    cpus: 1,
  },
  
  images: {
    unoptimized: true,
  },
  
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'mdx'],

  async redirects() {
    return [
      {
        source: "/scott",
        destination: "/consulting/scott-turnbull",
        permanent: true,
      },
    ];
  },

  // Hard-block zod from client bundles to enforce CSP
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve = config.resolve || {};
      config.resolve.alias = {
        ...(config.resolve.alias || {}),
        zod: false,
      };
    }
    return config;
  },
};

export default withBundleAnalyzer(withMDX(nextConfig));
