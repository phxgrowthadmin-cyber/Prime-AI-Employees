'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { trpc } from '@/lib/trpc-client';

export default function DashboardPage() {
  const { data: subscription } = trpc.subscription.getCurrent.useQuery();
  const { data: usage } = trpc.subscription.getUsage.useQuery();
  const { data: taskStats } = trpc.tasks.getStats.useQuery();

  const stats = [
    {
      label: 'Active Agents',
      value: usage?.agents.used || '0',
      max: usage?.agents.limit,
      icon: '🤖',
    },
    {
      label: 'Tasks This Month',
      value: usage?.tasksThisMonth.used || '0',
      max: usage?.tasksThisMonth.limit,
      icon: '✓',
    },
    {
      label: 'Success Rate',
      value: `${taskStats?.successRate || 0}%`,
      icon: '📊',
    },
    {
      label: 'Avg Response Time',
      value: `${Math.round((taskStats?.avgDuration || 0) / 1000)}ms`,
      icon: '⚡',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
        <p className="text-text-secondary">
          Plan: <span className="font-semibold text-primary">{subscription?.tier || 'RECRUIT'}</span>
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="glass p-6 rounded-lg space-y-2">
            <div className="text-2xl">{stat.icon}</div>
            <p className="text-text-secondary text-sm">{stat.label}</p>
            <p className="text-3xl font-bold">{stat.value}</p>
            {stat.max && (
              <p className="text-xs text-text-tertiary">
                {usage?.agents.used || 0} of {stat.max === -1 ? '∞' : stat.max}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-bg-secondary rounded-lg p-8 space-y-4">
        <h2 className="text-2xl font-bold">Get Started</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Link href="/dashboard/agents/new">
            <Button variant="outline" className="w-full text-left">
              <div className="text-left">
                <div className="font-semibold">Create First Agent</div>
                <div className="text-sm text-text-secondary">Deploy your first AI employee</div>
              </div>
            </Button>
          </Link>
          <Link href="/dashboard/integrations">
            <Button variant="outline" className="w-full text-left">
              <div className="text-left">
                <div className="font-semibold">Connect Tools</div>
                <div className="text-sm text-text-secondary">Link your business apps</div>
              </div>
            </Button>
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="glass p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
        <div className="text-text-secondary text-center py-8">
          {taskStats?.total === 0
            ? 'No activity yet. Create your first agent to get started!'
            : 'Task activity will appear here'}
        </div>
      </div>
    </div>
  );
}
