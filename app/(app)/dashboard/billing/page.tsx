import { Button } from '@/components/ui/button';

export default function BillingPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold">Billing & Subscription</h1>
        <p className="text-text-secondary">Manage your subscription and billing</p>
      </div>

      <div className="glass p-8 rounded-lg space-y-6">
        <div>
          <p className="text-text-secondary mb-2">Current Plan</p>
          <h2 className="text-3xl font-bold text-primary">RECRUIT</h2>
          <p className="text-text-secondary">$97 per month</p>
        </div>

        <div className="border-t border-border-default pt-6">
          <h3 className="text-xl font-bold mb-4">Plan Details</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Max Agents', value: '1' },
              { label: 'Max Tools', value: '3' },
              { label: 'Monthly Run Limit', value: '500' },
              { label: 'Support', value: 'Email' },
            ].map((item, i) => (
              <div key={i}>
                <p className="text-text-secondary text-sm">{item.label}</p>
                <p className="font-semibold text-lg">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          <Button variant="outline">Upgrade Plan</Button>
          <Button variant="ghost">Manage Subscription</Button>
        </div>
      </div>

      <div className="glass p-8 rounded-lg">
        <h3 className="text-xl font-bold mb-4">Billing History</h3>
        <div className="text-text-secondary text-center py-8">
          No billing history yet
        </div>
      </div>
    </div>
  );
}
