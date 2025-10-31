import Link from "next/link";
import type { ElementType } from "react";
import { slugify } from "@/lib/utils";

type SectionHeadingProps = {
  level?: 2 | 3 | 4;
  children: string;
  className?: string;
};

const LEVEL_CLASS_MAP: Record<NonNullable<SectionHeadingProps["level"]>, string> = {
  2: "text-3xl md:text-4xl lg:text-5xl leading-tight mb-6",
  3: "text-2xl md:text-3xl leading-snug mt-8 mb-4",
  4: "text-xl md:text-2xl leading-snug mt-6 mb-3",
};

const LEVEL_TAG_MAP: Record<NonNullable<SectionHeadingProps["level"]>, ElementType> = {
  2: "h2",
  3: "h3",
  4: "h4",
};

export default function SectionHeading({ level = 2, children, className = "" }: SectionHeadingProps) {
  const Tag = LEVEL_TAG_MAP[level];
  const id = slugify(children);

  return (
    <Tag
      id={id}
      className={`font-heading font-bold text-dark first:mt-0 ${LEVEL_CLASS_MAP[level]} ${className}`.trim()}
    >
      <Link
        href={`#${id}`}
        className="inline-flex items-center gap-2 no-underline text-inherit transition-colors duration-200 hover:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 rounded"
        aria-label={`${children} section`}
      >
        {children}
      </Link>
    </Tag>
  );
}
