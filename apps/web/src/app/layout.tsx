import "./globals.css";
import { Footer } from "@avivox-workspace/ui/footer";
import { Navbar } from "@avivox-workspace/ui/navbar";

import { navLinks } from "../lib/content";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className='min-h-screen bg-white text-black'>
        <Navbar brand='Avivox Workspace' links={navLinks} ctaGithubLabel='GitHub' ctaGithubHref='https://github.com/abhisin98/avivox-workspace' ctaLabel='Get started' ctaHref='/workflow' />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
