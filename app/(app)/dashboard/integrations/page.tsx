import { Button } from '@/components/ui/button';

export default function IntegrationsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold">Connected Tools</h1>
        <p className="text-text-secondary">Manage your business tool integrations</p>
      </div>

      <div className="glass p-12 rounded-lg text-center py-20">
        <div className="text-6xl mb-4">🔗</div>
        <h2 className="text-2xl font-bold mb-2">No integrations connected</h2>
        <p className="text-text-secondary mb-6">
          Connect your business tools to give agents access to your data
        </p>
        <Button variant="accent">Browse Integrations</Button>
      </div>
    </div>
  );
}
