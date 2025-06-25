import { CheckCircle, DollarSign, FileText, Zap } from "lucide-svelte";

export const SUBMISSION_PROCESS_STEPS = [
  {
    id: 1,
    icon: FileText,
    title: "Designer Review",
    description:
      "Our designer reviews your scoped project and all the details you've shared. We'll refine the exact features and ensure everything aligns with your vision.",
    timing: "Within 24-48 hours (usually much sooner)",
    iconClass: "step-1",
    animationDelay: 600,
  },
  {
    id: 2,
    icon: DollarSign,
    title: "Official Proposal + 25% Deposit",
    description:
      "You'll receive a refined proposal with a secure payment link. Pay just 25% to get started—this confirms your spot in our queue and kicks off the design process.",
    timing: "Proposal valid for 7 days",
    iconClass: "step-2",
    animationDelay: 700,
  },
  {
    id: 3,
    icon: Zap,
    title: "We Build Your Site",
    description:
      "Our team gets to work immediately. You'll see progress updates and can provide feedback throughout the process. Most sites are completed within 7 business days.",
    timing: "7-day delivery promise",
    iconClass: "step-3",
    animationDelay: 800,
  },
  {
    id: 4,
    icon: CheckCircle,
    title: "Final Payment + Launch",
    description:
      "Once you approve the final site, we collect the remaining 75% and launch your site live. Your hosting and support start immediately.",
    timing: "Same-day launch after approval",
    iconClass: "step-4",
    animationDelay: 900,
  },
];

export const GUARANTEES = [
  {
    id: 1,
    icon: "✅",
    title: "7-Day Delivery",
    description: "Your site launches within one week",
    animationDelay: 1600,
  },
  {
    id: 2,
    icon: "✅",
    title: "First Year Hosting Free",
    description: "$180 value included in your price",
    animationDelay: 1700,
  },
  {
    id: 3,
    icon: "✅",
    title: "24-Hour Support",
    description: "Real humans answer your questions",
    animationDelay: 1800,
  },
  {
    id: 4,
    icon: "✅",
    title: "Unlimited Revisions",
    description: "We work until you're 100% satisfied",
    animationDelay: 1900,
  },
  {
    id: 5,
    icon: "✅",
    title: "Mobile Responsive",
    description: "Perfect on every device",
    animationDelay: 2000,
  },
  {
    id: 6,
    icon: "✅",
    title: "SEO Optimized",
    description: "Built to rank on Google",
    animationDelay: 2100,
  },
];

export const PRICING_CONFIG = {
  depositPercentage: 0.25,
  finalPercentage: 0.75,
  defaultEstimate: 999,
};
