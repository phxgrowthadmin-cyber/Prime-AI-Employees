'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { trpc } from '@/lib/trpc-client';
import { useRouter } from 'next/navigation';
import { AgentModel } from '@prisma/client';

interface AgentFormProps {
  agentId?: string;
  onSuccess?: () => void;
}

const AI_MODELS = [
  { value: 'CLAUDE_OPUS', label: 'Claude Opus' },
  { value: 'CLAUDE_SONNET', label: 'Claude Sonnet' },
  { value: 'GPT_4O', label: 'GPT-4o' },
  { value: 'GEMINI_PRO', label: 'Gemini Pro' },
  { value: 'LLAMA_70B', label: 'Llama 70B' },
  { value: 'MISTRAL_LARGE', label: 'Mistral Large' },
];

export function AgentForm({ agentId, onSuccess }: AgentFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    role: '',
    model: 'CLAUDE_OPUS' as AgentModel,
    systemPrompt: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: agent } = trpc.agents.get.useQuery(
    { id: agentId || '' },
    { enabled: !!agentId }
  );

  const createMutation = trpc.agents.create.useMutation({
    onSuccess: () => {
      setFormData({ name: '', description: '', role: '', model: 'CLAUDE_OPUS', systemPrompt: '' });
      setError(null);
      router.refresh();
      onSuccess?.();
    },
    onError: (error) => {
      setError(error.message || 'Failed to create agent');
    },
  });

  const updateMutation = trpc.agents.update.useMutation({
    onSuccess: () => {
      setError(null);
      router.refresh();
      onSuccess?.();
    },
    onError: (error) => {
      setError(error.message || 'Failed to update agent');
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (agentId && agent) {
        await updateMutation.mutateAsync({
          id: agentId,
          name: formData.name,
          description: formData.description,
          role: formData.role,
          model: formData.model as AgentModel,
          systemPrompt: formData.systemPrompt,
        });
      } else {
        await createMutation.mutateAsync({
          name: formData.name,
          description: formData.description,
          role: formData.role,
          model: formData.model as AgentModel,
          systemPrompt: formData.systemPrompt,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-error/10 border border-error rounded-lg text-error text-sm">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <label className="block text-sm font-medium text-text-primary">Agent Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g., Sales Development Rep"
          required
          className="w-full px-4 py-2 rounded-lg bg-bg-secondary border border-default text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-text-primary">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="What does this agent do?"
          rows={3}
          className="w-full px-4 py-2 rounded-lg bg-bg-secondary border border-default text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-text-primary">Role</label>
        <input
          type="text"
          name="role"
          value={formData.role}
          onChange={handleChange}
          placeholder="e.g., Sales Rep, Content Creator"
          required
          className="w-full px-4 py-2 rounded-lg bg-bg-secondary border border-default text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-text-primary">AI Model</label>
        <select
          name="model"
          value={formData.model}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-lg bg-bg-secondary border border-default text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {AI_MODELS.map((model) => (
            <option key={model.value} value={model.value}>
              {model.label}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-text-primary">System Prompt</label>
        <textarea
          name="systemPrompt"
          value={formData.systemPrompt}
          onChange={handleChange}
          placeholder="Custom instructions for the agent..."
          rows={4}
          className="w-full px-4 py-2 rounded-lg bg-bg-secondary border border-default text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div className="flex gap-4">
        <Button
          type="submit"
          variant="default"
          disabled={isLoading}
          className="flex-1"
        >
          {isLoading ? 'Creating...' : agentId ? 'Update Agent' : 'Create Agent'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
