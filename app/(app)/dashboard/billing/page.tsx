"use client";

import { useAuth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { motion } from "framer-motion";
import { useState } from "react";
import { CheckCircle, ArrowRight, Loader, AlertCircle } from "lucide-react";
import { useUpgradeSubscription } from "@/hooks/useSubscription";

const TIERS = [
  {
    name: "RECRUIT",
    price: 97,
    features: ["1 Agent", "3 Integrations", "500 runs/mo", "Email support"],
  },
  {
    name: "OPERATOR",
    price: 497,
    features: ["5 Agents", "10 Integrations", "5,000 runs/mo", "Priority support"],
  },
  {
    name: "EMPIRE",
    price: 2497,
    features: ["Unlimited Agents", "All 15+ Tools", "Unlimited runs", "Dedicated manager"],
  },
];

export default function BillingPage() {
  const { isLoaded, userId } = useAuth();
  const [currentPlan] = useState("RECRUIT");
  const [error, setError] = useState("");
  const upgradeMutation = useUpgradeSubscription();

  if (!isLoaded) return <div>Loading...</div>;
  if (!userId) redirect("/sign-in");

  const handleUpgrade = async (tier: "RECRUIT" | "OPERATOR" | "EMPIRE") => {
    setError("");
    try {
      await upgradeMutation.mutateAsync(tier);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upgrade");
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h1 className="text-4xl font-bold mb-2">Billing & Plan</h1>
          <p className="text-text-2 mb-12">Upgrade your plan to unlock more features</p>

          {error && (
            <div className="mb-6 p-4 rounded-lg bg-accent/10 border border-accent flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-accent flex-shrink-0" />
              <p className="text-accent">{error}</p>
            </div>
          )}

          {/* Current Plan */}
          <div className="mb-12 rounded-xl p-8 border border-border bg-surface/40 backdrop-blur">
            <h2 className="text-2xl font-bold mb-6">Current Plan: {currentPlan}</h2>
            <p className="text-3xl font-bold text-primary mb-4">
              ${TIERS.find((t) => t.name === currentPlan)?.price}/month
            </p>
            <p className="text-text-2">Your subscription renews monthly. Cancel anytime.</p>
          </div>

          {/* Upgrade Options */}
          <h2 className="text-2xl font-bold mb-6">Available Plans</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {TIERS.map((tier) => {
              const isCurrent = tier.name === currentPlan;
              const isLoading = upgradeMutation.isPending;

              return (
                <motion.div
                  key={tier.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`rounded-xl p-8 border-2 ${
                    isCurrent ? "border-primary bg-primary/10" : "border-border bg-surface/40"
                  } backdrop-blur`}
                >
                  {isCurrent && (
                    <div className="inline-block px-3 py-1 bg-primary text-white text-xs font-bold rounded-full mb-4">
                      Current
                    </div>
                  )}
                  <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                  <p className="text-3xl font-bold text-primary mb-6">${tier.price}/mo</p>

                  <ul className="space-y-3 mb-8">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleUpgrade(tier.name as "RECRUIT" | "OPERATOR" | "EMPIRE")}
                    disabled={isCurrent || isLoading}
                    className={`w-full py-3 rounded-lg font-bold transition flex items-center justify-center gap-2 ${
                      isCurrent
                        ? "bg-primary/20 text-primary cursor-default"
                        : "bg-primary text-white hover:bg-primary/90 disabled:opacity-50"
                    }`}
                  >
                    {isLoading && <Loader className="w-4 h-4 animate-spin" />}
                    {isCurrent ? "Current Plan" : `Upgrade to ${tier.name}`}
                    {!isCurrent && <ArrowRight className="w-4 h-4" />}
                  </button>
                </motion.div>
              );
            })}
          </div>

          {/* Payment Method */}
          <div className="mt-12 rounded-xl p-8 border border-border bg-surface/40 backdrop-blur">
            <h2 className="text-2xl font-bold mb-6">Payment Method</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-2 mb-2">No payment method on file</p>
                <p className="text-sm text-text-3">Add a credit card to enable automatic billing (Stripe integration)</p>
              </div>
              <button className="px-6 py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary/90">
                Add Payment Method
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
