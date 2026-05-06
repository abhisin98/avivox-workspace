import type { ReactNode } from "react";

import { cn } from "./utils";

interface HeadingProps {
  children: ReactNode;
  level?: 1 | 2 | 3 | 4;
  className?: string;
  variant?: "light" | "dark";
}

const lightStyles = {
  1: "text-6xl sm:text-7xl lg:text-8xl font-black tracking-tight text-black",
  2: "text-5xl sm:text-6xl font-black tracking-tight text-black",
  3: "text-3xl sm:text-4xl font-bold tracking-tight text-black",
  4: "text-xl font-bold tracking-tight text-black",
};

const darkStyles = {
  1: "text-6xl sm:text-7xl lg:text-8xl font-black tracking-tight text-white",
  2: "text-5xl sm:text-6xl font-black tracking-tight text-white",
  3: "text-3xl sm:text-4xl font-bold tracking-tight text-white",
  4: "text-xl font-bold tracking-tight text-white",
};

export function Heading({ children, level = 1, className, variant = "light" }: HeadingProps) {
  const Tag = `h${level}` as const;
  const styles = variant === "dark" ? darkStyles : lightStyles;
  return <Tag className={cn(styles[level], className)}>{children}</Tag>;
}
