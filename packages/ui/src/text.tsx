import type { ReactNode } from "react";

import { cn } from "./utils";

interface TextProps {
  children: ReactNode;
  className?: string;
  variant?: "light" | "dark";
  size?: "sm" | "md" | "lg";
}

export function Text({ children, className, variant = "light", size = "md" }: TextProps) {
  const lightColor = "text-zinc-700";
  const darkColor = "text-zinc-300";

  const sizes = {
    sm: "text-sm leading-6",
    md: "text-base leading-7",
    lg: "text-lg leading-8",
  };

  return <p className={cn("max-w-4xl", sizes[size], variant === "dark" ? darkColor : lightColor, className)}>{children}</p>;
}
