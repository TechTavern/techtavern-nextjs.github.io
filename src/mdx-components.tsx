import type { MDXComponents } from "mdx/types";
import React from "react";
import Link from "next/link";
import MDXImage from "@/components/ui/MDXImage";
import type { MDXImageProps } from "@/components/ui/MDXImage";

export function getMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Enhanced heading styles with Tech Tavern branding
    h1: (props) => (
      <h1 
        {...props} 
        className="text-3xl md:text-4xl font-heading font-bold text-dark mb-6 mt-8 first:mt-0 pb-2 border-b-2 border-primary/20" 
      />
    ),
    h2: (props) => (
      <h2 
        {...props} 
        className="text-2xl md:text-3xl font-heading font-semibold text-dark mb-4 mt-8 first:mt-0" 
      />
    ),
    h3: (props) => (
      <h3 
        {...props} 
        className="text-xl md:text-2xl font-heading font-semibold text-dark mb-3 mt-6 first:mt-0" 
      />
    ),
    h4: (props) => (
      <h4 
        {...props} 
        className="text-lg md:text-xl font-heading font-semibold text-dark mb-2 mt-4 first:mt-0" 
      />
    ),
    h5: (props) => (
      <h5 
        {...props} 
        className="text-base md:text-lg font-heading font-semibold text-dark mb-2 mt-4 first:mt-0" 
      />
    ),
    h6: (props) => (
      <h6 
        {...props} 
        className="text-sm md:text-base font-heading font-semibold text-dark mb-2 mt-4 first:mt-0" 
      />
    ),

    // Paragraph and text styling
    p: (props) => (
      <p 
        {...props} 
        className="text-dark/80 leading-relaxed mb-4 text-base md:text-lg" 
      />
    ),

    // Enhanced link styling + policy
    a: ({ href, ...props }) => {
      const isExternal = typeof href === 'string' && /^https?:\/\//.test(href);
      const className = "text-primary hover:text-primary-dark font-medium transition-colors duration-300 underline decoration-primary/30 hover:decoration-primary-dark underline-offset-4";
      if (isExternal) {
        return (
          <a
            href={href}
            {...props}
            className={className}
            target="_blank"
            rel="nofollow noopener noreferrer external"
          />
        );
      }
      return (
        <Link href={href || '#'} {...props} className={className} />
      );
    },

    // Code styling
    code: (props) => {
      // Check if it's an inline code block (no className means inline)
      if (!props.className) {
        return (
          <code 
            {...props} 
            className="text-accent bg-secondary/10 px-2 py-0.5 rounded text-sm font-mono border border-secondary/20" 
          />
        );
      }
      // Return as-is for code blocks (handled by pre)
      return <code {...props} />;
    },

    // Code block styling
    pre: (props) => (
      <pre 
        {...props} 
        className="bg-dark text-light rounded-lg p-4 my-6 overflow-x-auto border-l-4 border-primary font-mono text-sm md:text-base shadow-lg" 
      />
    ),

    // Blockquote styling
    blockquote: (props) => (
      <blockquote 
        {...props} 
        className="border-l-4 border-primary bg-primary/5 p-4 my-6 rounded-r-lg italic text-dark/80 text-base md:text-lg" 
      />
    ),

    // List styling
    ul: (props) => (
      <ul 
        {...props} 
        className="list-disc list-inside space-y-2 mb-4 text-dark/80 ml-4" 
      />
    ),
    ol: (props) => (
      <ol 
        {...props} 
        className="list-decimal list-inside space-y-2 mb-4 text-dark/80 ml-4" 
      />
    ),
    li: (props) => (
      <li 
        {...props} 
        className="leading-relaxed" 
      />
    ),

    // Strong/bold text
    strong: (props) => (
      <strong 
        {...props} 
        className="font-semibold text-dark" 
      />
    ),

    // Emphasis/italic text
    em: (props) => (
      <em 
        {...props} 
        className="italic text-dark/90" 
      />
    ),

    // Horizontal rule
    hr: (props) => (
      <hr 
        {...props} 
        className="my-8 border-t-2 border-secondary/30" 
      />
    ),

    // Table styling
    table: (props) => (
      <div className="overflow-x-auto my-6">
        <table 
          {...props} 
          className="min-w-full border-collapse border border-secondary/30 rounded-lg overflow-hidden shadow-sm" 
        />
      </div>
    ),
    thead: (props) => (
      <thead 
        {...props} 
        className="bg-primary/10" 
      />
    ),
    th: (props) => (
      <th 
        {...props} 
        className="border border-secondary/30 px-4 py-3 text-left font-heading font-semibold text-dark" 
      />
    ),
    td: (props) => (
      <td 
        {...props} 
        className="border border-secondary/30 px-4 py-3 text-dark/80" 
      />
    ),

    // Image handling: prefers next/image for local assets with known dimensions
    img: (props) => <MDXImage {...(props as MDXImageProps)} />,
    // Allow explicit usage in MDX: <Image .../>
    Image: (props: MDXImageProps) => <MDXImage {...props} />,

    ...components,
  };
}
