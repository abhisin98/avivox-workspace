import type { ReactNode } from "react";

import { cn } from "./utils";

interface NavLink {
  label: string;
  href: string;
}

interface NavbarProps {
  brand: string;
  links: NavLink[];
  ctaLabel?: string;
  ctaHref?: string;
  ctaGithubLabel?: string;
  ctaGithubHref?: string;
  children?: ReactNode;
  className?: string;
}

export function Navbar({ brand, links, ctaLabel, ctaHref, ctaGithubLabel, ctaGithubHref, className }: NavbarProps) {
  return (
    <header className={cn("sticky top-0 z-50 border-b border-zinc-200 bg-white/95 backdrop-blur-sm", className)}>
      <div className='mx-auto flex max-w-7xl items-center justify-between gap-8 px-6 py-4 sm:px-8 lg:px-10'>
        <a href='/' className='text-lg font-black text-black tracking-tight'>
          {brand}
        </a>
        <nav className='hidden items-center gap-8 lg:flex'>
          {links.map((link) => (
            <a key={link.href} href={link.href} className='text-sm font-semibold text-zinc-700 transition-colors hover:text-black'>
              {link.label}
            </a>
          ))}
        </nav>
        <div className='flex items-center gap-3'>
          {ctaGithubLabel && ctaGithubHref && (
            <a
              href={ctaGithubHref}
              target='_blank'
              rel='noreferrer'
              className='inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm font-semibold text-black transition-all hover:bg-zinc-100 hover:border-zinc-300'>
              <svg viewBox='0 0 16 16' fill='currentColor' className='h-4 w-4' aria-hidden='true'>
                <path
                  fillRule='evenodd'
                  clipRule='evenodd'
                  d='M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.13 0 0 .67-.21 2.2.82a7.65 7.65 0 012.01-.27c.68 0 1.36.09 2.01.27 1.53-1.04 2.2-.82 2.2-.82.44 1.11.16 1.93.08 2.13.51.56.82 1.28.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.19 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z'
                />
              </svg>
              {ctaGithubLabel}
            </a>
          )}
          {ctaLabel && ctaHref && (
            <a href={ctaHref} className='rounded-lg border border-black bg-black px-5 py-2 text-sm font-semibold text-white transition-all hover:bg-zinc-900'>
              {ctaLabel}
            </a>
          )}
        </div>
      </div>
    </header>
  );
}
