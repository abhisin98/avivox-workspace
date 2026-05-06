import type { ReactNode } from "react";

import { cn } from "./utils";

interface SectionProps {
  id?: string;
  children: ReactNode;
  className?: string;
}

export function Section({ id, children, className }: SectionProps) {
  return (
    <section id={id} className={cn("relative overflow-hidden py-20 sm:py-28 lg:py-32", className)}>
      {children}
    </section>
  );
}
