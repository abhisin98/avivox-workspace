import type { ReactNode } from "react";

import { cn } from "./utils";

interface CodeBlockProps {
  children: ReactNode;
  className?: string;
}

export function CodeBlock({ children, className }: CodeBlockProps) {
  return (
    <pre className={cn("overflow-x-auto rounded-[28px] border border-slate-200 bg-slate-950/95 p-6 text-sm leading-6 text-slate-100", className)}>
      <code>{children}</code>
    </pre>
  );
}
