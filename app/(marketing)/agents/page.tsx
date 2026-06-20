import { Button } from '@/components/ui/button';
import Link from 'next/link';

const agents = [
  {
    name: 'Sales Development Rep',
    description: 'Automatically prospects, qualifies leads, and schedules meetings',
    tools: ['Salesforce', 'Gmail', 'Slack', 'Perplexity'],
    model: 'Claude Opus',
  },
  {
    name: 'Content Strategist',
    description: 'Creates and distributes content across all channels',
    tools: ['Google Workspace', 'Notion', 'Twitter API', 'LinkedIn'],
    model: 'GPT-4o',
  },
  {
    name: 'Customer Support Specialist',
    description: 'Handles customer inquiries and resolves issues 24/7',
    tools: ['Slack', 'Zendesk', 'Discord', 'Email'],
    model: 'Claude Sonnet',
  },
  {
    name: 'Data Analyst',
    description: 'Analyzes metrics, generates reports, and identifies trends',
    tools: ['Google Sheets', 'Tableau', 'Stripe', 'Custom APIs'],
    model: 'GPT-4o',
  },
];

export default function AgentsPage() {
  return (
    <div className="space-y-24 py-20">
      <section className="container mx-auto px-4 text-center space-y-8">
        <h1 className="text-5xl md:text-6xl font-bold">AI Agents for Every Role</h1>
        <p className="text-xl text-text-secondary max-w-2xl mx-auto">
          Pre-built agents ready to deploy, or create custom agents with any combination of tools
        </p>
      </section>

      <section className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8">
          {agents.map((agent, i) => (
            <div key={i} className="glass p-8 rounded-2xl space-y-4 hover:border-primary/50 transition">
              <h3 className="text-2xl font-bold text-primary">{agent.name}</h3>
              <p className="text-text-secondary">{agent.description}</p>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-text-tertiary mb-2">Powered by:</p>
                  <p className="font-semibold text-secondary">{agent.model}</p>
                </div>
                <div>
                  <p className="text-sm text-text-tertiary mb-2">Connected Tools:</p>
                  <div className="flex flex-wrap gap-2">
                    {agent.tools.map((tool) => (
                      <span
                        key={tool}
                        className="px-3 py-1 rounded-full text-xs bg-primary/10 text-primary"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 text-center space-y-6 bg-bg-secondary rounded-2xl p-12">
        <h2 className="text-3xl font-bold">Ready to deploy?</h2>
        <Link href="/sign-up">
          <Button size="lg" variant="accent">
            Start Building Agents
          </Button>
        </Link>
      </section>
    </div>
  );
}
