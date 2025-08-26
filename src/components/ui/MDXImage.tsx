"use client";
import Image from "next/image";
import React from "react";

type Props = React.ImgHTMLAttributes<HTMLImageElement> & {
  width?: number;
  height?: number;
};

export default function MDXImage({ src, alt, width, height, className = "", ...rest }: Props) {
  const srcStr = typeof src === "string" ? src : String(src || "");
  const isExternal = /^https?:\/\//i.test(srcStr);
  const canUseNextImage = !isExternal && !!width && !!height && !!srcStr;

  if (canUseNextImage) {
    return (
      <Image
        src={srcStr}
        alt={alt || ""}
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
    <img
      src={srcStr}
      alt={alt || ""}
      className={`rounded-lg shadow-lg my-6 max-w-full h-auto ${className || ""}`}
      loading="lazy"
      {...rest}
    />
  );
}

