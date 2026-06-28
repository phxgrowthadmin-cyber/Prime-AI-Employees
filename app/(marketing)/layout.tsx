'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { LuxBackground } from '@/components/marketing/lux-background';

export default function MarketingLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/' && pathname === '/') return true;
    if (href !== '/' && pathname.startsWith(href)) return true;
    return false;
  };

  return (
    <div className="flex flex-col min-h-screen relative">
      <LuxBackground />

      <header className="sticky top-0 z-50 border-b border-border/20 backdrop-blur-lg bg-bg-primary/30">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <div className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent hover:opacity-80 transition cursor-pointer">
              NEXUS
            </div>
          </Link>
          <div className="flex items-center space-x-8">
            <Link
              href="/agents"
              className={`transition-all ${
                isActive('/agents')
                  ? 'text-primary border-b-2 border-primary pb-1'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Agents
            </Link>
            <Link
              href="/pricing"
              className={`transition-all ${
                isActive('/pricing')
                  ? 'text-primary border-b-2 border-primary pb-1'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Pricing
            </Link>
            <Link
              href="/integrations"
              className={`transition-all ${
                isActive('/integrations')
                  ? 'text-primary border-b-2 border-primary pb-1'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Integrations
            </Link>
            <Link href="/sign-in" className="text-text-secondary hover:text-primary transition">
              Sign In
            </Link>
          </div>
        </nav>
      </header>

      <main className="flex-1 relative z-10">{children}</main>

      <footer className="relative z-10 border-t border-border/20 backdrop-blur-lg bg-bg-primary/30 py-12">
        <div className="container mx-auto px-4">
          <div className="text-text-secondary text-sm">
            © 2026 NEXUS AI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
