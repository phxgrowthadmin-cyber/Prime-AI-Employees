import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Check } from 'lucide-react';

const tiers = [
  {
    id: 'RECRUIT',
    name: 'RECRUIT',
    price: 97,
    description: 'Perfect for trying it out',
    features: [
      '1 AI Agent',
      '3 Tool Connectors',
      '2 AI Models',
      '500 Monthly Runs',
      'Email Support',
      'Basic Analytics',
    ],
    cta: 'Get Started',
    color: 'primary',
  },
  {
    id: 'OPERATOR',
    name: 'OPERATOR',
    price: 497,
    description: 'For growing operations',
    features: [
      '5 AI Agents',
      '10 Tool Connectors',
      '5 AI Models',
      '5,000 Monthly Runs',
      'Priority Support',
      'Advanced Analytics',
      'Custom Workflows',
      'API Access',
    ],
    cta: 'Get Started',
    color: 'secondary',
    highlighted: true,
  },
  {
    id: 'EMPIRE',
    name: 'EMPIRE',
    price: 2497,
    description: 'Enterprise-grade automation',
    features: [
      'Unlimited AI Agents',
      'All Tools & Connectors',
      'All AI Models',
      'Unlimited Monthly Runs',
      'Dedicated Account Manager',
      'Custom Integration',
      'White-Label Option',
      'SLA Guarantee',
      'Priority Processing',
    ],
    cta: 'Contact Sales',
    color: 'gold',
  },
];

export default function PricingPage() {
  return (
    <div className="space-y-24 py-20">
      <section className="container mx-auto px-4 text-center space-y-8">
        <h1 className="text-5xl md:text-6xl font-bold">Simple, Transparent Pricing</h1>
        <p className="text-xl text-text-secondary max-w-2xl mx-auto">
          Choose the plan that fits your business. Upgrade anytime.
        </p>
      </section>

      {/* Pricing Cards */}
      <section className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={`rounded-2xl p-8 flex flex-col ${
                tier.highlighted
                  ? `glass border-2 border-${tier.color} shadow-lg`
                  : 'glass'
              }`}
            >
              {tier.highlighted && (
                <div className="mb-4 inline-block">
                  <span className={`text-sm font-semibold text-${tier.color} bg-${tier.color}/10 px-3 py-1 rounded-full`}>
                    Most Popular
                  </span>
                </div>
              )}

              <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
              <p className="text-text-secondary mb-6">{tier.description}</p>

              <div className="mb-6">
                <span className="text-5xl font-bold">${tier.price}</span>
                <span className="text-text-secondary">/month</span>
              </div>

              <Link href="/sign-up" className="w-full mb-8">
                <Button
                  variant={tier.color === 'gold' ? 'accent' : 'default'}
                  size="lg"
                  className="w-full"
                >
                  {tier.cta}
                </Button>
              </Link>

              <div className="space-y-3 flex-1">
                {tier.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-secondary flex-shrink-0" />
                    <span className="text-text-secondary">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Annual Discount */}
      <section className="container mx-auto px-4 bg-bg-secondary rounded-2xl p-8 text-center space-y-4">
        <h3 className="text-2xl font-bold">Pay Annually & Save 2 Months</h3>
        <p className="text-text-secondary">
          Get 2 months free when you commit to an annual plan
        </p>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-4 max-w-2xl space-y-8">
        <h2 className="text-3xl font-bold text-center">Frequently Asked Questions</h2>
        {[
          {
            q: 'Can I change my plan anytime?',
            a: 'Yes, upgrade or downgrade your plan at any time with changes taking effect on the next billing cycle.',
          },
          {
            q: 'Is there a free trial?',
            a: 'Yes, start with our free tier (RECRUIT) to explore all features with basic limits.',
          },
          {
            q: 'What if I need custom limits?',
            a: 'Contact our sales team for custom enterprise packages tailored to your needs.',
          },
        ].map((faq, i) => (
          <div key={i} className="space-y-2">
            <h3 className="font-semibold text-lg">{faq.q}</h3>
            <p className="text-text-secondary">{faq.a}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
