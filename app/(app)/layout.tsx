import { ReactNode } from 'react';
import { UserButton } from '@clerk/nextjs';

export default function AppLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex h-screen flex-col">
      <header className="border-b border-border-default bg-bg-secondary px-6 py-4 flex items-center justify-between">
        <div className="text-xl font-bold text-primary">NEXUS</div>
        <UserButton />
      </header>
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 border-r border-default bg-bg-secondary overflow-y-auto">
          <nav className="p-4 space-y-2">
            <a
              href="/dashboard"
              className="block px-4 py-2 rounded-lg hover:bg-bg-tertiary text-text-secondary hover:text-text-primary transition"
            >
              Dashboard
            </a>
            <a
              href="/dashboard/agents"
              className="block px-4 py-2 rounded-lg hover:bg-bg-tertiary text-text-secondary hover:text-text-primary transition"
            >
              Agents
            </a>
            <a
              href="/dashboard/tasks"
              className="block px-4 py-2 rounded-lg hover:bg-bg-tertiary text-text-secondary hover:text-text-primary transition"
            >
              Tasks
            </a>
            <a
              href="/dashboard/integrations"
              className="block px-4 py-2 rounded-lg hover:bg-bg-tertiary text-text-secondary hover:text-text-primary transition"
            >
              Integrations
            </a>
            <a
              href="/dashboard/billing"
              className="block px-4 py-2 rounded-lg hover:bg-bg-tertiary text-text-secondary hover:text-text-primary transition"
            >
              Billing
            </a>
          </nav>
        </aside>
        <main className="flex-1 overflow-y-auto p-8">{children}</main>
      </div>
    </div>
  );
}
