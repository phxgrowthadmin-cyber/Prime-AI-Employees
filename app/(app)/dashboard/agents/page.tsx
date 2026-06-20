import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function AgentsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">Your Agents</h1>
          <p className="text-text-secondary">Create and manage your AI agents</p>
        </div>
        <Link href="/agents/new">
          <Button variant="default">New Agent</Button>
        </Link>
      </div>

      <div className="glass p-12 rounded-lg text-center py-20">
        <div className="text-6xl mb-4">🤖</div>
        <h2 className="text-2xl font-bold mb-2">No agents yet</h2>
        <p className="text-text-secondary mb-6">Create your first AI agent to get started</p>
        <Link href="/agents/new">
          <Button variant="accent">Create Agent</Button>
        </Link>
      </div>
    </div>
  );
}
