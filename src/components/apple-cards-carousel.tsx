"use client";

import { Carousel, Card } from "@/components/ui/apple-cards-carousel";
import { services } from "@/lib/services";

export default function AppleCardsCarousel() {
  const cards = services.map((service) => (
    <Card
      key={service.slug}
      card={{
        href: `/servicos/${service.slug}`,
        src: service.image,
        title: service.title,
      }}
    />
  ));

  return (
    <div className="w-full h-full">
      <Carousel items={cards} />
    </div>
  );
}
