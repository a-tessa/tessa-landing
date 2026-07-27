import Image from "next/image";
import { splitAboutBodyParagraphs } from "@/lib/about-content";
import { cn } from "@/lib/utils";

interface AboutNarrativeProps {
  imageUrl: string;
  imageAlt: string;
  body: string;
  className?: string;
}

export function AboutNarrative({
  imageUrl,
  imageAlt,
  body,
  className,
}: AboutNarrativeProps) {
  const paragraphs = splitAboutBodyParagraphs(body);

  return (
    <div
      className={cn(
        "flex w-full flex-col gap-8 lg:flex-row lg:items-start lg:gap-10",
        className,
      )}
    >
      <div className="relative mx-auto aspect-4/3 w-full max-w-60 shrink-0 overflow-hidden rounded-3xl bg-muted sm:max-w-70 lg:mx-0">
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          sizes="(max-width: 1024px) 280px, 240px"
          className="object-cover"
        />
      </div>
      <div className="min-w-0 w-full flex-1 space-y-4 text-xs leading-relaxed text-muted-foreground sm:text-xs">
        {paragraphs.map((paragraph, index) => (
          <p key={`about-body-${String(index)}`} className="w-full text-pretty">
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
}
