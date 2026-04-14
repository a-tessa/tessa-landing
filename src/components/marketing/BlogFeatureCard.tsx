import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

interface BlogFeatureCardAuthor {
  name: string;
  avatar?: string;
}

interface BlogFeatureCardProps {
  href: string;
  title: string;
  excerpt: string;
  author: BlogFeatureCardAuthor;
  publishedAt: string;
  imageSrc: string;
  imageAlt: string;
  className?: string;
  imageSizes?: string;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function BlogFeatureCard({
  href,
  title,
  excerpt,
  author,
  publishedAt,
  imageSrc,
  imageAlt,
  className,
  imageSizes = "(max-width: 1024px) 100vw, 45vw",
}: BlogFeatureCardProps) {
  const t = useTranslations("blog");
  const authorAvatar = author.avatar ?? imageSrc;
  const formattedDate = formatDate(publishedAt);

  return (
    <Link
      href={href}
      className={cn(
        "group relative flex flex-col justify-center overflow-hidden rounded-2xl p-6 sm:p-8",
        className,
      )}
    >
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        sizes={imageSizes}
        className="object-cover transition-transform duration-500 group-hover:scale-105 mb-auto"
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-black/10" />

      <div className="absolute right-4 top-4 z-10 flex size-9 items-center justify-center rounded-full bg-primary">
        <BlogIcon />
      </div>

      <div className="relative z-10 flex flex-col h-full justify-between">
        <h3 className="font-barlow text-xl font-bold uppercase leading-tight text-white sm:text-3xl line-clamp-2">
          {title}
        </h3>

        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-3 w-full">
            <div className="relative size-12 shrink-0 overflow-hidden rounded-full">
              <Image
                src={authorAvatar}
                alt={author.name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{author.name}</p>
              <time dateTime={publishedAt} className="text-xs text-secondary">
                {t("publishedAt", { date: formattedDate })}
              </time>
            </div>
          </div>
          <p className="line-clamp-3 text-sm leading-relaxed text-white/80 w-full h-16">
            {excerpt}
          </p>
        </div>

        <span className="ml-auto inline-flex w-fit items-center gap-2 rounded-md border border-white/30 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition-colors group-hover:bg-white/20">
          {t("readMore")}
        </span>
      </div>
    </Link>
  );
}

function BlogIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-4 text-white"
      aria-hidden="true"
    >
      <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
      <path d="M18 14h-8M15 18h-5M10 6h8v4h-8V6Z" />
    </svg>
  );
}
