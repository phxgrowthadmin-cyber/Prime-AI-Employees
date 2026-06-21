'use client';

import { Button } from '@/components/ui/button';
import { trpc } from '@/lib/trpc-client';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function IntegrationsContent() {
  const searchParams = useSearchParams();
  const success = searchParams.get('success');
  const error = searchParams.get('error');

  const { data: integrations } = trpc.integrations.list.useQuery();
  const disconnectMutation = trpc.integrations.disconnect.useMutation();

  const providers = [
    { id: 'google', name: 'Google Workspace', icon: '📧', description: 'Gmail, Calendar, Drive' },
    { id: 'slack', name: 'Slack', icon: '💬', description: 'Send messages and notifications' },
    { id: 'salesforce', name: 'Salesforce', icon: '☁️', description: 'CRM integration' },
    { id: 'hubspot', name: 'HubSpot', icon: '🎯', description: 'Sales and marketing' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold">Connected Tools</h1>
        <p className="text-text-secondary">Manage your business tool integrations</p>
      </div>

      {success && (
        <div className="p-4 bg-success/10 border border-success rounded-lg text-success text-sm">
          ✓ {success} connected successfully!
        </div>
      )}

      {error && (
        <div className="p-4 bg-error/10 border border-error rounded-lg text-error text-sm">
          ✗ Connection failed: {error}
        </div>
      )}

      {integrations && integrations.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Active Integrations</h2>
          <div className="grid gap-4">
            {integrations.map((integration) => (
              <div key={integration.id} className="glass p-6 rounded-lg flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">{integration.displayName}</h3>
                  <p className="text-sm text-text-secondary">{integration.provider}</p>
                  {integration.lastSyncAt && (
                    <p className="text-xs text-text-tertiary mt-1">
                      Last synced: {new Date(integration.lastSyncAt).toLocaleString()}
                    </p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  onClick={() => {
                    if (confirm('Disconnect this integration?')) {
                      disconnectMutation.mutate({ id: integration.id });
                    }
                  }}
                  disabled={disconnectMutation.isPending}
                >
                  Disconnect
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-2xl font-bold mb-6">Available Tools</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {providers.map((provider) => {
            const isConnected = integrations?.some(
              (i) => i.provider.toLowerCase() === provider.id.toLowerCase()
            );

            return (
              <div key={provider.id} className="glass p-6 rounded-lg space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-3xl mb-2">{provider.icon}</div>
                    <h3 className="text-xl font-bold">{provider.name}</h3>
                    <p className="text-sm text-text-secondary mt-1">{provider.description}</p>
                  </div>
                </div>

                {isConnected ? (
                  <Button variant="outline" disabled className="w-full">
                    ✓ Connected
                  </Button>
                ) : (
                  <Link href={`/api/oauth/start?provider=${provider.id}`} className="block">
                    <Button variant="default" className="w-full">
                      Connect
                    </Button>
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function IntegrationsPage() {
  return (
    <Suspense fallback={<div className="animate-pulse">Loading integrations...</div>}>
      <IntegrationsContent />
    </Suspense>
  );
}
