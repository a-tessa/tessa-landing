"use client";

import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { Play, X } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import type { GalleryMediaItemPublicDto } from "@/lib/api/gallery";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

interface GalleryMediaBrowserProps {
  photos: GalleryMediaItemPublicDto[];
  videos: GalleryMediaItemPublicDto[];
}

type ActiveMedia =
  | { kind: "photo"; item: GalleryMediaItemPublicDto }
  | { kind: "video"; item: GalleryMediaItemPublicDto };

function SectionAnchor({
  id,
  label,
}: {
  id: string;
  label: string;
}) {
  return (
    <a
      href={`#${id}`}
      className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:text-foreground"
    >
      {label}
    </a>
  );
}

function MediaThumb({
  item,
  onOpen,
  playLabel,
}: {
  item: GalleryMediaItemPublicDto;
  onOpen: () => void;
  playLabel: string;
}) {
  const isVideo = item.kind === "video";
  const src = isVideo
    ? item.youtubeVideoId
      ? `https://i.ytimg.com/vi/${item.youtubeVideoId}/hqdefault.jpg`
      : null
    : item.imageUrl;

  if (!src) return null;

  return (
    <button
      type="button"
      onClick={onOpen}
      className="group relative aspect-4/3 overflow-hidden rounded-sm bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      aria-label={item.alt}
    >
      <Image
        src={src}
        alt=""
        fill
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
      />
      {isVideo ? (
        <span className="absolute inset-0 flex items-center justify-center bg-black/25 transition-colors group-hover:bg-black/35">
          <span className="inline-flex size-12 items-center justify-center rounded-full bg-white/90 text-primary shadow-sm">
            <Play className="size-5 fill-current" aria-hidden />
            <span className="sr-only">{playLabel}</span>
          </span>
        </span>
      ) : null}
    </button>
  );
}

export function GalleryMediaBrowser({
  photos,
  videos,
}: GalleryMediaBrowserProps) {
  const t = useTranslations("pages.gallery");
  const [active, setActive] = useState<ActiveMedia | null>(null);

  const showPhotos = photos.length > 0;
  const showVideos = videos.length > 0;
  const isEmpty = !showPhotos && !showVideos;

  const anchors = useMemo(() => {
    const items: Array<{ id: string; label: string }> = [];
    if (showPhotos) items.push({ id: "fotos", label: t("photosHeading") });
    if (showVideos) items.push({ id: "videos", label: t("videosHeading") });
    return items;
  }, [showPhotos, showVideos, t]);

  if (isEmpty) {
    return (
      <p className="py-16 text-center text-sm text-muted-foreground">
        {t("empty")}
      </p>
    );
  }

  return (
    <div className="space-y-12">
      {anchors.length > 1 ? (
        <div className="flex flex-wrap gap-5">
          {anchors.map((anchor) => (
            <SectionAnchor key={anchor.id} id={anchor.id} label={anchor.label} />
          ))}
        </div>
      ) : null}

      {showPhotos ? (
        <section id="fotos" aria-labelledby="gallery-photos-heading" className="scroll-mt-36">
          <h2
            id="gallery-photos-heading"
            className="mb-6 font-barlow text-xl font-semibold uppercase tracking-wide"
          >
            {t("photosHeading")}
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
            {photos.map((item) => (
              <MediaThumb
                key={item.id}
                item={item}
                playLabel={t("playVideo")}
                onOpen={() => setActive({ kind: "photo", item })}
              />
            ))}
          </div>
        </section>
      ) : null}

      {showVideos ? (
        <section id="videos" aria-labelledby="gallery-videos-heading" className="scroll-mt-36">
          <h2
            id="gallery-videos-heading"
            className="mb-6 font-barlow text-xl font-semibold uppercase tracking-wide"
          >
            {t("videosHeading")}
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
            {videos.map((item) => (
              <MediaThumb
                key={item.id}
                item={item}
                playLabel={t("playVideo")}
                onOpen={() => setActive({ kind: "video", item })}
              />
            ))}
          </div>
        </section>
      ) : null}

      <Dialog
        open={active !== null}
        onOpenChange={(open) => {
          if (!open) setActive(null);
        }}
      >
        <DialogContent
          showCloseButton={false}
          className={cn(
            "grid max-w-[calc(100%-1.5rem)] gap-0 overflow-hidden border-0 bg-primary p-0 sm:max-w-3xl",
          )}
        >
          <VisuallyHidden.Root>
            <DialogTitle>{active?.item.alt ?? t("lightboxLabel")}</DialogTitle>
          </VisuallyHidden.Root>

          {active ? (
            <div className="relative bg-primary text-primary-foreground">
              <button
                type="button"
                onClick={() => setActive(null)}
                className="absolute top-3 right-3 z-10 inline-flex size-9 items-center justify-center rounded-full bg-black/40 text-white transition-colors hover:bg-black/55"
                aria-label={t("close")}
              >
                <X className="size-4" />
              </button>

              {active.kind === "photo" && active.item.imageUrl ? (
                <div className="relative aspect-4/3 w-full">
                  <Image
                    src={active.item.imageUrl}
                    alt={active.item.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 48rem"
                    className="object-contain"
                    priority
                  />
                </div>
              ) : null}

              {active.kind === "video" && active.item.youtubeVideoId ? (
                <div className="aspect-video w-full">
                  <iframe
                    title={active.item.alt}
                    src={`https://www.youtube-nocookie.com/embed/${active.item.youtubeVideoId}?autoplay=1&rel=0&modestbranding=1`}
                    className="size-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : null}

              {active.item.caption ? (
                <p className="px-4 py-3 text-sm text-primary-foreground/90 sm:px-5">
                  {active.item.caption}
                </p>
              ) : null}
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
