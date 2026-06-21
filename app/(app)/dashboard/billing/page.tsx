'use client';

import { Button } from '@/components/ui/button';
import { trpc } from '@/lib/trpc-client';
import { Suspense } from 'react';

function BillingContent() {
  const { data: currentSubscription } = trpc.subscription.getCurrent.useQuery();
  const { data: tiers } = trpc.subscription.getTiers.useQuery();
  const upgradeMutation = trpc.subscription.upgradeTier.useMutation({
    onSuccess: () => {
      alert('Subscription updated successfully!');
    },
  });

  if (!currentSubscription || !tiers) {
    return <div className="animate-pulse">Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold">Billing & Subscription</h1>
        <p className="text-text-secondary">Manage your subscription and billing</p>
      </div>

      <div className="glass p-8 rounded-lg space-y-6">
        <div>
          <p className="text-text-secondary mb-2">Current Plan</p>
          <h2 className="text-3xl font-bold text-primary">{currentSubscription.tier}</h2>
          <p className="text-text-secondary">
            {currentSubscription.currentPeriodEnd
              ? `Renews on ${new Date(currentSubscription.currentPeriodEnd).toLocaleDateString()}`
              : 'No active subscription'}
          </p>
        </div>

        <div className="border-t border-default pt-6">
          <h3 className="text-xl font-bold mb-4">Current Limits</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                label: 'Max Agents',
                value: currentSubscription.limits.maxAgents === -1 ? '∞' : currentSubscription.limits.maxAgents,
              },
              {
                label: 'Max Tools',
                value: currentSubscription.limits.maxConnectors === -1 ? '∞' : currentSubscription.limits.maxConnectors,
              },
              {
                label: 'Monthly Runs',
                value: currentSubscription.limits.monthlyRunLimit === -1 ? '∞' : currentSubscription.limits.monthlyRunLimit,
              },
              {
                label: 'Max Models',
                value: currentSubscription.limits.maxModels === -1 ? '∞' : currentSubscription.limits.maxModels,
              },
            ].map((item, i) => (
              <div key={i}>
                <p className="text-text-secondary text-sm">{item.label}</p>
                <p className="font-semibold text-lg">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-bold mb-6">Upgrade Your Plan</h3>
        <div className="grid md:grid-cols-3 gap-8">
          {tiers.map((tier) => (
            <div key={tier.id} className="glass p-8 rounded-2xl flex flex-col">
              <h4 className="text-2xl font-bold text-primary mb-2">{tier.name}</h4>
              <p className="text-text-secondary mb-6">{tier.description}</p>

              <div className="mb-6">
                <span className="text-4xl font-bold">${tier.price}</span>
                <span className="text-text-secondary">/month</span>
              </div>

              <ul className="space-y-3 mb-6 flex-1">
                <li className="text-sm flex items-center gap-2">
                  <span>✓</span>
                  <span>
                    {tier.features.maxAgents === -1
                      ? 'Unlimited agents'
                      : `${tier.features.maxAgents} agent${tier.features.maxAgents !== 1 ? 's' : ''}`}
                  </span>
                </li>
                <li className="text-sm flex items-center gap-2">
                  <span>✓</span>
                  <span>
                    {tier.features.maxConnectors === -1
                      ? 'All integrations'
                      : `${tier.features.maxConnectors} integrations`}
                  </span>
                </li>
                <li className="text-sm flex items-center gap-2">
                  <span>✓</span>
                  <span>
                    {tier.features.monthlyRunLimit === -1
                      ? 'Unlimited monthly runs'
                      : `${tier.features.monthlyRunLimit.toLocaleString()} monthly runs`}
                  </span>
                </li>
              </ul>

              {currentSubscription.tier === tier.id ? (
                <Button variant="outline" disabled className="w-full">
                  Current Plan
                </Button>
              ) : (
                <Button
                  variant={tier.id === 'EMPIRE' ? 'accent' : 'default'}
                  onClick={() => upgradeMutation.mutate({ tier: tier.id as any })}
                  disabled={upgradeMutation.isPending}
                  className="w-full"
                >
                  {upgradeMutation.isPending ? 'Upgrading...' : `Upgrade to ${tier.name}`}
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="glass p-8 rounded-lg">
        <h3 className="text-xl font-bold mb-4">Billing History</h3>
        <div className="text-text-secondary text-center py-8">
          No billing history yet. Your subscription will be billed on your next renewal date.
        </div>
      </div>
    </div>
  );
}

export default function BillingPage() {
  return (
    <Suspense fallback={<div className="animate-pulse">Loading billing...</div>}>
      <BillingContent />
    </Suspense>
  );
}
