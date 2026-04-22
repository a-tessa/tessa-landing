"use client";

import { Carousel, Card } from "@/components/ui/apple-cards-carousel";
import type { SceneryItem } from "@/lib/api/types";

interface AppleCardsCarouselProps {
  scenerySection?: SceneryItem[] | null;
}

export default function AppleCardsCarousel({
  scenerySection,
}: AppleCardsCarouselProps) {
  if (!scenerySection || scenerySection.length === 0) {
    return null;
  }

  const cards = scenerySection.map((item) => (
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
