import { HeroNavbar } from "./HeroNavbar";

interface HeadingProps {
  title: string;
  description: string;
  backgroundSrc?: string;
}

const DEFAULT_BACKGROUND_SRC = "/services-heading.webp";

const css = /* css */ `
@keyframes marketing-heading-shell {
  from { min-height: 21rem; background-color: rgb(0 0 0 / 0.3); }
  to   { min-height: 11.75rem; background-color: rgb(0 0 0 / 0.5); }
}
@keyframes marketing-heading-shell-sm {
  from { min-height: 6rem; background-color: rgb(0 0 0 / 0.3); }
  to   { min-height: 6rem; background-color: rgb(0 0 0 / 0.5); }
}
@keyframes marketing-heading-title-sm {
  from { font-size: 1.875rem; line-height: 1; opacity: 1; max-height: 5rem; }
  to   { font-size: 1.25rem;  line-height: 1.1; opacity: 1; max-height: 3rem; }
}
@keyframes marketing-heading-title-lg {
  from { font-size: inherit;  line-height: 1; opacity: 1; }
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
    animation-range: 0 20vh;
  }
  .marketing-heading-scroll h1 {
    animation: marketing-heading-title-sm linear forwards;
    animation-timeline: scroll(root block);
    animation-range: 0 20vh;
  }
  @media (min-width: 640px) {
    .marketing-heading-shell {
      animation-name: marketing-heading-shell-sm;
    }
    .marketing-heading-scroll h1 {
      animation-name: marketing-heading-title-lg;
    }
  }
  .marketing-heading-scroll h2 {
    animation: marketing-heading-desc linear forwards;
    animation-timeline: scroll(root block);
    animation-range: 0 28vh;
  }
}

@media (prefers-reduced-motion: reduce) {
  .marketing-heading-scroll,
  .marketing-heading-scroll h1,
  .marketing-heading-scroll h2 {
    animation-name: none;
    animation-duration: 0s;
  }
}
`;

export function Heading({
  title,
  description,
  backgroundSrc = DEFAULT_BACKGROUND_SRC,
}: HeadingProps) {
  return (
    <>
      <style href="marketing-heading" precedence="component">
        {css}
      </style>
      <div className="relative z-20">
        <HeroNavbar
          description={description}
          title={title}
          activeClassName="text-primary text"
          backgroundSrc={backgroundSrc}
        />
        {/* <div className="marketing-heading-scroll fixed top-6 flex w-[calc(100%-2.5rem)] translate-x-1/2 right-1/2 flex-col rounded-3xl bg-[url('/services-heading.webp')] bg-cover bg-center bg-no-repeat bg-black/75 bg-blend-overlay saturate-30 text-white supports-[animation-timeline:scroll()]:h-20">
          <divabsolute inset-x-0 top-0 z-10
            className={`${insideCardSpacing} flex flex-1 flex-col justify-center overflow-hidden text-3xl mb-5 mt-5 sm:text-2xl md:text-3xl lg:text-6xl xl:text-7xl`}
          >
            <h1 className="font-bold uppercase text-white h-fit whitespace-break-spaces mt-8">
              {title}
            </h1>
            <h2 className="mt-4 w-80 lg:w-full max-w-2xl text-xs font-semibold uppercase sm:text-sm">
              {description}
            </h2>
          </div>
        </div> */}
      </div>
    </>
  );
}
