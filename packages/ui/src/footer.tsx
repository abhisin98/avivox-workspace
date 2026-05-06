import type { ReactNode } from "react";

import { cn } from "./utils";

interface FooterProps {
  children?: ReactNode;
  className?: string;
}

export function Footer({ children, className }: FooterProps) {
  return (
    <footer className={cn("border-t border-zinc-200 bg-white py-16 sm:py-20 text-sm text-zinc-600", className)}>
      <div className='mx-auto max-w-7xl px-6 sm:px-8 lg:px-10'>
        <div className='flex flex-col gap-8 md:flex-row md:items-center md:justify-between'>
          <div>
            <p className='font-semibold text-black'>Avivox Workspace</p>
            <p className='mt-1'>Premium monorepo for modern engineering</p>
          </div>
          <p className='max-w-sm'>{children ?? "Built for quality, consistency, and production discipline."}</p>
        </div>
        <div className='mt-8 border-t border-zinc-200 pt-8 text-center text-xs text-zinc-500'>
          <p>© {new Date().getFullYear()} Avivox. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
