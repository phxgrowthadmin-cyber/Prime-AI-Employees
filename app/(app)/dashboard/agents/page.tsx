import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { AgentList } from '@/components/app/agent-list';

export default function AgentsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">Your Agents</h1>
          <p className="text-text-secondary">Create and manage your AI agents</p>
        </div>
        <Link href="/dashboard/agents/new">
          <Button variant="default">New Agent</Button>
        </Link>
      </div>

      <AgentList />
    </div>
  );
}
