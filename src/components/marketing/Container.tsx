import React from "react";
import { cn } from "@/lib/utils";

export function Container({ className, children }: React.PropsWithChildren<{ className?: string }>) {
  return (
    <div className={cn("mx-auto w-full px-4 sm:px-6 lg:px-8", className)}>
      {children}
    </div>
  );
}
