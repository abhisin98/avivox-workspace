import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from "react";

import { cn } from "./utils";

interface BaseButtonProps {
  children: ReactNode;
  className?: string;
  variant?: "primary" | "ghost" | "secondary";
  href?: string;
  size?: "sm" | "md" | "lg";
}

export type ButtonProps = ({ href: string } & AnchorHTMLAttributes<HTMLAnchorElement> & BaseButtonProps) | ({ href?: undefined } & ButtonHTMLAttributes<HTMLButtonElement> & BaseButtonProps);

export function Button({ children, className, variant = "primary", href, size = "md", ...props }: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-lg border font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";
  const variants = {
    primary: "border-black bg-black text-white hover:bg-zinc-900 hover:border-zinc-900 focus-visible:ring-black",
    ghost: "border-zinc-300 bg-white text-black hover:bg-zinc-50 hover:border-zinc-400 focus-visible:ring-black",
    secondary: "border-zinc-200 bg-zinc-100 text-black hover:bg-zinc-200 hover:border-zinc-300 focus-visible:ring-black",
  };
  const sizes = {
    sm: "px-3.5 py-1.5 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-7 py-3 text-base",
  };

  const classes = cn(base, variants[variant], sizes[size], className);

  if (href) {
    return (
      <a href={href} className={classes} {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {children}
      </a>
    );
  }

  return (
    <button className={classes} type='button' {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}
