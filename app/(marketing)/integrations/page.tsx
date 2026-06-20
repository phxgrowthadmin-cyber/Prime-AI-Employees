import { Button } from '@/components/ui/button';
import Link from 'next/link';

const integrations = [
  {
    category: 'CRM & Sales',
    tools: ['Salesforce', 'HubSpot', 'Pipedrive', 'Stripe'],
  },
  {
    category: 'Communication',
    tools: ['Slack', 'Microsoft Teams', 'Discord', 'Telegram'],
  },
  {
    category: 'Productivity',
    tools: ['Google Workspace', 'Microsoft 365', 'Notion', 'Airtable'],
  },
  {
    category: 'AI Models',
    tools: ['OpenAI', 'Anthropic', 'Google AI', 'Perplexity'],
  },
  {
    category: 'Automation',
    tools: ['Zapier', 'Make', 'IFTTT', 'Webhooks'],
  },
  {
    category: 'Data & Analytics',
    tools: ['Google Analytics', 'Stripe', 'Segment', 'Mixpanel'],
  },
];

export default function IntegrationsPage() {
  return (
    <div className="space-y-24 py-20">
      <section className="container mx-auto px-4 text-center space-y-8">
        <h1 className="text-5xl md:text-6xl font-bold">
          Connect to <span className="text-secondary">Anything</span>
        </h1>
        <p className="text-xl text-text-secondary max-w-2xl mx-auto">
          50+ pre-built integrations plus custom API support. Your agents work with all your
          business tools.
        </p>
      </section>

      <section className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12">
          {integrations.map((category, i) => (
            <div key={i} className="space-y-4">
              <h3 className="text-2xl font-bold text-primary">{category.category}</h3>
              <div className="grid grid-cols-2 gap-3">
                {category.tools.map((tool) => (
                  <div
                    key={tool}
                    className="glass p-4 rounded-lg text-center hover:border-primary/50 transition"
                  >
                    <span className="text-sm font-medium text-text-secondary">{tool}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-12 text-center space-y-6">
        <h2 className="text-3xl font-bold">Need a custom integration?</h2>
        <p className="text-text-secondary max-w-2xl mx-auto">
          Our enterprise team can build custom API connections for any tool
        </p>
        <Link href="/sign-up">
          <Button size="lg" variant="accent">
            Contact Sales
          </Button>
        </Link>
      </section>
    </div>
  );
}
