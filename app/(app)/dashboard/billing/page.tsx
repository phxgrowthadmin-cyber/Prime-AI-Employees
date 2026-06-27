"use client";

import { useAuth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function BillingPage() {
  const { isLoaded, userId } = useAuth();

  if (!isLoaded) return <div>Loading...</div>;
  if (!userId) redirect("/sign-in");

  const currentPlan = { name: "RECRUIT", price: 97, features: ["1 Agent", "3 Integrations", "500 runs/mo"] };
  const upcomingInvoice = { amount: 97, date: "Jan 5, 2025", status: "Upcoming" };

  return (
    <div className="min-h-screen bg-bg-primary">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h1 className="text-4xl font-bold mb-2">Billing</h1>
          <p className="text-text-2 mb-12">Manage your subscription and payment</p>

          {/* Current Plan */}
          <div className="rounded-xl p-8 border border-border bg-surface/40 backdrop-blur mb-8">
            <h2 className="text-2xl font-bold mb-6">Current Plan</h2>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div>
                <p className="text-text-2 mb-2">Active Plan</p>
                <p className="text-3xl font-bold mb-4">{currentPlan.name}</p>
                <p className="text-2xl font-bold text-primary mb-4">${currentPlan.price}/month</p>
                <ul className="space-y-2">
                  {currentPlan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-text-2">
                      <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <Link href="/pricing">
                <button className="px-6 py-3 border border-primary text-primary rounded-lg font-bold hover:bg-primary/10 transition flex items-center gap-2">
                  Upgrade Plan <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </div>

          {/* Payment Method */}
          <div className="rounded-xl p-8 border border-border bg-surface/40 backdrop-blur mb-8">
            <h2 className="text-2xl font-bold mb-6">Payment Method</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-2 mb-2">No payment method on file</p>
                <p className="text-sm text-text-3">Add a credit card to enable automatic billing</p>
              </div>
              <button className="px-6 py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary/90">
                Add Payment Method
              </button>
            </div>
          </div>

          {/* Upcoming Invoice */}
          <div className="rounded-xl p-8 border border-border bg-surface/40 backdrop-blur">
            <h2 className="text-2xl font-bold mb-6">Upcoming Invoice</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-2 mb-2">{upcomingInvoice.status} on {upcomingInvoice.date}</p>
                <p className="text-2xl font-bold">${upcomingInvoice.amount}</p>
              </div>
              <button className="px-6 py-3 border border-text-2 rounded-lg font-bold hover:bg-surface transition">
                View Invoice
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
