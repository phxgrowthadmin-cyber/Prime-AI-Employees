"use client";

import { useAuth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { motion } from "framer-motion";
import { useState } from "react";
import { CheckCircle, Plus, Loader, AlertCircle } from "lucide-react";
import { useCreateIntegration } from "@/hooks/useIntegration";

type IntegrationProvider =
  | "SLACK"
  | "MS_TEAMS"
  | "DISCORD"
  | "TELEGRAM"
  | "HUBSPOT"
  | "SALESFORCE"
  | "PIPEDRIVE"
  | "GOOGLE_WORKSPACE"
  | "MICROSOFT_365"
  | "NOTION"
  | "AIRTABLE"
  | "ZAPIER"
  | "MAKE"
  | "OPENAI"
  | "ANTHROPIC"
  | "GOOGLE_AI"
  | "PERPLEXITY"
  | "STRIPE"
  | "CUSTOM_API";

const AVAILABLE_INTEGRATIONS: Array<{
  name: string;
  icon: string;
  description: string;
  provider: IntegrationProvider;
}> = [
  { name: "Slack", icon: "💬", description: "Send messages and notifications", provider: "SLACK" },
  { name: "Teams", icon: "👥", description: "Microsoft Teams integration", provider: "MS_TEAMS" },
  { name: "Discord", icon: "🎮", description: "Discord server management", provider: "DISCORD" },
  { name: "HubSpot", icon: "🎯", description: "Manage contacts and deals", provider: "HUBSPOT" },
  { name: "Salesforce", icon: "🏢", description: "CRM integration", provider: "SALESFORCE" },
  { name: "Notion", icon: "📝", description: "Create and update pages", provider: "NOTION" },
  { name: "Airtable", icon: "📋", description: "Manage bases and records", provider: "AIRTABLE" },
  { name: "Stripe", icon: "💳", description: "Process payments", provider: "STRIPE" },
];

export default function IntegrationsPage() {
  const { isLoaded, userId } = useAuth();
  const [connectedIntegrations, setConnectedIntegrations] = useState<Set<string>>(new Set());
  const [error, setError] = useState("");
  const createMutation = useCreateIntegration();

  if (!isLoaded) return <div>Loading...</div>;
  if (!userId) redirect("/sign-in");

  const handleConnect = async (provider: IntegrationProvider, name: string) => {
    setError("");
    try {
      await createMutation.mutateAsync({
        provider,
        name,
        displayName: name,
      });
      setConnectedIntegrations((prev) => new Set([...prev, provider]));
    } catch (err) {
      setError(`Failed to connect ${name}: ${err instanceof Error ? err.message : "Unknown error"}`);
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h1 className="text-4xl font-bold mb-2">Integrations</h1>
          <p className="text-text-2 mb-12">Connect tools and services to your agents</p>

          {error && (
            <div className="mb-6 p-4 rounded-lg bg-accent/10 border border-accent flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-accent flex-shrink-0" />
              <p className="text-accent text-sm">{error}</p>
            </div>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {AVAILABLE_INTEGRATIONS.map((integration, i) => {
              const isConnected = connectedIntegrations.has(integration.provider);
              const isLoading = createMutation.isPending;

              return (
                <motion.div
                  key={integration.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="rounded-xl p-6 border border-border bg-surface/40 backdrop-blur hover:border-primary/50 transition group cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-3xl">{integration.icon}</div>
                    {isConnected ? (
                      <CheckCircle className="w-5 h-5 text-primary" />
                    ) : (
                      <Plus className="w-5 h-5 text-text-3 group-hover:text-primary transition" />
                    )}
                  </div>
                  <h3 className="font-bold text-lg mb-1">{integration.name}</h3>
                  <p className="text-text-2 text-sm mb-4">{integration.description}</p>
                  <button
                    onClick={() => handleConnect(integration.provider, integration.name)}
                    disabled={isLoading || isConnected}
                    className={`w-full py-2 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${
                      isConnected
                        ? "bg-primary/10 text-primary cursor-default"
                        : "border border-primary text-primary hover:bg-primary/10 disabled:opacity-50"
                    }`}
                  >
                    {isLoading && <Loader className="w-4 h-4 animate-spin" />}
                    {isConnected ? "Connected" : "Connect"}
                  </button>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
