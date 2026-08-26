import React from "react";
import {
  getYouTubeEmbedUrl,
  getYouTubeThumbnail,
  getYouTubeWatchUrl,
} from "@/lib/youtube";
import { SITE } from "./schemas";

type JsonLdProps = {
  data: Record<string, unknown>;
  id?: string;
};

export function serializeJsonLd(data: Record<string, unknown>): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function JsonLd({ data, id = "jsonld" }: JsonLdProps) {
  return (
    <script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}

export function buildVideoObjectJsonLd(input: {
  name: string;
  description: string;
  videoId: string;
  uploadDate: string | null;
}): Record<string, unknown> | null {
  if (!input.uploadDate) return null;

  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: input.name,
    description: input.description,
    thumbnailUrl: [getYouTubeThumbnail(input.videoId)],
    contentUrl: getYouTubeWatchUrl(input.videoId),
    embedUrl: getYouTubeEmbedUrl(input.videoId),
    uploadDate: input.uploadDate,
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      url: SITE.domain,
    },
  };
}

function absoluteSeoAssetUrl(src: string): string {
  return src.startsWith("http") ? src : `${SITE.domain}${src}`;
}

export interface BlogPostingJsonLdInput {
  headline: string;
  description: string;
  datePublished: string;
  dateModified: string;
  inLanguage: string;
  authorName: string;
  authorImageUrl?: string | null;
  pageUrl: string;
  imageUrl: string;
}

export function buildBlogPostingJsonLd(
  input: BlogPostingJsonLdInput,
): Record<string, unknown> {
  const authorImage = input.authorImageUrl?.trim();

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: input.headline,
    description: input.description,
    datePublished: input.datePublished,
    dateModified: input.dateModified,
    inLanguage: input.inLanguage,
    author: {
      "@type": "Person",
      name: input.authorName,
      ...(authorImage ? { image: absoluteSeoAssetUrl(authorImage) } : {}),
    },
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      url: SITE.domain,
      logo: {
        "@type": "ImageObject",
        url: `${SITE.domain}/tessa-logo.svg`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": input.pageUrl,
    },
    image: absoluteSeoAssetUrl(input.imageUrl),
  };
}
