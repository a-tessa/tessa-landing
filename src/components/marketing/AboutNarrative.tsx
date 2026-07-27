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
        "grid w-full gap-8 lg:grid-cols-2 lg:items-center lg:gap-12",
        className,
      )}
    >
      <div className="relative aspect-4/3 w-full overflow-hidden rounded-3xl bg-muted">
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
        />
      </div>
      <div className="space-y-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
        {paragraphs.map((paragraph, index) => (
          <p key={`about-body-${String(index)}`}>{paragraph}</p>
        ))}
      </div>
    </div>
  );
}
