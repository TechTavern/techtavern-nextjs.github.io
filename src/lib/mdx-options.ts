import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import type { Pluggable, PluggableList } from "unified";

// Shared MDX plugin configuration used by next.config.ts and compileMDX
export const remarkPlugins: PluggableList = [remarkGfm];

const autolink: Pluggable = [rehypeAutolinkHeadings, { behavior: "wrap" }];
export const rehypePlugins: PluggableList = [rehypeSlug, autolink];
