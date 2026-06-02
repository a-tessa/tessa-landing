import { Check } from "lucide-react";
import { cn, freeSectionShellSpacing } from "@/lib/utils";

export interface StaticServiceBenefitsChecklistItem {
  id: string;
  label: string;
}

interface StaticServiceBenefitsChecklistSectionProps {
  viabilityTitle: string;
  viabilityDescription: string;
  benefitsTitle: string;
  benefitsDescription: string;
  checklistItems: StaticServiceBenefitsChecklistItem[];
  sectionLabel: string;
  checklistLabel: string;
  sectionId?: string;
  /** When true, viability sits full-width above the benefits/checklist row. */
  stackViability?: boolean;
}

function splitParagraphs(text: string): string[] {
  return text
    .split(/\n\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

export function StaticServiceBenefitsChecklistSection({
  viabilityTitle,
  viabilityDescription,
  benefitsTitle,
  benefitsDescription,
  checklistItems,
  sectionLabel,
  checklistLabel,
  sectionId = "static-service-benefits-checklist",
  stackViability = false,
}: StaticServiceBenefitsChecklistSectionProps) {
  const benefitsParagraphs = splitParagraphs(benefitsDescription);

  const checklist = (
    <ul
      aria-label={checklistLabel}
      className="m-0 flex list-none flex-col gap-8 sm:gap-10 lg:gap-12"
    >
      {checklistItems.map((item) => (
        <li key={item.id} className="flex items-center gap-4">
          <span
            className="flex size-8 shrink-0 items-center justify-center text-secondary sm:size-9"
            aria-hidden
          >
            <Check className="size-7 stroke-3 sm:size-8" />
          </span>
          <span className="text-lg font-normal leading-snug text-foreground sm:text-xl lg:text-2xl">
            {item.label}
          </span>
        </li>
      ))}
    </ul>
  );

  const benefitsBlock = (
    <>
      <h3 className="text-lg font-semibold leading-snug text-foreground sm:text-xl lg:text-2xl">
        {benefitsTitle}
      </h3>
      <div className="mt-3 space-y-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
        {benefitsParagraphs.map((paragraph) => (
          <p key={paragraph.slice(0, 32)}>{paragraph}</p>
        ))}
      </div>
    </>
  );

  return (
    <section
      aria-labelledby={sectionId}
      aria-label={sectionLabel}
      className="w-full bg-white py-12 sm:py-16 lg:py-20"
    >
      <div className={cn(freeSectionShellSpacing, "flex flex-col gap-10")}>
        {stackViability ? (
          <>
            <div className="w-full">
              <h2
                id={sectionId}
                className="text-lg font-semibold leading-snug text-foreground sm:text-xl lg:text-2xl"
              >
                {viabilityTitle}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                {viabilityDescription}
              </p>
            </div>

            <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-12 xl:gap-16">
              <div className="w-full lg:w-1/2">{benefitsBlock}</div>
              <div className="w-full lg:w-1/2 lg:pt-2">{checklist}</div>
            </div>
          </>
        ) : (
          <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-12 xl:gap-16">
            <div className="w-full lg:w-1/2">
              <h2
                id={sectionId}
                className="text-lg font-semibold leading-snug text-foreground sm:text-xl lg:text-2xl"
              >
                {viabilityTitle}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                {viabilityDescription}
              </p>
              <div className="mt-8">{benefitsBlock}</div>
            </div>

            <div className="w-full lg:w-1/2 lg:pt-2">{checklist}</div>
          </div>
        )}
      </div>
    </section>
  );
}
