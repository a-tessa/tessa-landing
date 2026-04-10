import { BentoCarousel } from "./BentoCarousel";
import { cn, OPERATIONS_SLIDES, sectionCardShellSpacing } from "@/lib/utils";

export function Operations() {
  return (
    <section
      aria-labelledby="operations-title"
      className={cn("mt-14", sectionCardShellSpacing)}
    >
      <BentoCarousel slides={OPERATIONS_SLIDES} />
    </section>
  );
}
