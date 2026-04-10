"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactElement } from "react";
import Link from "next/link";
import Image, { type ImageProps } from "next/image";
import {
  IconArrowNarrowLeft,
  IconArrowNarrowRight,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface CarouselProps {
  items: ReactElement[];
  initialScroll?: number;
}

type Card = {
  href: string;
  src: string;
  title: string;
};

export const Carousel = ({ items, initialScroll = 0 }: CarouselProps) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollability = useCallback(() => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth);
    }
  }, []);

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.scrollLeft = initialScroll;
      checkScrollability();
    }
  }, [checkScrollability, initialScroll]);

  return (
    <div className="relative w-full">
      <div
        className="flex w-full overflow-x-scroll overscroll-x-auto scroll-smooth [scrollbar-width:none]"
        ref={carouselRef}
        onScroll={checkScrollability}
      >
        <div
          className={cn(
            "absolute right-0 z-1000 h-auto w-[5%] overflow-hidden bg-linear-to-l",
          )}
        />

        <div
          className={cn(
            "flex flex-row justify-start gap-4 pl-4",
            "mx-auto max-w-314 py-10",
          )}
        >
          {items.map((item, index) => (
            <div
              key={"card" + index}
              className={cn(
                "shrink-0 cursor-pointer",
                index === items.length - 1 && "pr-[5%] md:pr-[33%]",
              )}
            >
              <motion.div
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.5,
                    delay: 0.2 * index,
                    ease: "easeOut",
                  },
                }}
                className="origin-center rounded-3xl transition-transform duration-300 hover:scale-105 hover:bg-primary"
              >
                {item}
              </motion.div>
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        className={cn(
          "absolute cursor-pointer z-10 left-5 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 disabled:opacity-50",
          canScrollLeft && "bg-primary text-white",
        )}
        onClick={scrollLeft}
        disabled={!canScrollLeft}
        aria-label="Ver cards anteriores"
      >
        <IconArrowNarrowLeft
          className={cn("h-6 w-6 text-white", !canScrollLeft && "text-gray-500")}
        />
      </button>
      <button
        type="button"
        className={cn(
          "absolute cursor-pointer z-10 right-5 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 disabled:opacity-50",
          canScrollRight && "bg-primary text-white",
        )}
        onClick={scrollRight}
        disabled={!canScrollRight}
        aria-label="Ver próximos cards"
      >
        <IconArrowNarrowRight
          className={cn("h-6 w-6 text-white", !canScrollRight && "text-gray-500")}
        />
      </button>
    </div>
  );
};

export const Card = ({
  card,
  layout = false,
}: {
  card: Card;
  layout?: boolean;
}) => {
  return (
    <Link
      href={card.href}
      aria-label={`Abrir serviço ${card.title}`}
      className="block"
    >
      <motion.article
        layoutId={layout ? `card-${card.title}` : undefined}
        className="group relative z-10 flex h-80 w-56 flex-col items-start justify-start overflow-hidden rounded-3xl bg-gray-100 md:h-160 md:w-100 dark:bg-neutral-900"
      >
        <div className="pointer-events-none absolute inset-0 z-20 bg-primary/75 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="pointer-events-none absolute inset-x-0 top-0 z-30 h-full bg-linear-to-b from-black/50 via-transparent to-transparent" />
        <div className="relative z-40 p-8">
          <motion.p
            layoutId={layout ? `title-${card.title}` : undefined}
            className="mt-2 max-w-xs text-left text-6xl font-semibold text-balance text-white md:text-3xl font-barlow uppercase"
          >
            {card.title}
          </motion.p>
        </div>
        <BlurImage
          src={card.src}
          alt={card.title}
          fill
          className="absolute inset-0 z-10 object-cover"
        />
      </motion.article>
    </Link>
  );
};

export const BlurImage = ({
  height,
  width,
  src,
  className,
  alt,
  ...rest
}: ImageProps) => {
  const [isLoading, setLoading] = useState(true);
  return (
    <Image
      className={cn(
        "h-full w-full transition duration-300",
        isLoading ? "blur-sm" : "blur-0",
        className,
      )}
      onLoad={() => setLoading(false)}
      src={src as string}
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
      blurDataURL={typeof src === "string" ? src : undefined}
      alt={alt ? alt : "Background of a beautiful view"}
      {...rest}
    />
  );
};
