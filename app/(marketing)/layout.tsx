import { ReactNode } from 'react';

export default function MarketingLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b border-border-default sticky top-0 z-40 glass">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-primary">NEXUS</div>
          <div className="space-x-4">
            <a href="/agents" className="text-text-secondary hover:text-text-primary transition">
              Agents
            </a>
            <a href="/pricing" className="text-text-secondary hover:text-text-primary transition">
              Pricing
            </a>
            <a href="/integrations" className="text-text-secondary hover:text-text-primary transition">
              Integrations
            </a>
          </div>
        </nav>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-border-default bg-bg-secondary py-12">
        <div className="container mx-auto px-4">
          <div className="text-text-secondary text-sm">
            © 2026 NEXUS AI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
