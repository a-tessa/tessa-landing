import { insideCardSpacing } from "@/lib/utils";
import { NavbarPage } from "./NavbarPage";

interface HeadingProps {
    title: string;
    description: string;
}

const css = /* css */ `
@keyframes marketing-heading-shell {
  from { min-height: 28rem; border-radius: 1.5rem; background-color: rgb(0 0 0 / 0.3); }
  to   { min-height: 10rem;  border-radius: 0.75rem; background-color: rgb(0 0 0 / 0.5); }
}
@keyframes marketing-heading-title-sm {
  from { font-size: 1.875rem; line-height: 1; opacity: 1; max-height: 5rem; }
  to   { font-size: 1.25rem;  line-height: 1.1; opacity: 0; max-height: 0; }
}
@keyframes marketing-heading-title-lg {
  from { font-size: 4.5rem;  line-height: 1; opacity: 1; max-height: 6rem; }
  to   { font-size: 1.875rem; line-height: 1.1; opacity: 1; max-height: 6rem; }
}
@keyframes marketing-heading-desc {
  from { margin-top: 1rem; max-height: 6rem; opacity: 1; overflow: hidden; }
  to   { margin-top: 0;    max-height: 0;    opacity: 0; overflow: hidden; }
}

@supports (animation-timeline: scroll()) {
  .marketing-heading-scroll {
    animation: marketing-heading-shell linear forwards;
    animation-timeline: scroll(root block);
    animation-range: 0 28vh;
  }
  .marketing-heading-scroll h1 {
    animation: marketing-heading-title-sm linear forwards;
    animation-timeline: scroll(root block);
    animation-range: 0 28vh;
  }
  @media (min-width: 640px) {
    .marketing-heading-scroll h1 {
      animation-name: marketing-heading-title-lg;
    }
  }
  .marketing-heading-scroll p {
    animation: marketing-heading-desc linear forwards;
    animation-timeline: scroll(root block);
    animation-range: 0 28vh;
  }
}

@media (prefers-reduced-motion: reduce) {
  .marketing-heading-scroll,
  .marketing-heading-scroll h1,
  .marketing-heading-scroll p {
    animation-name: none;
    animation-duration: 0s;
  }
}
`;

export function Heading({ title, description }: HeadingProps) {
    return (
        <>
            <style href="marketing-heading" precedence="component">
                {css}
            </style>
            <div className="relative h-110 min-h-110 w-full">
                <div className="marketing-heading-scroll fixed top-6 z-40 flex h-110 min-h-110 w-[calc(100%-2.5rem)] translate-x-1/2 right-1/2 flex-col rounded-3xl bg-[url('/services-heading.webp')] bg-cover bg-center bg-no-repeat bg-black/70 bg-blend-overlay saturate-30 text-white supports-[animation-timeline:scroll()]:h-auto">
                    <div className={`${insideCardSpacing}`}>
                        <NavbarPage />
                    </div>
                    <div className={`${insideCardSpacing} flex flex-1 flex-col justify-center overflow-hidden`}>
                        <h1 className="text-3xl font-bold uppercase leading-none text-foreground sm:text-7xl">
                            {title}
                        </h1>
                        <p className="mt-4 w-full max-w-2xl text-xs font-semibold uppercase sm:text-sm">
                            {description}
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
