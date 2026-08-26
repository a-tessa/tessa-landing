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
