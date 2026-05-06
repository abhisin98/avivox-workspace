import type { ReactNode } from "react";

import { cn } from "./utils";

interface CardProps {
  title?: string;
  description?: string;
  children?: ReactNode;
  className?: string;
  variant?: "light" | "dark";
}

export function Card({ title, description, children, className, variant = "light" }: CardProps) {
  const baseClasses = "group rounded-xl border transition-all duration-300 p-6 md:p-8";
  const variants = {
    light: "border-zinc-200 bg-white hover:border-zinc-300 hover:shadow-md",
    dark: "border-zinc-700 bg-zinc-950 hover:border-zinc-600 hover:shadow-lg",
  };

  const titleColor = variant === "dark" ? "text-white" : "text-black";
  const descColor = variant === "dark" ? "text-zinc-400" : "text-zinc-600";

  return (
    <div className={cn(baseClasses, variants[variant], className)}>
      {(title || description) && (
        <div className='mb-4'>
          {title && <p className={`text-lg font-semibold ${titleColor}`}>{title}</p>}
          {description && <p className={`mt-2 text-sm leading-6 ${descColor}`}>{description}</p>}
        </div>
      )}
      {children}
    </div>
  );
}
