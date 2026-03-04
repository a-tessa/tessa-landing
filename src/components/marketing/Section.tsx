import React from "react";
import { cn } from "@/lib/utils";
import { Container } from "./Container";

export function Section({ id, className, children }: React.PropsWithChildren<{ id?: string; className?: string }>) {
  return (
    <section id={id} className={cn("py-16 sm:py-20", className)}>
      <Container>{children}</Container>
    </section>
  );
}
