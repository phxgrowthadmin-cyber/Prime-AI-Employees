"use client";

import { useAuth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { motion } from "framer-motion";
import { Plus, Brain } from "lucide-react";
import Link from "next/link";

export default function AgentsPage() {
  const { isLoaded, userId } = useAuth();

  if (!isLoaded) return <div className="animate-spin">Loading...</div>;
  if (!userId) redirect("/sign-in");

  return (
    <div className="min-h-screen bg-bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Your Agents</h1>
              <p className="text-text-2">Create and manage AI agents</p>
            </div>
            <Link href="/dashboard/agents/new">
              <button className="px-6 py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 flex items-center gap-2">
                <Plus className="w-5 h-5" /> Create Agent
              </button>
            </Link>
          </div>

          <div className="rounded-xl p-12 border border-border bg-surface/40 backdrop-blur text-center">
            <Brain className="w-12 h-12 text-text-3 mx-auto mb-4" />
            <p className="text-text-2 mb-6">No agents yet. Create your first AI agent to get started.</p>
            <Link href="/dashboard/agents/new">
              <button className="px-6 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90">
                Create Your First Agent
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
