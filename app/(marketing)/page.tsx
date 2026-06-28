import { Button } from '@/components/ui/button';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Dynamically import 3D hero to avoid SSR issues
const DynamicHero = dynamic(
  () => import('@/components/3d/neural-network-hero').then((mod) => ({ default: mod.NeuralNetworkHero })),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-screen bg-bg-primary flex items-center justify-center">
        <div className="text-text-secondary animate-pulse text-sm tracking-widest">
          Entering space...
        </div>
      </div>
    ),
  }
);

export default function HomePage() {
  return (
    <div className="space-y-0">
      {/* Full-screen Hero with Content Overlay */}
      <section className="relative w-full h-screen overflow-hidden">
        <DynamicHero />

        {/* Gradient fade for readability */}
        <div
          className="absolute inset-x-0 bottom-0 h-96 pointer-events-none"
          style={{
            background: 'linear-gradient(to top, #08090A 0%, rgba(8,9,10,0.6) 50%, transparent 100%)',
          }}
        />

        {/* Content Overlay in Bottom Third */}
        <div className="absolute inset-x-0 bottom-0 z-10 pb-20 pointer-events-none">
          <div className="container mx-auto px-4 text-center">
            <div className="pointer-events-auto space-y-6 max-w-3xl mx-auto">
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                  AI Agents
                </span>
                <br />
                <span className="text-text-primary">That Never Sleep</span>
              </h1>
              <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
                Deploy intelligent autonomous agents that handle your entire business. Sales, support,
                research, operations—all running 24/7.
              </p>
              <div className="flex gap-4 justify-center pt-4 flex-wrap">
                <Link href="/sign-up">
                  <Button size="lg" variant="default">
                    Get Started Free
                  </Button>
                </Link>
                <Link href="/pricing">
                  <Button size="lg" variant="outline">
                    View Pricing
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section className="container mx-auto px-4 py-24 border-t border-border/10">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl font-bold">Why NEXUS AI?</h2>
          <p className="text-text-secondary max-w-2xl mx-auto">
            Everything you need to deploy enterprise-grade AI agents
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: '🧠',
              title: '15+ AI Models',
              description: 'Access Claude Opus, GPT-4o, Gemini, and more. Mix and match for optimal performance.',
            },
            {
              icon: '🔗',
              title: '50+ Integrations',
              description: 'Connect to Slack, Salesforce, HubSpot, Google Workspace, and 45+ more tools.',
            },
            {
              icon: '⚡',
              title: 'Lightning Fast',
              description: 'Agents execute in milliseconds with sub-100ms response times powered by Vercel Edge.',
            },
            {
              icon: '🔒',
              title: 'Enterprise Secure',
              description: 'SOC 2 Type II compliance, end-to-end encryption, and granular access controls.',
            },
            {
              icon: '📊',
              title: 'Full Analytics',
              description: 'Track agent performance, costs, and ROI with real-time dashboards.',
            },
            {
              icon: '🚀',
              title: 'Scale Infinitely',
              description: 'Deploy unlimited agents across your organization with zero infrastructure overhead.',
            },
          ].map((feature, i) => (
            <div key={i} className="glass p-8 rounded-2xl space-y-4 hover:border-primary/30 transition group border border-border/20">
              <div className="text-4xl group-hover:scale-110 transition">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-primary">{feature.title}</h3>
              <p className="text-text-secondary">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison Section */}
      <section className="container mx-auto px-4 py-24 border-t border-border/10">
        <div className="glass rounded-2xl p-12 space-y-8 border border-border/20">
          <div className="text-center space-y-2">
            <h2 className="text-4xl font-bold">Agents vs. Traditional Tools</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-text-tertiary">Traditional Tools</h3>
              <ul className="space-y-2 text-text-secondary">
                <li>❌ Manual workflow setup</li>
                <li>❌ Limited integrations</li>
                <li>❌ No autonomous decision-making</li>
                <li>❌ Expensive implementation</li>
                <li>❌ Inflexible automation</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-secondary">NEXUS Agents</h3>
              <ul className="space-y-2 text-text-secondary">
                <li>✅ Deploy in minutes</li>
                <li>✅ 50+ pre-built integrations</li>
                <li>✅ Intelligent autonomous agents</li>
                <li>✅ No setup costs</li>
                <li>✅ Adapt to any workflow</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-24 border-t border-border/10">
        <div className="glass rounded-2xl p-12 bg-gradient-to-r from-primary/10 to-secondary/10 text-center space-y-6 border border-border/20">
          <h2 className="text-4xl font-bold">Ready to transform?</h2>
          <p className="text-text-secondary max-w-2xl mx-auto text-lg">
            Start with RECRUIT ($97/mo) and scale to EMPIRE. No credit card required.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/sign-up">
              <Button size="lg" variant="default">
                Start Free Trial
              </Button>
            </Link>
            <Link href="/pricing">
              <Button size="lg" variant="outline">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="container mx-auto px-4 py-24 border-t border-border/10 text-center space-y-12">
        <div>
          <h2 className="text-3xl font-bold mb-2">Trusted by Teams Worldwide</h2>
          <p className="text-text-secondary">Powering automation for companies in 20+ countries</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { value: '500+', label: 'Active Agents' },
            { value: '1M+', label: 'Daily Tasks' },
            { value: '99.9%', label: 'Uptime' },
            { value: '47ms', label: 'Avg Response' },
          ].map((stat, i) => (
            <div key={i} className="glass p-6 rounded-lg text-center border border-border/20">
              <div className="text-3xl font-bold text-secondary">{stat.value}</div>
              <div className="text-text-secondary text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
