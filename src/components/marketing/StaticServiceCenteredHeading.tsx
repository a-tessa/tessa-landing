interface StaticServiceCenteredHeadingProps {
  title: string;
  subtitle: string;
  headingId: string;
  headingLevel?: "h2" | "h3";
}

export function StaticServiceCenteredHeading({
  title,
  subtitle,
  headingId,
  headingLevel = "h2",
}: StaticServiceCenteredHeadingProps) {
  const HeadingTag = headingLevel;

  return (
    <div className="mx-auto max-w-3xl text-center">
      <HeadingTag
        id={headingId}
        className="text-2xl font-bold leading-tight text-foreground sm:text-3xl lg:text-4xl"
      >
        {title}
      </HeadingTag>
      <div
        className="mx-auto mt-4 h-1 w-20 rounded-full bg-chart-5"
        aria-hidden
      />
      <p className="mt-5 text-sm leading-relaxed text-muted-foreground sm:text-base">
        {subtitle}
      </p>
    </div>
  );
}
