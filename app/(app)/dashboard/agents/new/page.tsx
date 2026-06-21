import { AgentForm } from '@/components/app/agent-form';

export default function NewAgentPage() {
  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-4xl font-bold">Create New Agent</h1>
        <p className="text-text-secondary">Configure your new AI agent</p>
      </div>

      <div className="glass p-8 rounded-lg">
        <AgentForm />
      </div>
    </div>
  );
}
