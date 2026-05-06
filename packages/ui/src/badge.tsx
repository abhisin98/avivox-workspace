import type { ReactNode } from "react";

import { cn } from "./utils";

interface BadgeProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "dark" | "light";
}

export function Badge({ children, className, variant = "default" }: BadgeProps) {
  const variants = {
    default: "inline-flex rounded-full border border-zinc-300 bg-zinc-50 px-3 py-1 text-xs font-semibold text-zinc-700",
    dark: "inline-flex rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-xs font-semibold text-zinc-100",
    light: "inline-flex rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-semibold text-zinc-600",
  };
  return <span className={cn(variants[variant], className)}>{children}</span>;
}
