"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { OperationImageLoading } from "@/lib/operations-image";

export interface OperationsGalleryImageProps {
  src: string;
  alt: string;
  sizes: string;
  loading: OperationImageLoading;
  priority?: boolean;
  className?: string;
  /** Accessible label shown when the image fails to load. */
  errorLabel: string;
}

type GalleryImageStatus = "loading" | "ready" | "error";

/**
 * Stable-aspect gallery image with skeleton, lazy/eager policy, and an
 * accessible error placeholder. Loading feedback is visual only — screen
 * readers rely on a single aggregated gallery status elsewhere.
 */
export function OperationsGalleryImage({
  src,
  alt,
  sizes,
  loading,
  priority = false,
  className,
  errorLabel,
}: OperationsGalleryImageProps) {
  const [status, setStatus] = useState<GalleryImageStatus>("loading");

  return (
    <div className="absolute inset-0" data-gallery-image-root="">
      <div
        aria-hidden={status !== "loading"}
        data-testid="operations-image-skeleton"
        className={cn(
          "absolute inset-0 bg-muted transition-opacity duration-300",
          status === "loading" ? "animate-pulse opacity-100" : "opacity-0",
        )}
      />

      {status === "error" ? (
        <div
          role="img"
          aria-label={errorLabel}
          data-testid="operations-image-error"
          className="absolute inset-0 flex items-center justify-center bg-muted px-4 text-center text-sm text-muted-foreground"
        >
          <span className="line-clamp-3">{alt || errorLabel}</span>
        </div>
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          loading={priority ? undefined : loading}
          priority={priority}
          fetchPriority={priority ? "high" : loading === "eager" ? "low" : undefined}
          decoding="async"
          className={cn(
            "object-cover transition-opacity duration-300",
            status === "ready" ? "opacity-100" : "opacity-0",
            className,
          )}
          onLoad={() => {
            setStatus("ready");
          }}
          onError={() => {
            setStatus("error");
          }}
        />
      )}
    </div>
  );
}
