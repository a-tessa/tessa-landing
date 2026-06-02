import Image from "next/image";
import { Marquee } from "@/components/ui/marquee";
import { cn, freeSectionShellSpacing } from "@/lib/utils";

export interface StaticServiceClientLogo {
  id: string;
  name: string;
  src: string;
  alt: string;
}

interface StaticServiceClientsMarqueeSectionProps {
  title: string;
  logos: StaticServiceClientLogo[];
  sectionId?: string;
}

export function StaticServiceClientsMarqueeSection({
  title,
  logos,
  sectionId = "static-service-clients",
}: StaticServiceClientsMarqueeSectionProps) {
  if (logos.length === 0) return null;

  return (
    <section
      aria-labelledby={sectionId}
      className="w-full bg-secondary py-9 sm:py-10 lg:py-14"
    >
      <div className={cn(freeSectionShellSpacing, "flex flex-col gap-8 sm:gap-10")}>
        <ul className="sr-only">
          {logos.map((logo) => (
            <li key={logo.id}>{logo.name}</li>
          ))}
        </ul>

        <div className="relative w-full">
          <Marquee
            aria-hidden="true"
            pauseOnHover
            repeat={4}
            className="[--duration:26s] [--gap:1.5rem] py-2 sm:[--gap:2rem] [&_img]:[content-visibility:auto]"
          >
            {logos.map((logo) => (
              <div
                key={logo.id}
                className="flex shrink-0 items-center justify-center px-4 sm:px-6 border border-neutral-200 rounded-md"
              >
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={240}
                  height={160}
                  loading="lazy"
                  className="h-10 w-auto object-contain opacity-80 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0 motion-reduce:transition-none sm:h-12 lg:h-16 xl:h-24"
                  sizes="(max-width: 640px) 96px, 140px"
                />
              </div>
            ))}
          </Marquee>

          <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-linear-to-r from-muted/40 to-transparent sm:w-24" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-linear-to-l from-muted/40 to-transparent sm:w-24" />
        </div>
      </div>
    </section>
  );
}
