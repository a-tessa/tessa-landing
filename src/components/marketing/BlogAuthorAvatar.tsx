import Image from "next/image";
import { cn } from "@/lib/utils";

interface BlogAuthorAvatarProps {
  name: string;
  initials: string;
  avatarUrl?: string | null;
  className?: string;
  imageClassName?: string;
}

export function BlogAuthorAvatar({
  name,
  initials,
  avatarUrl,
  className,
  imageClassName,
}: BlogAuthorAvatarProps) {
  if (avatarUrl) {
    return (
      <div
        className={cn(
          "relative shrink-0 overflow-hidden rounded-full",
          className,
        )}
      >
        <Image
          src={avatarUrl}
          alt={`Foto de ${name}`}
          fill
          className={cn("object-cover", imageClassName)}
        />
      </div>
    );
  }

  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary",
        className,
      )}
      aria-hidden
    >
      {initials}
    </span>
  );
}
