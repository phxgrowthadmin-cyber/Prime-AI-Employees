"use client";

import { SignUpButton } from "@clerk/nextjs";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Menu, X } from "lucide-react";
import { useState } from "react";
import { NeuralNetworkHero } from "@/components/3d/neural-network-hero";
import { AgentShowcase } from "@/components/marketing/agent-showcase";
import { FeaturesSection } from "@/components/marketing/features-section";
import { IntegrationsShowcase } from "@/components/marketing/integrations-showcase";
import { PricingSection } from "@/components/marketing/pricing-section";
import { CTASection } from "@/components/marketing/cta-section";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full border-b border-border bg-bg-primary/95 backdrop-blur supports-[backdrop-filter]:bg-bg-primary/60 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="font-bold text-2xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
          >
            NEXUS
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="#agents" className="text-text-2 hover:text-primary transition font-medium">
              Agents
            </Link>
            <Link href="#features" className="text-text-2 hover:text-primary transition font-medium">
              Features
            </Link>
            <Link href="#pricing" className="text-text-2 hover:text-primary transition font-medium">
              Pricing
            </Link>
            <Link href="#integrations" className="text-text-2 hover:text-primary transition font-medium">
              Integrations
            </Link>

            <div className="pl-8 border-l border-border flex gap-4">
              <SignUpButton mode="modal">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2 rounded-lg border border-primary text-primary hover:bg-primary/10 transition font-semibold"
                >
                  Sign In
                </motion.button>
              </SignUpButton>
              <SignUpButton mode="modal">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2 rounded-lg bg-gradient-to-r from-primary to-primary/80 text-white hover:shadow-lg hover:shadow-primary/50 transition font-semibold"
                >
                  Get Started
                </motion.button>
              </SignUpButton>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-surface transition"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden border-t border-border bg-bg-primary/80 backdrop-blur p-4 space-y-3"
          >
            <Link href="#agents" className="block text-text-2 hover:text-primary transition py-2">
              Agents
            </Link>
            <Link href="#features" className="block text-text-2 hover:text-primary transition py-2">
              Features
            </Link>
            <Link href="#pricing" className="block text-text-2 hover:text-primary transition py-2">
              Pricing
            </Link>
            <Link href="#integrations" className="block text-text-2 hover:text-primary transition py-2">
              Integrations
            </Link>
            <SignUpButton mode="modal">
              <button className="w-full px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition font-semibold">
                Get Started
              </button>
            </SignUpButton>
          </motion.div>
        )}
      </nav>

      {/* Hero with 3D */}
      <section className="pt-20">
        <NeuralNetworkHero />

        {/* Scroll Indicator */}
        <div className="flex justify-center pt-12 pb-8">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center gap-2 text-text-3"
          >
            <p className="text-sm font-semibold">Scroll to explore</p>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </div>
      </section>

      {/* Agent Showcase */}
      <section id="agents">
        <AgentShowcase />
      </section>

      {/* Features */}
      <section id="features">
        <FeaturesSection />
      </section>

      {/* Integrations */}
      <section id="integrations">
        <IntegrationsShowcase />
      </section>

      {/* Pricing */}
      <section id="pricing">
        <PricingSection />
      </section>

      {/* CTA */}
      <section>
        <CTASection />
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-surface/50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="font-bold text-lg text-primary mb-4">NEXUS AI</div>
              <p className="text-text-2 text-sm">Enterprise AI agents that work like real employees.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-text-2 text-sm">
                <li><Link href="#agents" className="hover:text-primary transition">Agents</Link></li>
                <li><Link href="#features" className="hover:text-primary transition">Features</Link></li>
                <li><Link href="#pricing" className="hover:text-primary transition">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-text-2 text-sm">
                <li><Link href="#" className="hover:text-primary transition">About</Link></li>
                <li><Link href="#" className="hover:text-primary transition">Blog</Link></li>
                <li><Link href="#" className="hover:text-primary transition">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-text-2 text-sm">
                <li><Link href="#" className="hover:text-primary transition">Privacy</Link></li>
                <li><Link href="#" className="hover:text-primary transition">Terms</Link></li>
                <li><Link href="#" className="hover:text-primary transition">Security</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border pt-8 text-center text-text-3 text-sm">
            <p>© 2024 NEXUS AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
