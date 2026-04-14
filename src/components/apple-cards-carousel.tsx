"use client";

import { Carousel, Card } from "@/components/ui/apple-cards-carousel";
import type { SceneryItem } from "@/lib/api/types";
import { services } from "@/lib/services";

interface AppleCardsCarouselProps {
  scenerySection?: SceneryItem[] | null;
}

export default function AppleCardsCarousel({
  scenerySection,
}: AppleCardsCarouselProps) {
  const items =
    scenerySection && scenerySection.length > 0
      ? scenerySection.map((item) => ({
          slug: item.slug,
          title: item.title,
          image: item.image,
        }))
      : services.map((s) => ({
          slug: s.slug,
          title: s.title,
          image: s.image,
        }));

  const cards = items.map((item) => (
    <Card
      key={item.slug}
      card={{
        href: `/servicos/${item.slug}`,
        src: item.image,
        title: item.title,
      }}
    />
  ));

  return (
    <div className="w-full h-full">
      <Carousel items={cards} />
    </div>
  );
}
