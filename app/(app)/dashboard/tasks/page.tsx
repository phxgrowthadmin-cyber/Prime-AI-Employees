"use client";

import { useAuth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";

export default function TasksPage() {
  const { isLoaded, userId } = useAuth();

  if (!isLoaded) return <div>Loading...</div>;
  if (!userId) redirect("/sign-in");

  return (
    <div className="min-h-screen bg-bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h1 className="text-4xl font-bold mb-2">Tasks</h1>
          <p className="text-text-2 mb-12">Track your agent executions and results</p>

          <div className="rounded-xl p-12 border border-border bg-surface/40 backdrop-blur text-center">
            <Clock className="w-12 h-12 text-text-3 mx-auto mb-4" />
            <p className="text-text-2 mb-6">No tasks yet. Create an agent and run it to see execution history.</p>
            <button className="px-6 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90">
              Create Your First Agent
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
