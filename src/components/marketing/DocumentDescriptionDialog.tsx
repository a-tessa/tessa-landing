"use client";

import { IconPlus } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface DocumentDescriptionDialogProps {
  title: string;
  description: string;
  seeMoreLabel: string;
}

export function DocumentDescriptionDialog({
  title,
  description,
  seeMoreLabel,
}: DocumentDescriptionDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon-xs"
          aria-label={seeMoreLabel}
          className="absolute right-1.5 bottom-1.5 size-6 cursor-pointer rounded-md border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground"
        >
          <IconPlus className="size-3.5" aria-hidden />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-barlow uppercase tracking-wide">
            {title}
          </DialogTitle>
          <DialogDescription className="pt-2 text-left text-sm leading-relaxed text-foreground">
            {description}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
