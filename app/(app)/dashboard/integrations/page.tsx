"use client";

import { useAuth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle, Plus } from "lucide-react";

const AVAILABLE_INTEGRATIONS = [
  { name: "Slack", icon: "💬", description: "Send messages and notifications", connected: false },
  { name: "Gmail", icon: "📧", description: "Send and receive emails", connected: false },
  { name: "HubSpot", icon: "🎯", description: "Manage contacts and deals", connected: false },
  { name: "Salesforce", icon: "🏢", description: "CRM integration", connected: false },
  { name: "Notion", icon: "📝", description: "Create and update pages", connected: false },
  { name: "Stripe", icon: "💳", description: "Process payments", connected: false },
  { name: "Google Sheets", icon: "📊", description: "Read and write data", connected: false },
  { name: "Airtable", icon: "📋", description: "Manage bases and records", connected: false },
];

export default function IntegrationsPage() {
  const { isLoaded, userId } = useAuth();

  if (!isLoaded) return <div>Loading...</div>;
  if (!userId) redirect("/sign-in");

  return (
    <div className="min-h-screen bg-bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h1 className="text-4xl font-bold mb-2">Integrations</h1>
          <p className="text-text-2 mb-12">Connect tools and services to your agents</p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {AVAILABLE_INTEGRATIONS.map((integration, i) => (
              <motion.div
                key={integration.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-xl p-6 border border-border bg-surface/40 backdrop-blur hover:border-primary/50 transition group cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="text-3xl">{integration.icon}</div>
                  {integration.connected ? (
                    <CheckCircle className="w-5 h-5 text-primary" />
                  ) : (
                    <Plus className="w-5 h-5 text-text-3 group-hover:text-primary transition" />
                  )}
                </div>
                <h3 className="font-bold text-lg mb-1">{integration.name}</h3>
                <p className="text-text-2 text-sm mb-4">{integration.description}</p>
                <button
                  className={`w-full py-2 rounded-lg font-semibold transition ${
                    integration.connected
                      ? "bg-primary/10 text-primary"
                      : "border border-primary text-primary hover:bg-primary/10"
                  }`}
                >
                  {integration.connected ? "Connected" : "Connect"}
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
