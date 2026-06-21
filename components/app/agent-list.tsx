'use client';

import { trpc } from '@/lib/trpc-client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function AgentList() {
  const { data: agents, isLoading } = trpc.agents.list.useQuery();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass p-6 rounded-lg h-24 animate-pulse" />
        ))}
      </div>
    );
  }

  if (!agents || agents.length === 0) {
    return (
      <div className="text-center py-12 space-y-4">
        <div className="text-6xl">🤖</div>
        <h3 className="text-2xl font-bold">No agents yet</h3>
        <p className="text-text-secondary">Create your first AI agent to get started</p>
        <Link href="/agents/new">
          <Button variant="accent">Create Agent</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {agents.map((agent) => (
        <Link key={agent.id} href={`/dashboard/agents/${agent.id}`}>
          <div className="glass p-6 rounded-lg hover:border-primary/50 transition cursor-pointer">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-primary">{agent.name}</h3>
                <p className="text-sm text-text-secondary">{agent.role}</p>
                {agent.description && (
                  <p className="text-sm text-text-tertiary mt-2">{agent.description}</p>
                )}
              </div>
              <div className="flex flex-col items-end gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    agent.status === 'ACTIVE'
                      ? 'bg-success/20 text-success'
                      : agent.status === 'DRAFT'
                        ? 'bg-warning/20 text-warning'
                        : 'bg-text-tertiary/20 text-text-tertiary'
                  }`}
                >
                  {agent.status}
                </span>
                <span className="text-xs text-text-secondary">{agent.model}</span>
              </div>
            </div>
            {agent.lastRun && (
              <div className="mt-4 text-xs text-text-tertiary">
                Last run: {new Date(agent.lastRun).toLocaleString()}
              </div>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}
