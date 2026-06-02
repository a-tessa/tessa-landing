import Image from "next/image";
import { Fragment } from "react";
import { cn, freeSectionShellSpacing } from "@/lib/utils";

export interface StaticServiceProcessStepItem {
  id: string;
  title: string;
  description: string;
  iconSrc: string;
  iconAlt: string;
  numberSrc: string;
}

interface StaticServiceProcessStepsSectionProps {
  title: string;
  description: string;
  steps: StaticServiceProcessStepItem[];
  arrowIconSrc: string;
  sectionId?: string;
}

export function StaticServiceProcessStepsSection({
  title,
  description,
  steps,
  arrowIconSrc,
  sectionId = "static-service-process-steps",
}: StaticServiceProcessStepsSectionProps) {
  return (
    <section
      aria-labelledby={sectionId}
      className="w-full bg-white py-12 sm:py-16 lg:py-20"
    >
      <div className={cn(freeSectionShellSpacing)}>
        <header className="max-w-3xl">
          <h2
            id={sectionId}
            className="text-xl font-bold leading-tight text-foreground sm:text-2xl xl:text-3xl"
          >
            {title}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
            {description}
          </p>
        </header>

        <div className="mt-10 grid grid-cols-1 gap-10 lg:mt-14 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)] lg:items-stretch lg:gap-x-4 xl:gap-x-8">
          {steps.map((step, index) => (
            <Fragment key={step.id}>
              <article className="flex min-w-0 flex-col items-center text-center">
                <Image
                  src={step.iconSrc}
                  alt={step.iconAlt}
                  width={108}
                  height={108}
                  className="size-24 shrink-0 sm:size-27"
                />

                <div className="mt-5 flex items-center justify-center gap-2">
                  <Image
                    src={step.numberSrc}
                    alt=""
                    width={28}
                    height={43}
                    className="h-9 w-auto shrink-0 sm:h-10"
                  />
                  <h3 className="text-base font-semibold leading-snug text-foreground sm:text-lg">
                    {step.title}
                  </h3>
                </div>

                <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {step.description}
                </p>
              </article>

              {index < steps.length - 1 ? (
                <div
                  aria-hidden
                  className="hidden justify-center items-center lg:flex lg:pt-9 xl:pt-10"
                >
                  <Image
                    src={arrowIconSrc}
                    alt="arrow icon"
                    width={50}
                    height={108}
                    className="h-12 w-auto opacity-70 xl:h-14"
                  />
                </div>
              ) : null}
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
