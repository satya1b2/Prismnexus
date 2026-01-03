
import React from 'react';
import { 
  Bot, 
  Workflow, 
  LineChart, 
  Target, 
  Settings,
  Shield,
  Zap,
  Activity
} from 'lucide-react';
import { Feature, PricingTier, UseCase, AgentConfig } from './types';

// Export the BADGES constant for use in the DevExperience component
export const BADGES = [
  { label: 'Modular SDK', icon: <Workflow className="w-5 h-5 text-indigo-400" /> },
  { label: 'Real-time Sync', icon: <Zap className="w-5 h-5 text-cyan-400" /> },
  { label: 'Type-Safe', icon: <Shield className="w-5 h-5 text-emerald-400" /> },
  { label: 'Performance', icon: <Activity className="w-5 h-5 text-fuchsia-400" /> }
];

export const AGENT_TEMPLATES: Partial<AgentConfig>[] = [
  {
    name: "Revenue Research Agent",
    role: "Sales Intelligence",
    instructions: "Analyze prospect websites and LinkedIn profiles to find specific triggers for outreach.",
    model: 'gemini-3-pro-preview',
    tools: { search: true, maps: false, thinking: true }
  },
  {
    name: "Billing Reconciliation",
    role: "FinOps Specialist",
    instructions: "Cross-reference invoices with payment gateways and flag discrepancies.",
    model: 'gemini-3-flash-preview',
    tools: { search: false, maps: false, thinking: false }
  }
];

export const USE_CASES: UseCase[] = [
  {
    title: "Inbound Qualification",
    description: "Agents qualify leads instantly via chat and email based on ICP fit.",
    iconName: "Target"
  },
  {
    title: "Customer Success",
    description: "Automate proactive outreach to customers at risk of churning.",
    iconName: "Activity"
  },
  {
    title: "Revenue Ops",
    description: "Keep your CRM perfectly clean with automated data entry and enrichment.",
    iconName: "Settings"
  },
  {
    title: "Global Compliance",
    description: "Ensure all agent communication adheres to regional regulatory standards.",
    iconName: "Shield"
  }
];

export const PRICING: PricingTier[] = [
  {
    name: "Foundation",
    price: "$299",
    description: "For startups operationalizing their first agents.",
    features: ["5 Dedicated Agents", "Standard Orchestration", "SOC2 Compliant", "Email Support", "Basic CRM Sync"]
  },
  {
    name: "Growth",
    price: "$999",
    description: "High-volume agentic operations for scaleups.",
    features: ["25 Dedicated Agents", "Advanced Orchestration", "Real-time Grounding", "Priority API Access", "Custom Integration Nodes"],
    isPopular: true
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "Bespoke clusters for the global Fortune 500.",
    features: ["Unlimited Agents", "Isolated Infrastructure", "Dedicated Success Team", "Air-gapped Availability", "White-label Console"]
  }
];
