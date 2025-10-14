"use client";
import Image from "next/image";
import React from "react";

export type MDXImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  width?: number;
  height?: number;
};

export default function MDXImage({ src, alt, width, height, className = "", ...rest }: MDXImageProps) {
  const srcStr = typeof src === "string" ? src : String(src || "");
  const isExternal = /^https?:\/\//i.test(srcStr);
  const canUseNextImage = !isExternal && !!width && !!height && !!srcStr;

  // Warn in development if alt is missing for content images
  if (process.env.NODE_ENV === 'development' && !alt) {
    console.warn(`MDXImage: Missing alt text for image: ${srcStr}. Use empty string for decorative images.`);
  }

  const altText = alt ?? "";

  if (canUseNextImage) {
    return (
      <Image
        src={srcStr}
        alt={altText}
        width={Number(width)}
        height={Number(height)}
        className={`rounded-lg shadow-lg my-6 max-w-full h-auto ${className || ""}`}
        loading="lazy"
        {...rest}
      />
    );
  }

  // Fallback to native img when external or dimensions are unknown
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={srcStr}
      alt={altText}
      className={`rounded-lg shadow-lg my-6 max-w-full h-auto ${className || ""}`}
      loading="lazy"
      {...rest}
    />
  );
}
